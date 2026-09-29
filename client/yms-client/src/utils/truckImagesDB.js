

let db;
const storeName = 'images'
const dbName = 'YMSClient'
const {indexedDB} = window;

// console.log('truckImagesDB')

const storeExists = async () => {
  return new Promise((resolve) => {
    const req = indexedDB.open(dbName)
    req.onsuccess = () => {
      db = req.result
      const exists = db.objectStoreNames.contains('images')
      db.close()
      console.log('exists', exists)
      resolve(exists)
    }
    req.onerror = () => resolve(false)
  })
}

const getCurrentVersion = async () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName)
    req.onsuccess = () => {
      db = req.result
      const version = db.version
      db.close()
      resolve(version)
    } 
    req.onerror = () => reject(req.error)
  })
}


//creates db if first time opening
//otherwise accesses db and sets to db
export const openDb = async (version) => {
  return new Promise((resolve, reject) => {

    const req = indexedDB.open(dbName, version)
    req.onsuccess = function(e) {
      db = this.result;
      console.log('open indexedDB done')
    };
    
    req.onerror = function (e) {
      console.log('opendb error: ', e.target.errorCode)
      reject(e.target.errorCode)
    }
    
    req.onupgradeneeded = function (e) {
      console.log('opendb.onupgradeneeded')
      // id is 'delivery_detail_id' of containers
      const store = e.currentTarget.result.createObjectStore(
        'images', {keyPath: 'id'}
      )
      store.createIndex('truck_idx', 'truck_id')
    }
  })
}


export const openDatabase = async () => {
  const exists = await storeExists(storeName, dbName)
  console.log('exists', exists)
  if (exists === false) {
    console.log('does not exist')
    const currentVersion = await getCurrentVersion(dbName)
    const version = currentVersion + 1;
    return await openDb(version)

  }
  
  const currentVersion = await getCurrentVersion(dbName)
  return await openDb(currentVersion)
}


export function getObjectStore() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName)
    req.onsuccess = function(e) {
      const tx = db.transaction(['images'], 'readonly')
      const store = tx.objectStore('images')
      resolve(store)
    }
  })
}


// clears entire store
export function clearObjectStore() {
  return new Promise((resolve, reject) => {
    let msg = ''
    const req = indexedDB.open(dbName)
    req.onsuccess = function(e) {
      db = this.result;
      const tx = db.transaction(['images'], 'readwrite')
      const store = tx.objectStore('images')
      store.clear()
      msg = 'Store cleared'
      resolve(msg)
    }
    req.onerror = function(e) {
      console.error('clearObjectStore:', e.target.errorCode)
      msg = this.error
      reject(msg)
    }
  })
}

export const deleteObjectStore = async () => {
  const version = await getCurrentVersion(dbName)
  const newVersion = version + 1
  return new Promise((resolve, reject) => {
  let msg = ''
  const req = indexedDB.open(dbName, newVersion)
  req.onsuccess = function(e) {
    db = this.result
    db.deleteObjectStore(storeName)
    msg = 'Store Deleted'
    resolve(msg)
  }
  req.onerror = function(e) {
    console.error('clearObjectStore:', e.target.errorCode)
    msg = this.error
    reject(msg)
  }
})
}


// deletes one item by its ID
export function deleteItemByID(id) {
  console.log('id', id)
  let msg 
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName)
    req.onsuccess = function(e) {
      db = this.result
      const tx = db.transaction('images', 'readwrite')
      const store = tx.objectStore('images')
      const del = store.delete(id)
      
      del.onsuccess = function() {
        msg = `Item ${id} successfully deleted`
        console.log(msg)
        resolve(msg)
      }
      del.onerror = function(e) {
        msg = `Error deleting item: ${e.target.error}`
        console.log(msg)
        reject(err)
      }
    }
    })
}

// adds item to db
export async function addToDB(object) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName)
    req.onsuccess = function(e) {
      db = this.result
      const tx = db.transaction('images', 'readwrite')
      const store = tx.objectStore('images')
      let add
      let msg
      try {
        add = store.add(object)
      } catch (e) {
        throw e
      }
      add.onsuccess = function(e) {
        console.log('insertion to indexedDB successful')
        const msg = {success: true, data: object}
        console.log(msg.data)
        resolve(msg)
      }
      add.onerror = function() {
        console.error('error adding to indexedDB', this.error)
        msg = this.error
        reject(msg)
      }
    }
    })
  }

// deletes db
export function deleteDB() {
  return new Promise((resolve, reject) => {

    const req = indexedDB.deleteDatabase(dbName)
    req.onsuccess = (e) => {
      console.log(`Database ${dbName} delete successfully`)
      resolve(e.target.result)
    }
    req.onerror = (e) => {
      console.log(`Error deleting ${dbName}`, e.target.error)
      reject(e.target.error)
    }
    req.onblocked = (e) => {
      console.warn(`Deletion of ${dbName} blocked. Please close other tabs using this database`)
      resolve(e.target.result)
    }
  })
}

// gets item by provided idex
// currently only looking at container index
export function getItemByIndex(item) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName)
    req.onsuccess = function(e) {
      db = this.result
      const tx = db.transaction('images', 'readonly')
      const store = tx.objectStore('images')
      const index = store.index('truck_idx')
      const get = index.getAll(item)
      get.onsuccess = (e) => {
        resolve(e.target.result)
      }
      get.onerror = (e) => {
        reject(e.target.error)
      }
    }
    req.onerror = function(e) {
      console.log(e.target.errorCode)
      reject(e.target.errorCode)
    }
  })
}

// gets all items
export async function getAllItems() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName)
    req.onsuccess = function(e) {
      db = this.result
      const tx = db.transaction('images', 'readonly');
      const store = tx.objectStore('images');
      const all = store.getAll()
      all.onsuccess = function (e) {
        resolve(e.target.result)
      }
      all.onerror = (e) => {
        console.log('error', e.target.errorCode)
        reject(e.target.errorCode)
      }
    }
    req.onerror =(e) => {
      console.log('error', e.target.errorCode)
      reject(e.target.errorCode)
    }
    })
}


/*
await getItemById(delivery_detail_id)
*/
// gets one item by its ID
export function getItemById(id) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName)
    req.onsuccess = function(e) {
      db = this.result
      const tx = db.transaction('images', 'readonly');
      const store = tx.objectStore('images')
      const get = store.get(id)
      get.onsuccess = (e) => {
        resolve(e.target.result)
      }
      get.onerror = (e) => {
        reject(e.target.error)
      }
    }
    req.onerror = function(e) {
      reject(e.target.errorCode)
    }
  })
  }

export function iterateImages() {
  return new Promise((resolve, reject) => {
    let array = []
    const r = indexedDB.open(dbName)
    r.onsuccess = function(e) {
      db = this.result
      const tx = db.transaction(['images'], 'readonly')
      const index = tx.objectStore('images').index('truck_idx')
      const req = index.openCursor()
      
      req.onsuccess = function(e) {
        const cursor = this.result
        array.push(cursor)
        resolve(array)
        
        if (cursor) {
          // console.log({
          //   id: cursor.value.id,
          //   user: cursor.value.user,
          //   truck_id: cursor.value.truck_id
          // })
          cursor.continue()
        } else {
          console.log('no more images')
        }
      }
    }
  })
  }
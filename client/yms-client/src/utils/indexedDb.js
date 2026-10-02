let db;

const storeName = 'truckPhotos'
const dbName = 'YMSClient'
const {indexedDB} = window;

// console.log('indexedDB')

export const storeExists = async () => {
  return new Promise((resolve) => {
    const req = indexedDB.open('YMSClient')
    req.onsuccess = () => {
      db = req.result
      const {version} = db
      const exists = db.objectStoreNames.contains('truckPhotos')
      const results = {exists, version}
      console.log(results)
      db.close()
      resolve(results)
    }
    req.onerror = () => resolve(false)
  })
}

const getCurrentVersion = async () => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('YMSClient')
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
  const req = indexedDB.open(dbName, version)
  req.onsuccess = function(e) {
    db = this.result;
    console.log('open indexedDB done')
  };

  req.onerror = function (e) {
    console.log('opendb error: ', e.target.errorCode)
  }

  req.onupgradeneeded = function (e) {
    console.log('opendb.onupgradeneeded')
    // id is 'delivery_detail_id' of containers
    const store = e.currentTarget.result.createObjectStore(
      'truckPhotos', {keyPath: 'id'}
    )
    store.createIndex('user', 'user', {unique: false})
    store.createIndex('container', 'container', {unique: false})
    store.createIndex('truckID', 'truckID', {unique: false})
  }
}

export const openDatabase = async (s) => {
  const result = await storeExists('truckPhotos', 'YMSClient')
  const {exists} = result
  console.log(`${'truckPhotos'} and ${'YMSClient'} exists`, exists)
  if (!exists || db.objectStoreNames.length === 0) {
    const currentVersion = await getCurrentVersion('YMSClient')
    const version = currentVersion + 1
    return await openDb(version)
  }
  
  const currentVersion = await getCurrentVersion('YMSClient')
  return await openDb(currentVersion)
}


export function getObjectStore() {
  // openDatabase()
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('YMSClient')
    req.onsuccess = function(e) {
      db = this.result
      const tx = db.transaction('truckPhotos', 'readonly')
      const store = tx.objectStore('truckPhotos')
      resolve(store)

    }
    // console.log('db', db)
  })
}

// clears entire store
export function clearObjectStore() {
  return new Promise((resolve, reject) => {
    let msg = ''
    const req = indexedDB.open(dbName)
    req.onsuccess = function(e) {
      db = this.result
      const tx = db.transaction('truckPhotos', 'readwrite')
      const store = tx.objectStore('truckPhotos')
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
  let msg 
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName)
    req.onsuccess = function(e) {
      db = this.result;
      const tx = db.transaction('truckPhotos', 'readwrite')
      const store = tx.objectStore('truckPhotos')
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
      db = this.result;
      const tx = db.transaction('truckPhotos', 'readwrite')
      const store = tx.objectStore('truckPhotos')
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

    const req = window.indexedDB.deleteDatabase(dbName)
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
      db = this.result;
      const tx = db.transaction('truckPhotos', 'readonly')
      const store = tx.objectStore('truckPhotos')
      const index = store.index('container')
      const get = index.get(item)
      
      get.onsuccess = (e) => {
        resolve(e.target.result)
      }
      get.onerror = (e) => {
        reject(e.target.error)
      }
    }
  })
}

// gets all items
export async function getAllItems() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('YMSClient')
    req.onsuccess = function(e)  {
      db = this.result
      const tx = db.transaction(['truckPhotos'], 'readonly');
      const store = tx.objectStore('truckPhotos');
      const all = store.getAll()
      all.onsuccess = function (e) {
        resolve(e.target.result)
      }
      all.onerror = (e) => {
        reject(e.target.error)
      }
    }
    req.onerror = (e) => {
      resolve(e.target.errorCode)
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
    req.onsuccess = function (e) {
      db = this.result
      const tx = db.transaction(['truckPhotos'], 'readonly');
      const store = tx.objectStore('truckPhotos')
      const get = store.get(id)
      get.onsuccess = function (e) {
        resolve(e.target.result)
      }
    }
    req.onerror = (e) => {
      reject(e.target.error)
    }
  })
  }

let db;

//creates db if first time opening
//otherwise accesses db and sets to db
export function openDb() {
  const req = window.indexedDB.open('YMSClient')
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

export function getObjectStore() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('truckPhotos', 'readwrite')
    const store = tx.objectStore('truckPhotos')
    resolve(store)
  })
}

// clears entire store
export function clearObjectStore() {
  openDb()
  return new Promise((resolve, reject) => {
    let msg = ''
    // const store = getObjectStore('truckPhotos', 'readwrite')
    const tx = db.transaction('truckPhotos', 'readwrite')
    const store = tx.objectStore('truckPhotos')
    const req = store.clear()
    req.onsuccess = function(e) {
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


// deletes one item by its ID
export function deleteItemByID(id) {
  openDb()
  let msg 
  return new Promise((resolve, reject) => {
    const tx = db.transaction('truckPhotos', 'readwrite')
    const store = tx.objectStore('truckPhotos')
    const req = store.delete(id)

    req.onsuccess = function() {
      msg = `Item ${id} successfully deleted`
      resolve(msg)
    }
    req.onerror = function(e) {
      msg = `Error deleting item: ${e.target.error}`
      reject(err)
    }
  })
}

// adds item to db
export function addToDB(object) {
  openDb()
  return new Promise((resolve, reject) => {

    const tx = db.transaction('truckPhotos', 'readwrite')
    const store = tx.objectStore('truckPhotos')
    let req
    let msg
    try {
      req = store.add(object)
    } catch (e) {
      throw e
    }
    req.onsuccess = function(e) {
      console.log('insertion to indexedDB successful')
      const msg = {success: true, data: object}
      resolve(msg)
    }
    req.onerror = function() {
      console.error('error adding to indexedDB', this.error)
      msg = this.error
      reject(msg)
    }
  })
}

// deletes db
export function deleteDB(name) {
  return new Promise((resolve, reject) => {

    const req = window.indexedDB.deleteDatabase(name)
    req.onsuccess = (e) => {
      console.log(`Database ${name} delete successfully`)
      resolve(e.target.result)
    }
    req.onerror = (e) => {
      console.log(`Error deleting ${name}`, e.target.error)
      reject(e.target.error)
    }
    req.onblocked = (e) => {
      console.warn(`Deletion of ${name} blocked. Please close other tabs using this database`)
      resolve(e.target.result)
    }
  })
}

// gets item by provided idex
// currently only looking at container index
export function getItemByIndex(item) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('truckPhotos', 'readonly')
    const store = tx.objectStore('truckPhotos')
    const index = store.index('container')
    const req = index.get(item)
    
    req.onsuccess = (e) => {
      resolve(e.target.result)
    }
    req.onerror = (e) => {
      reject(e.target.error)
    }
  })
}

// gets all items
export function getAllItems() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('truckPhotos', 'readonly');
    const store = tx.objectStore('truckPhotos');
    const all = store.getAll()
    all.onsuccess = function (e) {
      resolve(e.target.result)
    }
    all.onerror = (e) => {
      reject(e.target.error)
    }
  })
}


/*
await getItemById(delivery_detail_id)
*/
// gets one item by its ID
export function getItemById(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('truckPhotos', 'readonly');
    const store = tx.objectStore('truckPhotos')
    const req = store.get(id)
    req.onsuccess = (e) => {
      resolve(e.target.result)
    }
    req.onerror = (e) => {
      reject(e.target.error)
    }
  })
  }

openDb();
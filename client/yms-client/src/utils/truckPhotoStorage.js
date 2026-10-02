import {openDB} from 'idb'

// get, getKey, getAll, getAllKeys, count, put, add, delete, and clear
// db.get

const dbName = 'YMSClient'


async function createIndexes() {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('truckPhotos')) {
        const truckStore = db.createObjectStore('truckPhotos', {
          keyPath: 'id'
        });
        truckStore.createIndex('cont_idx', 'cont_name');
      }

      if (!db.objectStoreNames.contains('images')) {
        const truckStore = db.createObjectStore('images', {
          keyPath: 'id'
        });
        truckStore.createIndex('truck_idx', 'truck_id');
      }
    }
  })  
}

createIndexes()

export async function addToDB(object) {
  const db = await openDB(dbName, 1, {
    upgrade (db) {
      if (!db.objectStoreNames.contains('truckPhotos')) {
        const store = db.createObjectStore('truckPhotos', {keyPath: 'id'})
        store.createIndex('cont_idx', 'cont_name');
      }
    }
  })
  try {
    db.put('truckPhotos', object)
    console.log('insertion to indexedDB successful')
    return 'success'
  } catch (err) {
    console.error('error inserting into iDB', err.message)
  }
  
}

export async function getAllItems() {
  const values = await db.getAll('truckPhotos')
  console.log(values)
  return values
}

export async function getItemById(id) {
  const db = await openDB(dbName, 1)
  try { 
    const value = await db.get('truckPhotos', id)
    return value
  } catch (err) {
    console.error('error getting Item', err.message)
  }
}

export async function getObjectStore() {
  const tx = db.transaction('truckPhotos')
  const store = tx.store;
  return store
}

export async function deleteByID(id) {
  const db = await openDB(dbName, 1)
  try {
    const del = await db.delete('truckPhotos', id)
    console.log(`${id} deleted successfully`)
  } catch (err) {
    console.error(`error deleting item ${id}`, err.message)
  }
}
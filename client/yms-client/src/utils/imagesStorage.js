import {openDB} from 'idb'

// get, getKey, getAll, getAllKeys, count, put, add, delete, and clear
// db.get

const dbName = 'YMSClient'

const db = await openDB(dbName, 1, {
  upgrade(db) {
    const store = db.createObjectStore('images', {
      keyPath: 'id'
    });
    store.createIndex('truck_idx', 'truck_id');
  }
})

export async function addToDB(object) {
  console.log(db)
  try {
    const result = db.put('images', object)
    return result
  } catch (err) {
    console.error('error inserting into iDB', err.message)
  }
  
}

export async function getAllItems() {
  const values = await db.getAll('images')
  console.log(values)
  return values
}

export async function getItemById(id) {
  const value = await db.get('images', id)
  return value
}

export async function getObjectStore() {
  const tx = db.transaction('images')
  const store = tx.store;
  return store
}

export async function deleteByID(id) {
  const db = await openDB(dbName, 1)
  try { 
    const del = await db.delete('images', id)
    console.log(`${id} deleted successfully`)
    return del
  } catch (err) {
     console.error(`error deleting item ${id}`, err.message)
  }
}

export async function getItemByIndex(index) {
  const value = await db.getAllFromIndex('images', 'truck_idx',  index)
  return value
}
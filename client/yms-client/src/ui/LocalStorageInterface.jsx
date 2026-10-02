// import { getObjectStore, clearObjectStore, addToDB, deleteDB, getItemByIndex, getAllItems, getItemById, deleteItemByID, openDatabase, deleteObjectStore, storeExists } from "../utils/indexedDb"
import { addToDB, getAllItems, getItemById, getObjectStore } from "../utils/truckPhotoStorage"
// import { indexed } from "../utils/indexedDb"
import { useEffect, useState } from "react"
import Button from "../components/Button"
import toast from "react-hot-toast"
import Loader from "../components/Loader"

function LocalStorageInterface() {
  const [store, setStore] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // const index = indexed()

  // useEffect(() => {
  //   setIsLoading(true)
  //   async function getItems() {
  //     // openDatabase()
  //     const exist = await storeExists()
  //     const {exists} = exist
  //     if (!exists) return;

  //     const req = await getAllItems()
  //     setItems(req)
  //   }

  //   getItems()
  //   setIsLoading(false)
  // }, [])

  const handleCapture = async (e) => {
  const file = e.target.files[0];
  try {
    if (file) {
      const data = await convertToBase64(file)
      setPhoto(data)
      // const id = crypto.randomUUID()
      }
    }  catch (err) {
      console.log('error getting photo', err.message)
    }
  }

  const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader.onerror = () => {
      reject(error)
    }

  })
}


  // async function handleOpen() {
  //   openDatabase()
    

  // }

  function handleGetStore() {
    const s =  getObjectStore()
    setStore(s)
  }

  async function handleOpenStore() {
    const s = await getObjectStore()
    // console.log()
    console.log('store', s)
  }

  function handleAdd() {
    const id = 1
    const object = {
      id,
      user: 'anthony vauther',
      orderNumber: 2600429001,
      container: '10M',
      truckID: '2600429001T1',
      scanned: false,
      photo
    }
    console.log(addToDB(object))
  }

  async function handleDelete() {
    const result = await deleteObjectStore()
    console.log(result)
  }

  function handleDeleteDb() {
    deleteDB('YMSClient')
  }

  function handleSearch(e) {
    setSearchTerm(e)
  }

  function handleSubmit() {
    const item = searchTerm
    getItemByIndex(item)
    // console.log(returnedItem)
    // toast.success(returnedItem)
  }

  async function handleAll() {
    // const e = await storeExists()
    // const {exists} = e;
    // if (!exists) return;
    const result = await getAllItems()
    console.log(result)
  }

  async function handleGet() {
    // const id = searchTerm
    const item = await getItemById(1)
    console.log(item)
  }

  async function handleDeleteOne() {
    const result = await clearObjectStore()
    console.log(result)
  }

  return (
    <div>
      <h1>Interface for interacting with truckPhotos Store </h1>
      {/* <Button type='primary' onClick={handleOpen}>open db</Button> */}
      {/* <Button type='primary' onClick={handleGetStore}>get store</Button> */}
      {/* <Button type='primary' onClick={handleAdd}>add to db</Button>
       */}
      {/* <Button type='primary' onClick={handleDeleteOne}>clear store</Button>       */}
      {/* <Button type='primary' onClick={handleDelete}>delete store</Button> */}
      <Button type='primary' onClick={handleOpenStore}>see store</Button>
      <Button type='primary' onClick={handleAdd}>add one</Button>
      <Button type='primary' onClick={handleAll}>get all</Button>
      <Button type='primary' onClick={handleGet}>get by id</Button>
      <input className="bg-stone-100" type='text' onChange={(e) => handleSearch(e.target.value)}></input>
      <button onClick={handleSubmit}>search for item</button>
      <input className="relative self-center hover:cursor-pointer" id="camera-input" type="file" accept="image/" capture='environment' onChange={handleCapture} />

      {isLoading && <Loader text={table} /> }

      {!isLoading && <table>
        <thead>
          <tr>
            <th>user</th>
            <th>order number</th>
            <th>container</th>
            <th>truckID</th>
            <th>scanned</th>
            <th>photo</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.user}</td>
              <td>{item.orderNumber}</td>
              <td>{item.container}</td>
              <td>{item.truckID}</td>
              <td>{item.scanned}</td>
              <td><img src={item.truck_image || item.photo} className="w-20"></img></td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  )
}

export default LocalStorageInterface

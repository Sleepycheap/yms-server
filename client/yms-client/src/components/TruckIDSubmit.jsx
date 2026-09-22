import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux"
import { getContainerByID, getContainers, submitTruckImage, testPicPath } from "../utils/apiFunctions";
import { useEffect } from "react";
import qrlogo from '../assets/QrCode.png'
// import check from '../assets/checkmark.jpg'
import ScanTruckBarcode from "./ScanTruckBarcode";
import { useState } from "react";
import styles from './TruckIDSubmit.module.css'
import { addToDB, getItemByIndex} from "../utils/indexedDb";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { Buffer } from "node:buffer";
import axios from "axios";
// import { saveToBrowser } from "../utils/indexedDb";

/*
This component will allow the user to confirm the information of the container being submitted is correct, and allow either barcode scanning, or camera/photo upload
*/

function TruckIDSubmit({id, onCloseModal}) {
  const [truckPhoto, setTruckPhoto] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [photoSubmitted, setPhotoSubmitted] = useState(false)
  // const [imageName, setImageName] = useState('')
  const username = useSelector((state) => state.user.username)
  const userID = useSelector((state) => state.user.userID)
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const scannedContainer = useSelector((state) => state.picture.scannedContainer)
  
  


  const {isLoading, data:container, error} = useQuery({
      queryKey: ['containers', orderNumber],
      queryFn: async () => {
        const data = await getContainers(orderNumber)
        return data
      },
      select: (containers) => containers.find((container) => container.delivery_detail_id === id)
    })
    
  const {delivery_detail_id, cont_name, cont_qty, cont_gross_wt, item_description, order_number, shipping_instructions} = container;

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

  async function convertForSubmit(file) {
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await axios.post('http://localhost:8080', fd)
      const {data} = res
      console.log('data', data)
      // setImageName(data)
      return data
    } catch (err) {
      console.log('error converting', err.message)
    }
  }
  
  const handleCapture = async (e) => {
    const file = e.target.files[0];
    try {
      if (file) {
        // console.log('file', file)
        const data = await convertToBase64(file)
        setPhoto(data)
        // const id = crypto.randomUUID()
        const object = {
          user: username,
          orderNumber,
          container: cont_name,
          truck_id: selectedTruck,
          scanned: scannedContainer ? true : false,
          truck_image: data
        }
        
        const imageName = await convertForSubmit(file)
        
        const notif = addToDB(object)
        // console.log('test', notif)

        function convertToBuffer(data) {
          const b = Buffer.from(data, 'base64');
          return b
        }

        // const truck_image = convertToBuffer(data)

        // console.log('image name', imageName)

        const photo = {
          truck_id: selectedTruck, truck_image: imageName
        }

        // console.log('photo', photo)

        setPhotoSubmitted(true)
        setTruckPhoto(photo)
      }
    }  catch (err) {
      console.log('error getting photo', err.message)
    }
  }

  async function handleSubmit(truckPhoto) {
    const {truck_id, truck_image} = truckPhoto
    const user_id = userID
    try {
      const result = await submitTruckImage(truck_id, user_id, truck_image)
      onCloseModal()
    } catch (err) {
      console.log('error submitting', err.message)
      toast.error('error submitting', err.message)
    }
  }
    



  return (
    <>
    {scanning && <ScanTruckBarcode onClose={() =>setScanning(false)} />}
    {!scanning && <div className="w-200">
      {/* <button onClick={handleDelete}>delete db</button>
      <br></br>
      <button onClick={handleRetrieveFromIndex}>get photos</button>
      <botton onClick={handleCreate}>create database</botton> */}
      <h1>Container Loading Confirmation</h1>
      <br>
      </br>
      <p>I, {username.toUpperCase()} have confirmed container {cont_name ? cont_name : 'container'} for {orderNumber} has been loaded onto {selectedTruck}  </p>
      <br>
      </br>
      <p>If any of the information below is not correct, click back and fix the issue</p>
      <br></br>
      <table>
        <thead>
          <tr>
            <th>Container</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{cont_name ? cont_name : 'container'}</td>
            <td>{item_description ? item_description : 'description'}</td>
            <td>{cont_qty ? cont_qty : 'qty' }</td>
            <td>{cont_gross_wt ? cont_gross_wt : 'weight' }</td>
          </tr>
        </tbody>  
      </table>

      <div className='grid grid-cols-3 grid-rows-2'>
        <div className='row-start-1  col-span-3 grid grid-cols-3'>
          <h1 className="col-start-1 relative left-20 underline">Scan Barcode</h1>
          <h1 className="col-start-3 underline">Take/Upload a Photo</h1>
        </div>

        <div className="flex  w-30 relative left-18">
          <span className="self-center">
          {scannedContainer ? '✅' : ''  }
          </span>
          <button type='button' className="bg-gray-50 w-10 hover:cursor-pointer hover:shadow-2xl/30 hover:shadow-stone-900 hover:ring-2 hover:ring-gray-600 relative left-8" onClick={() => setScanning(true)} ><img src={qrlogo}></img></button>
        </div>

        <div className="relative left-30 w-100 flex justify-between">
          <div className="grid ">
          <label className="relative 
           self-center col-start-1">Take/upload a Photo:</label>
          {/* <span className="w-5"></span> */}
          <input className="relative self-center hover:cursor-pointer" id="camera-input" type="file" accept="image/" capture='environment' onChange={handleCapture} />
          </div>
          <img className="w-20 h-10 col-start-3 row-start-2" src={photo} />
          {photoSubmitted && <Button type='secondary' onClick={() => handleSubmit(truckPhoto)}>Confirm</Button>}
        </div>

      </div>  
    </div>}
    </>
  )
}

export default TruckIDSubmit

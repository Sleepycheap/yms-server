import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux"
import { getContainerByID, getContainers } from "../utils/apiFunctions";
import { useEffect } from "react";
import qrlogo from '../assets/QrCode.png'
// import check from '../assets/checkmark.jpg'
import ScanTruckBarcode from "./ScanTruckBarcode";
import { useState } from "react";
import styles from './TruckIDSubmit.module.css'

/*
This component will allow the user to confirm the information of the container being submitted is correct, and allow either barcode scanning, or camera/photo upload
*/

function TruckIDSubmit({id, onCloseModal}) {
  const [scanning, setScanning] = useState(false)
  const [photo, setPhoto] = useState(null)
  const username = useSelector((state) => state.user.username)
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
    
  const {cont_name, cont_qty, cont_gross_wt, item_description, order_number, shipping_instructions} = container;

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
  
  const handleCapture = async (e) => {
    const file = e.target.files[0];
    try {
      if (file) {
        const data = await convertToBase64(file)
        setPhoto(data)
      }
    }  catch (err) {
      console.log('error getting photo', err.message)
    }
  }
    



  return (
    <>
    {scanning && <ScanTruckBarcode onClose={() =>setScanning(false)} />}
    {!scanning && <div className="w-200">
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
        </div>

      </div>  
    </div>}
    </>
  )
}

export default TruckIDSubmit

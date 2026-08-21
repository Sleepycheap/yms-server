import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState, useCallback, useRef } from "react";
import { setTruckIDs, setSelectedTruck, getTruckIDs, getOrg, getSelectedTruck } from "./truckSlice";
import { getOrderNumber, setOrderNumber } from "../order/orderSlice";
import {updateOrgCode} from '../user/userSlice'
import { setScannedTruck } from "../pictures/pictureSlice";
import CreateTruck from "./CreateTruck";
import TakePicture from "../../components/TakePicture";
import Webcam from "react-webcam";
import axios from 'axios'
import Tesseract from "tesseract.js";
import fs from 'node:fs'
import Button from "../../ui/Button";



function TruckSelection() {
  const [isLoading, setIsLoading] = useState(false)
  const [createTruck, setCreateTruck] = useState(false)
  const [error, setError] = useState('')
  const [takePhoto, setTakePhoto] = useState(false)
  const [imgSrc, setImgSrc] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [progress, setProgress] = useState(0)
  const scannedTruck = useSelector((state) => state.picture.scannedTruck)
  const orgCode = useSelector((state) => state.user.orgCode)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const trucks = useSelector((state) => state.truck.truckIDs)
  const dispatch = useDispatch()
  
  const webcamRef = useRef(null)


  useEffect(() => {
    let array = [];
    setIsLoading(true);
    async function truckList() {
      try {
        setError("");
        const response = await axios.get(`http://localhost:8080/api/trucks?org_code=${orgCode}`)
        const {data} = response;
        for (let i = 0; i < data.length; i++) {
          const truckID = data[i]
          array.push(truckID)
        }
        console.log('array', array)
        dispatch(setTruckIDs(array))        
      } catch (err) {
        console.log('there was an error getting truck IDs', err.message)
        setError(err)
      } finally {
        setIsLoading(false)
      }
      }

      truckList();

  }, [orgCode])

    const capture = useCallback(async () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc)
      dispatch(setScannedTruck(imageSrc))

      const dataURL =

      setIsLoading(true)
      
      try {
        const {data: {text}} = await Tesseract.recognize(
          imageSrc, 'eng',
          {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                setProgress(Math.round(m.progress * 100))
              }
            }
          }
        );

        setExtractedText(text)
      } catch (err) {
        console.log('error recognizing text', err.message)
      } finally {
        setIsLoading(false)
      }

    }, [webcamRef, setImgSrc]);


  function handleOrgSelect(e) {
      dispatch(updateOrgCode(e))
    }

   function handleTruckSelect(e) {
    dispatch(setSelectedTruck(e))
  }

  function handleOrderSelect(e) {
    dispatch(setOrderNumber(e))
  }

  function handlePhoto() {
    setTakePhoto(true)
  }

  function stopCamera() {
    setTakePhoto(false)
  }
  
    function handleClick() {
    setCreateTruck(true)
  }
  return (
    <>
    {takePhoto && (
      <div className="flex">
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg"/>
        <button onClick={capture}>Take Picture</button>
        {imgSrc && (
          <img src={scannedTruck} className="justify-self-center size-40" />
        )}
        {isLoading ? (
          <p>Loading Text...</p>
        ) : (
        <div>{extractedText || 'No text detected yet'}</div>
        )}
        <button onClick={stopCamera}>Done with pictures</button>
      </div>
    )}
    {!takePhoto && (
      <div className="grid grid-rows-5 grid-cols-3 gap-5 h-80">
        <h1 className="row-start-1 col-start-2 text-center self-center text-2xl border-b-2 border-stone-500">Select Truck</h1>
          <div className="grid grid-rows-4 grid-cols-1 row-start-2 col-start-2 row-span-4 justify-self-center items-center justify-evenly">
            <div className="flex w-120 justify-evenly">
              <label htmlFor="orgCode" className="text-2xl">Organization</label>
              <select className="text-center appearance-none bg-gray-50 w-45 relative left-2" value={orgCode} onChange={e => handleOrgSelect(e.target.value)}>
                <option value=''>SELECT A PLANT</option>
                <option value="ANN">Annville</option>
                <option value="VIS">Visalia</option>
                <option value="JAC">Jackson</option>
                <option value="MTY">Monterrey</option>
                <option value="STJ">St. Joseph</option>
                <option value="RAI">Rainsville</option>
                <option value="EVA">Evansville</option>
              </select>
            </div>
            <div className="row-start-2 flex justify-evenly w-120">
              <label htmlFor='order-number' className="text-2xl">Order Number</label>
              <input type='text' name="order-number" id='order-number' className="bg-gray-50 w-45" value={orderNumber} onChange={e => handleOrderSelect(e.target.value)}/>
            </div>
            <div className="row-start-3 flex justify-evenly w-120">
              <label htmlFor='scan-truck' className="text-2xl">Scan Truck</label>
              <button type='button' className="bg-gray-50 w-45 relative left-4 hover:bg-gray-200" onClick={handlePhoto}><img scr='' /></button>
            </div>
            <div className="row-start-4 flex justify-evenly w-120">
              <label htmlFor='truck-id' className="text-2xl">Truck ID</label>
              <select className="text-center appearance-none bg-gray-50 w-45 relative left-6" value={selectedTruck}  onChange={e => handleTruckSelect(e.target.value)}>
                  <option value="">
                    Please select a truck ID
                  </option>
                  {trucks.map((truck, index) => (
                    <option value={truck} key={index}>{truck}</option>
                  ))}
              </select>
            </div>
            <Button type="primary" onClick={handleClick}>Click here to create a truck</Button>
        </div >
         
      </div>    
  )}
      {
      createTruck && !takePhoto &&(
        <CreateTruck />
      )
    }
    </>

  )
}

export default TruckSelection

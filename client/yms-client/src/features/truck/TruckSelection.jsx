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
import {createWorker} from 'tesseract.js'
// import Tesseract from "tesseract.js";
// import fs, { read } from 'node:fs'
import Button from "../../ui/Button";



const url = 'http://localhost:8080/api'

// const Tesseract = window.Tesseract

// const worker = await createWorker('eng', 1, {
//   workerPath: '../../assets/Tesseract/worker.min.js',
//   langPath: 'https://tessdata.projectnaptha.com/#400-best-higher-ocr-accuracy',
//   corePath: '../../assets/Tesseract/core',
// });




function TruckSelection() {
  const [isLoading, setIsLoading] = useState(false)
  const [createTruck, setCreateTruck] = useState(false)
  const [error, setError] = useState('')
  const [takePhoto, setTakePhoto] = useState(false)
  const [imgSrc, setImgSrc] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [preProcess, setPreProcess] = useState(null)
  const [progress, setProgress] = useState(0)
  const [videoConstraints, setVideoConstraints] = useState({facingMode: {exact: "environment"}})
  const scannedTruck = useSelector((state) => state.picture.scannedTruck)
  const orgCode = useSelector((state) => state.user.orgCode)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const trucks = useSelector((state) => state.truck.truckIDs)
  const dispatch = useDispatch()

  const canvasRef = useRef(null)
  const webcamRef = useRef(null)


  useEffect(() => {
    let array = [];
    setIsLoading(true);
    async function truckList() {
      try {
        setError("");
        const response = await axios.get(`${url}/trucks?org_code=${orgCode}`)
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

  function processImage() {
    const canvas = canvasRef.current;
    console.log('camvas', canvas)
    const ctx = canvas.getContext('2d')

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // 2. Extract pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 3. Loop through pixels to apply Grayscale & Thresholding
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Convert to Grayscale using luminosity formula
      const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Apply Thresholding (Binary Black and White)
      // Adjust 128 (middle point) based on your image lighting
      const thresholdColor = grayscale > 128 ? 255 : 0;

      data[i] = thresholdColor;     // Red
      data[i + 1] = thresholdColor; // Green
      data[i + 2] = thresholdColor; // Blue
    }

    ctx.putImageData(imageData, 0, 0);

    console.log('ctx', ctx)

    const processedDataUrl = canvas.toDataUrl('image/jpeg')
    console.log('processed', processedDataUrl)
    return processedDataUrl

  }


  const base64toBlob = async (image) => {
    const response = await fetch(image)
    console.log('res', response)
    const blob = await response.blob();
    console.log('blob response', blob)
    const url = URL.createObjectURL(blob)
    console.log('url', url)
    return url
  }

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const image = processImage(imageSrc)
    console.log('image', image)

    setImgSrc(imageSrc)
    dispatch(setScannedTruck(imageSrc))
  
    setIsLoading(true)

    
    try {
      const worker = await createWorker("eng");
      const {data: { text },} = await worker.recognize(image);
      console.log('extractedText', text)
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

  function clearPhoto() {
    dispatch(setScannedTruck(null))
    setExtractedText('')
    setImgSrc(null)
  }

  function handleConstraints() {
    if (videoConstraints.facingMode === 'user') {
      setVideoConstraints({facingMode: {exact: "environment"}})
    } else {
      setVideoConstraints({
        facingMode: 'user'
      })
    }
  }

  return (
    <>
    {takePhoto && (
      <div id='camera-screen' className="grid grid-rows-4 grid-cols-3 md:grid-cols-3 md:grid-rows-3 h-160 py-10">
        <div className={imgSrc ?  "hidden" :  "w-40 lg:w-120 justify-self-center lg:row-span-2 col-start-2 row-start-1" }>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={videoConstraints}/>
        </div>
        <div id='buttons' className="col-start-2 row-start-4  grid gap-5 justify-center">
          <span className="flex justify-around"><Button type='primary' onClick={capture}>Take Picture</Button><Button type='small' onClick={handleConstraints}>Click here to switch Front/Rear camera</Button> </span>
          <Button type='small' onClick={clearPhoto}>Re-take Photo</Button>
          <Button type='small' onClick={stopCamera}>Done with pictures</Button>
        </div>
        <div className={imgSrc ? "w-40 lg:w-120 justify-self-center lg:row-span-2 col-start-2 row-start-1" : ""}>
          {imgSrc &&  scannedTruck !== null && (
            <img src={scannedTruck} className="justify-self-center w-120" />
          )}
        </div>
        <div className="col-start-2 lg:col-start-3 content-center row-start-3 lg:row-start-1">
          <h1>Extracted Text from image</h1>
          <br />
          {isLoading ? (
            <p>Loading Text...</p>
          ) : (
            <p>{extractedText || 'No text detected yet'}</p>
          )}
        </div>
      </div>
    )}
    {!takePhoto && (
      <div id='main' className="grid grid-rows-5 grid-cols-3 gap-5 h-80">
        <h1 id='header' className="row-start-1 col-start-2 text-center self-center text-2xl border-b-2 border-stone-500">Select Truck</h1>
          <div id='options' className="grid grid-rows-4 grid-cols-1 row-start-2 col-start-2 row-span-4 justify-self-center items-center w-100 sm:w-120  ">
            <div id='org-select' className="flex sm:w-120  justify-evenly">
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
            <div id='order-num' className="row-start-2 flex justify-evenly sm:w-120">
              <label htmlFor='order-number' className="text-2xl">Order Number</label>
              <input type='text' name="order-number" id='order-number' className="bg-gray-50 w-45" value={orderNumber} onChange={e => handleOrderSelect(e.target.value)}/>
            </div>
            <div id='scan-truck' className="row-start-3 flex justify-evenly sm:w-120">
              <label htmlFor='scan-truck' className="text-2xl">Scan Truck</label>
              <button type='button' className="bg-gray-50 w-45 relative left-4 hover:bg-gray-200" onClick={handlePhoto}><img scr='' /></button>
            </div>
            <div id='truck-id-select' className="row-start-4 flex justify-evenly sm:w-120">
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

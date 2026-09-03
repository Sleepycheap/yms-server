import Webcam from "react-webcam";
import Button from "../ui/Button";
import Canvas from '../components/Canvas'
import {createWorker} from 'tesseract.js'
import {useState, useRef, useCallback, useEffect} from 'react'
import { useSelector } from "react-redux";
import { setScannedTruck } from "../features/pictures/pictureSlice";
import { useDispatch } from "react-redux";



function Camera({setTakePhoto}) {
  const canvasRef = useRef(null)
  // const [takePhoto, setTakePhoto] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [videoConstraints, setVideoConstraints] = useState({
    width: {ideal: 1920},
    height: {ideal : 1080},
    facingMode: {exact: "environment"}})
    const [isLoading, setIsLoading] = useState(false)
    const [extractedText, setExtractedText] = useState('')
    const [canvasElement, setCanvasElement] = useState(null)
    const scannedTruck = useSelector((state) => state.picture.scannedTruck)
    const dispatch = useDispatch();
    const webcamRef = useRef(null)
  

  

  useEffect(() => {
  setCanvasElement(canvasRef.current)
    // console.log('canvas', canvasRef)
  }, [])

  function processImage(image) {
      return new Promise((resolve) => {
  
        let processedDataUrl = ''
        try {
          const img = new Image();
          img.src = image
          img.onload = () => {
            const canvas = canvasRef.current;
  
            canvas.width = 1920
            canvas.height = 1080
  
            const ctx = canvas.getContext('2d')
            // console.log('ctx', ctx)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // 2. Extract pixel data
            
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
            // console.log('ctx', ctx)
            
            processedDataUrl = canvas.toBlob(resolve,'image/jpeg', 0.9)
            // setPreProcess(processedDataUrl)
            // console.log('processed', processedDataUrl)
          }
        } catch (err) {
          console.log('error', err.msg)
        }
        return processedDataUrl
      })
    }
  
      
      const capture = useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot(); // base64 data url
    
        const image = await processImage(imageSrc)
        setImgSrc(imageSrc)
        dispatch(setScannedTruck(imageSrc))
        // setPreProcess(canvasRef.current)
        console.log('processed', canvasRef.current)
      
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

  function clearPhoto() {
    dispatch(setScannedTruck(null))
    setExtractedText('')
    setImgSrc(null)
  }

  function stopCamera() {
    setTakePhoto(false)
  }

  function handleConstraints() {
  if (videoConstraints.facingMode === 'user') {
    setVideoConstraints({
      width: {ideal: 1920},
      height: {ideal : 1080},
      facingMode: {exact: "environment"}})
  } else {
    setVideoConstraints({
      width: {ideal: 1920},
      height: {ideal : 1080},
      facingMode: 'user'
    })
  }
}


  return (
    <div id='camera-screen' className="grid grid-rows-4 grid-cols-3 md:grid-cols-3 md:grid-rows-3 h-160 py-10">
        <div className={imgSrc ?  "hidden" :  "w-40 lg:w-120 justify-self-center lg:row-span-2 col-start-2 row-start-1" }>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" imageSmoothing={true} screenshotQuality={1} videoConstraints={videoConstraints}/>
        </div>
        <div id='buttons' className="col-start-2 row-start-4  grid gap-5 justify-center">
          <span className="flex justify-around"><Button type='primary' onClick={capture}>Take Picture</Button><Button type='small' onClick={handleConstraints}>Front/Rear Camera</Button> </span>
          <Button type='small' onClick={clearPhoto}>Re-take Photo</Button>
          <Button type='small' onClick={stopCamera}>Done with pictures</Button>
        </div>
        <div className={imgSrc ? "w-40 lg:w-120 justify-self-center lg:row-span-2 col-start-2 row-start-1" : ""}>
          <canvas ref={canvasRef}  className="hidden"/>
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
  )
}

export default Camera

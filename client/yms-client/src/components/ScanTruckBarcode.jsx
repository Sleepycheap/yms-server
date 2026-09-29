import Webcam from "react-webcam";
import Button from "../ui/Button";
import Canvas from '../components/Canvas'
import {useState, useRef, useCallback, useEffect} from 'react'
import { useSelector } from "react-redux";
import { setScannedContainer, setScannedTruck } from "../features/pictures/pictureSlice";
import { useDispatch } from "react-redux";
import { useZxing } from "react-zxing";
import { useNavigate } from "react-router-dom";
import confirmBeep from '../assets/Bleep.wav'




function ScanTruckBarcode({onClose}) {
  const canvasRef = useRef(null)
  // const [takePhoto, setTakePhoto] = useState(true)
  const [scanResult, setScanResult] = useState('')
  const [scanConfirm, setScanConfirm] = useState(false)
  const [imgSrc, setImgSrc] = useState(null)
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
  const {ref} = useZxing({
    onDecodeResult(result) {
      setScanConfirm(true)
      setScanResult(result.rawValue)
      dispatch(setScannedContainer(result.rawValue))
      capture()
      // handleScan()
      // handleScanTruck()
      
      // setScanQR(false)
    }
  })

  const navigate = useNavigate()

  useEffect(() => {
  setCanvasElement(canvasRef.current)
    // console.log('canvas', canvasRef)
  }, [])
  

  
  const capture = useCallback(async () => {
    playConfirm()
    
    const imageSrc = webcamRef.current.getScreenshot(); // base64 data url
    
    setImgSrc(imageSrc)
    dispatch(setScannedTruck(imageSrc))
    // setPreProcess(canvasRef.current)
    // console.log('processed', canvasRef.current)
    
    
    
          
  }, [webcamRef, setImgSrc]);
            
  function clearPhoto() {
    dispatch(setScannedTruck(null))
    setExtractedText('')
    setImgSrc(null)
  }
          
  function handleScan() {
    const result = scanResult;
    dispatch(setScannedContainer(result))
  }

  function playConfirm() {
    const audio = new Audio(confirmBeep)
    audio.play();
  }

  function handleReScan() {
    setScanConfirm(false)
    setScanResult('')
    dispatch(setScannedContainer(''))
    setImgSrc(null)
  }

  // function handleClick() {
    //   setIsOpenModal((show) => (!show))
    // }
    
    // function handleConstraints() {
    //   if (videoConstraints.facingMode === 'user') {
    //     setVideoConstraints({
    //       width: {ideal: 1920},
    //       height: {ideal : 1080},
    //       facingMode: {exact: "environment"}})
    //     } else {
    //       setVideoConstraints({
    //         width: {ideal: 1920},
    //         height: {ideal : 1080},
    //         facingMode: 'user'
    //       })
    //     }
    //   }
                
    //videoConstraints={videoConstraints}
                
  return (
    <div>
    {imgSrc && <div className="justify-self-center">
      <img src={imgSrc} />
      <p>Result: {scanResult}</p>
      <button onClick={handleReScan}>Re-scan</button>
      </div>}
      {!imgSrc && <div id='camera-screen' className="grid grid-rows-4 grid-cols-3 md:grid-cols-3 md:grid-rows-3 h-120 py-10">
        <div className={imgSrc ?  "hidden" :  "w-40 lg:w-120 justify-self-center lg:row-span-2 col-start-2 row-start-1" }>
          <video ref={ref} muted playsInline className="hidden" />
          <Webcam  audio={false} ref={webcamRef} screenshotFormat="image/jpeg" imageSmoothing={true} screenshotQuality={1} className={scanConfirm ? "border-5 border-yellow-400" : ''} />
        </div>

      </div>}
    </div>
  )
}

export default ScanTruckBarcode


  // function processImage(image) {
  //     return new Promise((resolve) => {
  
  //       let processedDataUrl = ''
  //       try {
  //         const img = new Image();
  //         img.src = image
  //         img.onload = () => {
  //           const canvas = canvasRef.current;
  
  //           canvas.width = 1920
  //           canvas.height = 1080
  
  //           const ctx = canvas.getContext('2d')
  //           // console.log('ctx', ctx)
  //           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //           const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //           const data = imageData.data;
            
  //           // 2. Extract pixel data
            
  //           // 3. Loop through pixels to apply Grayscale & Thresholding
  //           for (let i = 0; i < data.length; i += 4) {
  //             const r = data[i];
  //             const g = data[i + 1];
  //             const b = data[i + 2];
              
  //             // Convert to Grayscale using luminosity formula
  //             const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
              
  //             // Apply Thresholding (Binary Black and White)
  //             // Adjust 128 (middle point) based on your image lighting
  //             const thresholdColor = grayscale > 128 ? 255 : 0;
              
  //             data[i] = thresholdColor;     // Red
  //             data[i + 1] = thresholdColor; // Green
  //             data[i + 2] = thresholdColor; // Blue
  //           }
            
  //           ctx.putImageData(imageData, 0, 0);
  //           // console.log('ctx', ctx)
            
  //           processedDataUrl = canvas.toBlob(resolve,'image/jpeg', 0.9)
  //           // setPreProcess(processedDataUrl)
  //           // console.log('processed', processedDataUrl)
  //         }
  //       } catch (err) {
  //         console.log('error', err.msg)
  //       }
  //       return processedDataUrl
  //     })
  //   }
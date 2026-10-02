import { useDispatch, useSelector } from "react-redux"
import ScanTruckBarcode from "./ScanTruckBarcode"
import { useNavigate } from "react-router-dom"
// import { setScannedObject } from "../features/pictures/pictureSlice"
import {useState, useRef, useCallback, useEffect} from 'react'
import { setScannedContainer, setScannedTruck, setScannedObject } from "../pictures/pictureSlice";
import {useZxing} from 'react-zxing'
import Webcam from "react-webcam"
import confirmBeep from '../../assets/Bleep.wav'
import errorBeep from '../../assets/Beep.wav'
import toast from "react-hot-toast"
import Button from "../../components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loadContainer } from "../../utils/apiFunctions";




function ScannerInterface({onCloseModal, containers}) {
  const canvasRef = useRef(null)
  // const [takePhoto, setTakePhoto] = useState(true)
  const [scanResult, setScanResult] = useState('')
  const [scanConfirm, setScanConfirm] = useState(false)
  const [imgSrc, setImgSrc] = useState(null)
  const [contName, setContName] = useState('')
  const [videoConstraints, setVideoConstraints] = useState({
    width: {ideal: 1920},
    height: {ideal : 1080},
    facingMode: {exact: "environment"}})
  const [isLoading, setIsLoading] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [canvasElement, setCanvasElement] = useState(null)
  const scannedTruck = useSelector((state) => state.picture.scannedTruck)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const scannedContainer = useSelector((state) => state.picture.scannedContainer)
  const orgCode = useSelector((state) => state.user.orgCode)
  const dispatch = useDispatch();
  const webcamRef = useRef(null)
  const userID = useSelector((state) => state.user.userID)
  const {ref} = useZxing({
    onDecodeResult(result) {
      setScanConfirm(true)
      setScanResult(result.rawValue)
      dispatch(setScannedContainer(result.rawValue))
      capture()
    }
  })

  const navigate = useNavigate()

  const queryClient = useQueryClient()
  

  useEffect(() => {
  setCanvasElement(canvasRef.current)
    // console.log('canvas', canvasRef)
  }, [])
  

  const {isLoading: assigning, mutate: assignContainer, status, } = useMutation({
  mutationFn: ({order_number, cont_name, orgCode, selectedTruck, userID}) => {
    return loadContainer(order_number, cont_name, orgCode, selectedTruck, userID);
  },
  onSuccess: ()  => {
    toast.success(`${cont_name} successfully loaded onto ${selectedTruck}`)

        
      queryClient.invalidateQueries({
        queryKey: ['containers']
      }),
        
      queryClient.invalidateQueries({
        queryKey: ['truckInfo']
      })
  
        
  },
  onError: (err) => toast.error(err.message) 
  })

  
  const filter = containers.filter((container) => container.cont_name === contName)

  const {order_number, cont_name} = filter
  
  const capture = useCallback(async () => {
    playConfirm()
    
    const imageSrc = webcamRef.current.getScreenshot(); // base64 data url
    
    setImgSrc(imageSrc)
    dispatch(setScannedTruck(imageSrc))
    setContName(scannedContainer.split('|')[2])
    // console.log(cont_name)
    assignContainer({order_number, cont_name, orgCode, selectedTruck, userID})
    onCloseModal()          
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

  function handleClick() {
    if (!scannedContainer) {
      return onCloseModal()
    }
    const org_code = scannedContainer.split('|')[0]
    const order_number = scannedContainer.split('|')[1].split('|')[0]
    const cont_name = scannedContainer.split('|')[2]
    dispatch(setScannedObject({org_code, order_number, cont_name}))
    onCloseModal()
  }
  
  // console.log(containers)

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
          <Button type='primary' onClick={handleClick}>Done</Button>
        </div>
  )
}

export default ScannerInterface

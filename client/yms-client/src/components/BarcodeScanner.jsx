import { useState, useRef, useCallback, useEffect } from "react"
import { useZxing } from "react-zxing"
import { useSelector, useDispatch } from "react-redux"
import Webcam from 'react-webcam'
import confirmBeep from '../assets/Bleep.wav'
import errorBeep from '../assets/Beep.wav'


import { setScannedTruck, setScannedQRCode } from "../features/pictures/pictureSlice"
import { setSelectedTruck } from "../features/truck/truckSlice"
import toast from "react-hot-toast"
// import { setCanvasElement } from "../features/refs/canvasSlice"

function BarcodeScanner({setResult, result, stopScan}) {
  // const [result, setResult] = useState('')
  const canvasRef = useRef(null)
  const [errorPlaying, setErrorPlaying] = useState(false)
  const [canvasElement, setCanvasElement] = useState(null)
  const scannedQRCode = useSelector((state) => state.picture.scannedQRCode)
  // const pictureTest = useSelector((state) => state.picture.pictureTest)
  const dispatch = useDispatch()
  const webcamRef = useRef(null)

  const {ref} = useZxing({
    onDecodeResult(result) {
      const resultRegex = /^[a-zA-Z0-9 ]{16,}$/gm
      if (!resultRegex.test(result.rawValue)) {
        const audio = new Audio(errorBeep)
        audio.play()
        toast.error('This barcode is not a truck id. please scan the correct barcode type to assign truck id');
        stopScan()
        return;
      }
      setResult(result.rawValue)
      playConfirm()
      dispatch(setScannedQRCode(result.rawValue))
      dispatch(setSelectedTruck(result.rawValue))
      stopScan()
    }
  })

  useEffect(() => {
    setCanvasElement(canvasRef.current)
  }, [])

  // function handleStop() {
  //   playConfirm()

  // }

  function playConfirm() {
    const audio = new Audio(confirmBeep)
    audio.play();
  }

  // function playError() {
  //   if (!errorPlaying) return
  //   return;
  // }


  return (
<>
    <video ref={ref} muted playsInline />
    <p>
      <span> Last result:</span>
      <span>{result}</span>
      {/* <span>{scannedQRCode}</span> */}
    </p>
</>

  )
}

export default BarcodeScanner

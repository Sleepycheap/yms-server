import { useState } from "react"
import { useZxing } from "react-zxing"
import { useSelector, useDispatch } from "react-redux"
import { setScannedTruck, setScannedQRCode } from "../features/pictures/pictureSlice"
import { setSelectedTruck } from "../features/truck/truckSlice"

function BarcodeScanner({setResult, result}) {
  // const [result, setResult] = useState('')
  const scannedQRCode = useSelector((state) => state.picture.scannedQRCode)
  // const pictureTest = useSelector((state) => state.picture.pictureTest)
  const dispatch = useDispatch()
  const {ref} = useZxing({
    onDecodeResult(result) {
      setResult(result.rawValue)
      dispatch(setScannedQRCode(result.rawValue))
      dispatch(setSelectedTruck(result.rawValue))
      // dispatch(setScannedQRCode(result.rawValue))
      console.log('result', result)
    }
  })

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

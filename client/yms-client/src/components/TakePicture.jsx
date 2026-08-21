import { useCallback, useRef, useState } from "react"
import Webcam from "react-webcam";
import { useSelector, useDispatch } from "react-redux";
import {setScannedTruck} from '../features/pictures/pictureSlice'
import { useNavigate } from "react-router-dom";

function TakePicture() {
  const webcamRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const scannedTruck = useSelector((state) => state.picture.scannedTruck)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc)
    dispatch(setScannedTruck(imageSrc))
  }, [webcamRef, setImgSrc]);

  return (
    <div className="grid">
   <Webcam
    audio={false}
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    width={400}
    />
  <button onClick={capture}>Screenschot</button>
  {imgSrc && (
    <img src={scannedTruck} className="justify-self-center size-40"/>
  )}
  <button onClick={navigate('/')}>Go Back</button>
    </div>
  )
}

export default TakePicture

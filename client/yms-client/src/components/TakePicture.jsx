import { useCallback, useRef, useState } from "react"
import Webcam from "react-webcam";

function TakePicture() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc)
  }, [webcamRef, setImgSrc])

  return (
    <>
    <Webcam 
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
    /> 
    <button onClick={capture}>Take Picture</button>
      {imgSrc && (
        <img src={imgSrc} />
      )}
    </>
  )
}

export default TakePicture

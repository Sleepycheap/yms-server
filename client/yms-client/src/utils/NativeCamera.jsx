import { useState } from "react";


function NativeCamera() {
  const [photo, setPhoto] = useState(null)

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
    <div className="relative left-30 w-100 flex justify-between">
      <div className="grid ">
      <label className="relative 
      self-center col-start-1">Take/upload a Photo:</label>
    {/* <span className="w-5"></span> */}
    <input className="relative self-center hover:cursor-pointer" id="camera-input" type="file" accept="image/" capture='environment' onChange={handleCapture} />
      </div>
    <img className="w-20 h-10 col-start-3 row-start-2" src={photo} />
  </div>
  )
}
        
export default NativeCamera
        
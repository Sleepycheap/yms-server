// import { getPosition } from "../utils/getPosition"
// import { determineClosestPlant } from "../utils/geoLocation"
import { useEffect, useState, useRef} from "react"
import axios from "axios"
// import Canvas from "../components/Canvas"
// import BarcodeScanner from "../components/BarcodeScanner"
// import {BarcodeScanner, useScanning, useCamera, useStreamState, useTorch, BarcodeScannerProvider} from 'react-barcode-scanner' 
// import ScannerControls from "../components/ScannerControls"
import {useZxing} from 'react-zxing'
import Camera from "../components/Camera"
import Counter from "./Counter"
import Modal from "./Modal"
import ScanTruckBarcode from "../components/ScanTruckBarcode"
import LocalStorageInterface from "../components/LocalStorageInterface"
import ImagesStorageInterface from "../components/ImagesStorageInterface"
import { getTruckImage } from "../utils/apiFunctions"
import { useSelector } from "react-redux"

// import { insideCircle, distanceTo, toLatLon, getLongitude } from "geolocation-utils";


function Tests() {
  const [imgSelected, setImgSelected] = useState(false)
  const [images, setImages] = useState([])
  const userID = useSelector((state) => state.user.userID)

  async function handleGet() {
    let array = []
    const result = await getTruckImage(userID)
    const {exist} = result;
    const imgs = result.images;
    for (let i = 0; i < imgs.length; i++) {
      const {TRUCK_IMAGE} = imgs[i]
      const bytes = new Uint8Array(TRUCK_IMAGE.data)
      const base64String = bytes.toBase64();
      const img = `data:image/jpg;base64,${base64String}`
      array.push(img)
    }
    setImgSelected(true)
    setImages(array)
  }

  return (
    // <LocalStorageInterface />
    // <ImagesStorageInterface />
    <div>
      <h1>Image example</h1>
      <button onClick={handleGet}>get image</button>
      <ul>

      {imgSelected && images.map((image, index) => (
        <li key={index}>
        <img src={image} className="w-20"></img>
        </li>
      ))}
      </ul>
    </div>
  )
  
}

export default Tests

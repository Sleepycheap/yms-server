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
import { getTruckImage } from "../utils/apiFunctions"
import { useSelector } from "react-redux"

// import { insideCircle, distanceTo, toLatLon, getLongitude } from "geolocation-utils";


function Tests() {
  const [imgSelected, setImgSelected] = useState(false)
  const [image, setImage] = useState(null)
  const userID = useSelector((state) => state.user.userID)

  async function handleGet() {
    const result = await getTruckImage(userID)
    const {TRUCK_IMAGE} = result
    // console.log(TRUCK_IMAGE)
    const bytes = new Uint8Array(TRUCK_IMAGE.data)
    const base64String = bytes.toBase64();
    const img = `data:image/jpg;base64,${base64String}`
    console.log(img)
    setImgSelected(true)
    setImage(img)
  }

  return (
    // <LocalStorageInterface />

    <div>
      <h1>Image example</h1>
      <button onClick={handleGet}>get image</button>
      {imgSelected && <img src={image} className="w-200"></img>}
    </div>
  )
  
}

export default Tests

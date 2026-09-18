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

// import { insideCircle, distanceTo, toLatLon, getLongitude } from "geolocation-utils";


function Tests() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className="border-2 h-dvh">
      <div className="flex">
        <p>This is a test</p>
      </div>
      <button onClick={() => setIsOpenModal((show) => !show)}>Show Modal</button>
      {isOpenModal && <Modal onClose={() => setIsOpenModal(false)}><ScanTruckBarcode onCloseModal={() => setIsOpenModal(false)}/> </Modal>}
    </div>
  )
  
}

export default Tests

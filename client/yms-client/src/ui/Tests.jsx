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

// import { insideCircle, distanceTo, toLatLon, getLongitude } from "geolocation-utils";


function Tests() {

  return (
   <div>
    <h1>Compount component test</h1>

    <Counter>
      <Counter.Decrease icon="-" />
      <Counter.Count />
      <Counter.Increase icon="+" />
      {/* <Counter.Label>Counter</Counter.Label> */}
    </Counter>

   </div>

  )
  
}

export default Tests

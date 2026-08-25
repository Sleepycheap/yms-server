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

// import { insideCircle, distanceTo, toLatLon, getLongitude } from "geolocation-utils";


function Tests() {

  return (
    <Camera />

  )
  
}

export default Tests

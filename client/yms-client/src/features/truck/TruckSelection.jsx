import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState, useCallback, useRef } from "react";
import { setTruckIDs, setSelectedTruck, getTruckIDs, getOrg, getSelectedTruck } from "./truckSlice";
import { getOrderNumber, setOrderNumber } from "../order/orderSlice";
import {updateOrgCode} from '../user/userSlice'
import { setScannedTruck } from "../pictures/pictureSlice";
import { setScreen } from "../appLayout/layoutSlice";
import CreateTruck from "./CreateTruck";
import axios from 'axios'
import Button from "../../ui/Button";
import BarcodeScanner from "../../components/BarcodeScanner";
import TruckFooter from "../../ui/TruckFooter";
import qrlogo from '../../assets/QrCode.png'
import { verifyOrder, getTrucks } from "../../utils/apiFunctions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";




// const url = 'http://localhost:8080/api'



function TruckSelection() {
  const [createTruck, setCreateTruck] = useState(false)
  const [error, setError] = useState('')
  const [imgSrc, setImgSrc] = useState(null)
  const [result, setResult] = useState('')
  const [videoRef, setVideoRef] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [footer, setFooter] = useState(true)
  const [scanQR, setScanQR] = useState(false)
  const generatedTruck = useSelector((state) => state.truck.generatedTruck)
  const scannedQRCode = useSelector((state) => state.picture.scannedQRCode)
  const orgCode = useSelector((state) => state.user.orgCode)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const trucks = useSelector((state) => state.truck.truckIDs)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    let array = [];
    setIsLoading(true);
    dispatch(setScreen('TruckSelection'))
    async function truckList() {
      try {
        setError("");
        const response = await getTrucks(orgCode)
        dispatch(setTruckIDs(response))        
      } catch (err) {
        console.log('there was an error getting truck IDs', err.message)
        setError(err)
      } finally {
        setIsLoading(false)
      }
      }

      truckList();

  }, [orgCode])


  function handleOrgSelect(e) {
      dispatch(updateOrgCode(e))
    }

   function handleTruckSelect(e) {
    dispatch(setSelectedTruck(e))
  }

  async function handleOrderSelect(e) {
    dispatch(setOrderNumber(e))
  }

  function startScan() {
    setScanQR(true)
  }

  function stopScan() {
    setScanQR(false)
  }
  
  function handleClick() {
    setCreateTruck(!createTruck)
  }

  function handleClear() {
    if (selectedTruck) {
      dispatch(setSelectedTruck(''))    
    }
  }

  async function handleNext() {
    const result = await verifyOrder(orgCode, orderNumber)
    const {order_verified} = result
    if (!order_verified) {
      toast.error(`${orderNumber} does not belong to ${orgCode}`)
    } else {
      navigate('/load')
    }  
  }


  return (
    <>
    {scanQR && (
      <div className="grid grid-rows-2 grid-cols-3">
        <div className="row-start-1 col-start-2">
          <BarcodeScanner setResult={setResult} result={result} />
        </div>
        <div className="row-start-2 col-start-2">
          <Button type='primary' onClick={stopScan}>Go Back</Button>
        </div>
      </div>
      
    )}
    {!scanQR && (
      <div id='main' className="grid grid-rows-5 grid-cols-3 ">
        <h1 id='header' className="row-start-1 col-start-2 text-center md:mb-4 self-center text-2xl border-b-2 border-stone-500">Select Truck</h1>
          <div id='options' className="grid grid-rows-4 grid-cols-1 row-start-2 col-start-2 row-span-4 justify-self-center items-center w-100 sm:w-120 gap-1 ">
            <div id='org-select' className="flex sm:w-120  justify-evenly ">
              <label htmlFor="orgCode" className="text-2xl">Organization</label>
              <select className="text-center appearance-none bg-gray-50 w-45 relative left-2" value={orgCode} onChange={e => handleOrgSelect(e.target.value)}>
                <option value=''>SELECT A PLANT</option>
                <option value="ANN">Annville</option>
                <option value="VIS">Visalia</option>
                <option value="JAC">Jackson</option>
                <option value="MTY">Monterrey</option>
                <option value="STJ">St. Joseph</option>
                <option value="RAI">Rainsville</option>
                <option value="EVA">Evansville</option>
              </select>
            </div>
            <div id='order-num' className="row-start-2 flex justify-evenly sm:w-120 sm:m-1">
              <label className="text-2xl">Order Number</label>
              <input type='text' className="bg-gray-50 w-45 md:mr-1 text-center" value={orderNumber} onChange={e => handleOrderSelect(e.target.value)}/>
            </div>
            <div id='scan-truck' className="row-start-3 flex justify-evenly sm:w-130">
              <label htmlFor='scan-truck' className="text-2xl">Scan Truck</label>
              <input type='text' className='bg-gray-50 w-45 relative left-12 justify-items-center placeholder:px-4 ' value={selectedTruck} placeholder='Scan or type truck id' onChange={e => handleTruckSelect(e.target.value)} onClick={handleClear}></input>
              {/* <button onClick={handleClear} className="relative left-10">{selectedTruck ? "X" : ''}</button> */}
              <button type='button' className="bg-gray-50 w-10 hover:cursor-pointer hover:shadow-2xl/30 hover:shadow-stone-900 hover:ring-2 hover:ring-gray-600 relative left-8" onClick={startScan}><img src={qrlogo}></img></button>
            </div>
            <div id='truck-id-select' className="row-start-4 flex justify-evenly sm:w-120">
              <label htmlFor='truck-id' className="text-2xl">Truck ID</label>
              <select className="text-center appearance-none bg-gray-50 w-45 relative left-6" value={selectedTruck}  onChange={e => handleTruckSelect(e.target.value)}>
                  <option value="">
                    {!selectedTruck ? 'Please select a truck ID' : selectedTruck}
                  </option>
                  {trucks.map((truck, index) => (
                    <option value={truck} key={index}>{truck}</option>
                  ))}
              </select>
            </div>
            <div className="mt-2">
            <Button type="primary" onClick={handleClick}>Click here to create a truck</Button>
            </div>
        </div >
         
      </div>    
    )}
  {
    createTruck && !scanQR &&(
      <div>
        <CreateTruck setCreateTruck={setCreateTruck}/>
      </div>
      )
    }
    {selectedTruck && orderNumber && (
      <div className="text-center flex justify-center border-2 border-black w-full">
        <p className="flex flex-row ">
          <span>Truck ID: {selectedTruck}</span>
          <span>Order#: {orderNumber}</span>
          <Button type='primary' onClick={handleNext}>Next</Button>
        </p>
      </div>
    )}  
  </>
  )
}

export default TruckSelection

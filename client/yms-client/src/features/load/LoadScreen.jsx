import Button from "../../ui/Button"
import { useSelector, useDispatch } from "react-redux"
import styles from './LoadScreen.module.css'
import { useEffect } from "react"
import axios from 'axios'
import { setCustomer } from "../order/orderSlice"
import { setTruckWeight, setTruckQty } from "../truck/truckSlice"
import { setScreen } from "../appLayout/layoutSlice"
import { useState } from "react"
// import Containers from "./Containers"
import ContainerTable from "./ContainerTable"
import { useNavigate } from "react-router-dom"
import { getCustomerName, getWeight, loadContainer } from "../../utils/apiFunctions"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Loader from "../../ui/Loader"
import toast from "react-hot-toast"
import ScanTruckBarcode from "../../components/ScanTruckBarcode"
import Camera from "../../components/Camera"
import { setScannedContainer } from "../pictures/pictureSlice"

function LoadScreen() {
  const [manualAssign, setManualAssign] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  // const [takePhoto, setTakePhoto] = useState(false)
  const scannedContainer = useSelector((state) => state.picture.scannedContainer)
  const orgCode = useSelector((state) => state.user.orgCode)
  const scannedTruck = useSelector((state) => state.picture.scannedTruck)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const customer = useSelector((state) => state.order.customer)
  const userID = useSelector((state) => state.user.userID)
  const scanBarCode = useSelector((state) => state.picture.scanBarCode)
  // const [scanQR, setScanQR] = useState(false)

  // const truckWeight = useSelector((state) => state.truck.truckWeight)
  // const truckQty = useSelector((state) => state.truck.truckQty)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const {isLoading: loadingTruck, data: truckInfo, error: truckError} = useQuery({
    queryKey: ['truckInfo', selectedTruck],
    queryFn: async () => {
      const result = await getWeight(selectedTruck)
      const {CONT_QTY, CONT_GROSS_WT} = result[0];
      const data = {CONT_QTY, CONT_GROSS_WT}
      // console.log()
      return data
    }
  })

  const {isLoading: assigning, mutate: assignContainer, isError, error: assignError} = useMutation({
  mutationFn: ({order_number, cont_name, orgCode, selectedTruck, userID}) => {
    return loadContainer(order_number, cont_name, orgCode, selectedTruck, userID);
  },
  onSuccess: () => {
    // toast.success(`${cont_name} successfully loaded onto ${selectedTruck}`)

    queryClient.invalidateQueries({
      queryKey: ['containers']
    })

    queryClient.invalidateQueries({
      queryKey: ['truckInfo']
    })

  },
  onError: (error) => toast.error( error.message)
  //"There was an error assigning truck ID! Please check all values for the manually entered container",
})


  useEffect(() => {
    setIsLoading(true)
    async function getCustomerData() {
      const result = await getCustomerName(orderNumber)
      dispatch(setCustomer(result))
      setIsLoading(false)
    }

    getCustomerData()
  }, [])

  function handleNavigate() {
    navigate('/')
  }

  function handleChange(e) {
    dispatch(setScannedContainer(e))
  }

  function handleAssign() {
    assignContainer
    // assignContainer({'2600429001', '35J', })
    // const scannedContainerRegex = /.{3}\|.{10}\|/gm
    // // console.log(scannedContainerRegex.test(scannedContainer))
    // const org_code = scannedContainer.split('|')[0]
    // const order_number = scannedContainer.split('|')[1].split('|')[0]
    // const cont_name = scannedContainer.split('|')[2]
    // console.log(order_number, org_code, cont_name)
  }

  // async function handleAssign() {
  //   const scannedContainerRegex = /.{3}\|.{10}\|/gm
  //   console.log('assign test')
  //   if (scannedContainerRegex.test(scannedContainer)) {
  //     const org_code = scannedContainer.split('|')[0]
  //     const order_number = scannedContainer.split('|')[1].split('|')[0]
  //     const cont_name = scannedContainer.split('|')[2]
  //     // console.log(order_number, cont_name, org_code, selectedTruck, userID)
  //     // const load = await loadContainer(order_number, cont_name, org_code, selectedTruck, userID)
  //     assignContainer({order_number, cont_name, org_code, selectedTruck, userID})
  //     // toast.success(`${cont_name} has been loaded onto ${selectedTruck}`)
  //   } else {
  //     if (
  //       !scannedContainerRegex.test(scannedContainer)
  //     ) {
  //       toast.error(`${scannedContainer} is NOT valid!`)
  //     } 
  //   }
  // }

  // function handleScanTruck() {
    
  //   // console.log(scanQR)
  // }

  // function handleTest() {
  //   console.log('test', scannedContainer)
  // }

   
  if (loadingTruck) return <Loader text={'load screen'}/>
  
  return (
    <>
        {scanBarCode && (
      <div className="grid grid-rows-2 grid-cols-3">
        <div className="row-start-1 col-start-2">
          <ScanTruckBarcode setResult={setResult} result={result} handleScanTruck={handleScanTruck} />
          
           <Camera setResult={setResult} result={result} />
        </div>
        <div className="row-start-2 col-start-2">
          <Button type='primary' onClick={handleScanTruck}>Go Back</Button>
        </div>
      </div>)}
    <div className={styles.load_main}>
    <div className={styles.main}>
      <div className={styles.header}>
        <div id='org' className='flex border border-slate-800 justify-between '>
          <p className={styles.title}>Organization</p>
          <p className={styles.info} >{orgCode}</p>
        </div>
        <div className='row-start-2 col-start-1 flex border border-slate-800 justify-between '>
          <p className={styles.title}>Truck ID</p>
          <p className={styles.info}>{selectedTruck}</p>
        </div>
        <div className='flex border border-slate-800 justify-between row-start-3 col-start-1'>
          <p className={styles.title}>Customer</p>
          <p className={styles.info}>{customer}</p>
        </div>
        <div className='flex border border-slate-800 justify-between row-start-4 col-start-1'>
          <p className={styles.title}>Order Number</p>
          <p className={styles.info}>{orderNumber}</p>
        </div>
        <div className='flex border border-slate-800 justify-between row-start-1 col-start-2'>
          <p className={styles.title}>Total Weight</p>
          <p className={styles.info}>{truckInfo.CONT_GROSS_WT}</p>
        </div>
        <div className='flex border border-slate-800 justify-between row-start-2 col-start-2'>
          <p className={styles.title}>Total Qty</p>
          <p className={styles.info}>{truckInfo.CONT_QTY}</p>
        </div>
        <div className='flex border border-slate-800 justify-between row-start-1 col-start-3'>
          <p className={styles.title}>Manual Entry</p>
          <input type='text' value={scannedContainer} onChange={(e) => handleChange(e.target.value)} className={styles.manual}></input>
          {/* <button className="hover:cursor-pointer" onClick={handleAssign}>Assign truck ID</button> */}
        </div>
        <div className='flex border border-slate-800 justify-between row-start-2 col-start-3'>
          <p className={styles.title}>Add Order</p>
          <p className={styles.info}></p>
        </div>
        
      </div>
      <div className={styles.table}>
        <ContainerTable />
      </div>
    </div>
    </div>
    </>
  )
}

export default LoadScreen

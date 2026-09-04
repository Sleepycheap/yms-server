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
import LoadTable from "./LoadTable"
import { useNavigate } from "react-router-dom"
import { getCustomerName, getWeight } from "../../utils/apiFunctions"
import { useQuery } from "@tanstack/react-query"
import Loader from "../../ui/Loader"

function LoadScreen() {
  // const [containers, setContainers] = useState([])
  const orgCode = useSelector((state) => state.user.orgCode)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const customer = useSelector((state) => state.order.customer)
  const truckWeight = useSelector((state) => state.truck.truckWeight)
  const truckQty = useSelector((state) => state.truck.truckQty)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const {isLoading, data, error} = useQuery({
    queryKey: ['loadData', {orgCode, selectedTruck, orderNumber}],
    queryFn: async () => {
      const data = await getWeight(orgCode, selectedTruck)
      const {p_truck_weight, p_truck_quantity} = data;
      dispatch(setTruckWeight(p_truck_weight));
      dispatch(setTruckQty(p_truck_quantity))
      const customerData = await getCustomerName(orderNumber)
      dispatch(setCustomer(customerData))
    }
  })

  // const {isLoading: gettingCustomer, data: customerData, error: customerError} = useQuery({
  //   queryKey: ['customer', orderNumber],
  //   queryFn: async () => 
  // })


  // useEffect(() => {
  //   dispatch(setScreen('LoadScreen'))
  //   async function getCustomer() {
  //     // const result = await axios.get(`http://localhost:8080/api/customer/${orderNumber}`)
  //     const result =  await getCustomerName(orderNumber)
  //     dispatch(setCustomer(result))

  //   }
    
  //   getCustomer()
  // }, [])

  // useEffect(() => {
  //   async function getTruckData() {
  //     const result = await getWeight(orgCode, selectedTruck)
  //     const {p_truck_weight, p_truck_quantity} = result
  //     dispatch(setTruckQty(p_truck_quantity))
  //     dispatch(setTruckWeight(p_truck_weight))
  //   }

  //   getTruckData()
  // }, [])

  function handleNavigate() {
    navigate('/')
  }
   
  if (isLoading) return <Loader text={'load screen'}/>

  return (
    <div className={styles.load_main}>
    <div className={styles.buttons}>
      <button className="bg-amber-400">Filter options</button>
      <button>Take Picture</button>
      <p>Load Screen</p>
      <button>Truck</button>
      <button onClick={handleNavigate}>Close</button>
      </div>
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
          <p className={styles.info}>{truckWeight}</p>
        </div>
        <div className='flex border border-slate-800 justify-between row-start-2 col-start-2'>
          <p className={styles.title}>Total Qty</p>
          <p className={styles.info}>{truckQty}</p>
        </div>
        <div className='flex border border-slate-800 justify-between row-start-1 col-start-3'>
          <p className={styles.title}>Scan</p>
          <p className={styles.info}></p>
        </div>
        
      </div>
      <div className={styles.table}>
        <LoadTable />
      </div>
    </div>
    </div>
  )
}

export default LoadScreen

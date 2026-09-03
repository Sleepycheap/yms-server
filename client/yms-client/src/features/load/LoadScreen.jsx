import Button from "../../ui/Button"
import { useSelector, useDispatch } from "react-redux"
import styles from './LoadScreen.module.css'
import { useEffect } from "react"
import axios from 'axios'
import { setCustomer } from "../order/orderSlice"
import { setScreen } from "../appLayout/layoutSlice"
import { useState } from "react"
import Containers from "./Containers"
import { useNavigate } from "react-router-dom"

function LoadScreen() {
  // const [containers, setContainers] = useState([])
  const orgCode = useSelector((state) => state.user.orgCode)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const customer = useSelector((state) => state.order.customer)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(setScreen('LoadScreen'))
    async function getCustomer() {
      const result = await axios.get(`http://localhost:8080/api/customer/${orderNumber}`)
      dispatch(setCustomer(result.data))
    }
    
    getCustomer()
  }, [])

  function handleNavigate() {
    navigate('/')
  }
  
  console.log('customer', customer)

  return (
    <>
    <div className="flex justify-between">
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
        
      </div>
      <div className={styles.table}>
        <Containers />
      </div>
    </div>
    </>
  )
}

export default LoadScreen

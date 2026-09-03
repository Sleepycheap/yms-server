import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setContainers } from './loadSlice'
import axios from 'axios'
import styles from './Containers.module.css'
import Loader from '../../ui/Loader'
import { useCallback } from 'react'

function Containers() {
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(true)
  const containers = useSelector((state) => state.load.containers)
  const orderNumber = useSelector((state) => state.order.orderNumber)

  const dispatch = useDispatch();

  useEffect(() => {
    if (isMounted) {
      setIsMounted(true)
      async function getContainers() {
        setIsLoading(true);
        const del = await axios.post(`http://localhost:8080/propagate/containers`, {order_number: orderNumber})
        // const response = await axios.get(`http://localhost:8080/api/containers/${orderNumber}`);
        const {data} = del;
        
        console.log('data', data)
        dispatch(setContainers(data))
        setIsLoading(false)
        
        setIsMounted(false)   
      }
      
      getContainers()
    }
  }, [])

  
  
  console.log('containers', containers)
  

  return (
    <div className={styles.main}>
    <div className={styles.table}>
    {isLoading && <Loader text={`load for ${orderNumber}`}/>}
    {!isLoading && 
      <table >
      <thead >
        <tr>
          <th>Order #</th>
          <th>Container</th>
          <th>Description</th>
          <th>Gross Qty</th>
          <th>Gross Wgt</th>
          <th>Shipping Ins</th>
          <th>Truck ID</th>
          <th>Unload</th>
        </tr>
      </thead>
      <tbody className={styles.containers}>
        {containers.map((container, index) => (
          <tr>
            <td>{container.order_number}</td>
            <td>{container.cont_name}</td>
            <td>{container.item_description}</td>
            <td>{container.cont_qty}</td>
            <td>{container.cont_gross_wt}</td>
            <td></td>
            <td>{container.direct_truck}</td>
            <td></td>
        </tr>
        ))}
      </tbody>
      
    </table>
    }
    </div>
    </div>
  )
}

export default Containers

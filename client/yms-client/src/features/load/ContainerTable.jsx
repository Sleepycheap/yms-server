import { useMutation, useQuery } from '@tanstack/react-query'
import { getContainers, getScacCodes } from '../../utils/apiFunctions'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../ui/Loader'
import styled from 'styled-components'
import ContainerRow from './ContainerRow'
import styles from './ContainerTable.module.css'
import TableOptions from '../../components/TableOptions'
import { useSearchParams } from 'react-router-dom'
// import Spinner from '../../components/Spinner'



function LoadTable() { 
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const [searchParams] = useSearchParams()
  
  const {isLoading, data: containers, error: containerError} = useQuery({
    queryKey: ['containers', orderNumber],
    queryFn: async () => {
      const data = await getContainers(orderNumber)
      return data
    }
  })

  
  if (isLoading) return <Loader text={'containers'} />

  const filterValue = searchParams.get('filter') || 'picked';
  
  let filteredContainers;
  if (filterValue === 'loaded') filteredContainers = containers.filter((container) => container.direct_truck !== null )
  if (filterValue === 'picked') filteredContainers = containers.filter((container) => container.direct_truck === null && container.cont_name !== null )
  if (filterValue === 'unpicked') filteredContainers = containers.filter((container) => container.cont_name === null )

  return (
    <>
    <TableOptions containers={containers}/>
    <div className={styles.main}>
    <table role='table'>
    <thead role='row'>
      <tr>
      <th>Order Number</th>
      <th>Container</th>
      <th>Description</th>
      <th>Quantity</th>
      <th>Weight</th>
      <th>Shipping Ins</th>
      <th>Truck ID</th>
      <th>Unload</th>
      </tr>
      </thead>
      <tbody>
      {filteredContainers.map((container, index) => (
        <ContainerRow container={container} key={index} />
      ))}
      </tbody>
  </table>
      </div>
      </>
        ) 
}

export default LoadTable

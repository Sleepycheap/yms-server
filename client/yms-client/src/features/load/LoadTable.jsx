import { useQuery } from '@tanstack/react-query'
import { getContainers, getScacCodes } from '../../utils/apiFunctions'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../ui/Loader'
import styled from 'styled-components'
import ContainerRow from './ContainerRow'
import styles from './LoadTable.module.css'
// import Spinner from '../../components/Spinner'

// const Table = styled.div`
//   border: 2px solid oklch(55.1% 0.027 264.364);
//   font-size: 1.4rem;
//   background-color: oklch(96.7% 0.003 264.542);
//   border-radius: 7px;
//   overflow: hidden;
// `

// const TableHeader = styled.header`
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   background-color: oklch(98.5% 0.002 247.839);
//   border-bottom: 1px solid oklch(87.2% 0.01 258.338)
//   text-transform: uppeercase;
//   letter-spacing: 0.4px;
//   font-weight: 600;
//   color: oklch(44.6% 0.03 256.802)
//   padding: 1.6rem 2.4re,;
// `


function LoadTable() { 
  const orderNumber = useSelector((state) => state.order.orderNumber)


  // rder_number, cont_name, orgCode, direct_truck, user_id



  
  const {isLoading, data: containers, error} = useQuery({
    queryKey: ['containers', orderNumber],
    queryFn: async () => {
      const data = await getContainers(orderNumber)
      return data
    }
  })

  if (isLoading) return <Loader text={'containers'} />

  return (
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
      {containers.map((container, index) => (
        <ContainerRow container={container} key={index} />
      ))}
      </tbody>
  </table>
      </div>
        ) 
}

export default LoadTable

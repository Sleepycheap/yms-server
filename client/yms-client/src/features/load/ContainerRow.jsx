import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ContainerRow.module.css'
import { useSelector } from 'react-redux';
import { unloadContainer, loadContainer, getWeight } from '../../utils/apiFunctions';
import { useState } from 'react';
import Button from '../../ui/Button';
import toast from 'react-hot-toast';





function ContainerRow({container}) {
  const orgCode = useSelector((state) => state.user.orgCode)
  const [isLoaded, setIsLoaded] = useState(false)
  const {cont_name, item_description, cont_qty, cont_gross_wt, direct_truck, order_number, shipping_instructions} = container;
  const userID = useSelector((state) => state.user.userID)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)

  const queryClient = useQueryClient()

  // const user_id = 122452;

  const {isLoading: assigning, mutate: assignContainer, status, } = useMutation({
    mutationFn: ({order_number, cont_name, orgCode, selectedTruck, userID}) => {
      return loadContainer(order_number, cont_name, orgCode, selectedTruck, userID);
    },
    onSuccess: ()  => {
      toast.success(`${cont_name} successfully loaded onto ${selectedTruck}`)

        
        queryClient.invalidateQueries({
          queryKey: ['containers']
        }),
        
        queryClient.invalidateQueries({
          queryKey: ['truckInfo']
        })
  
        
    },
    onError: (err) => toast.error(err.message) 
  })

  const {isLoading: removing, mutate: unassignContainer} = useMutation({
    mutationFn: ({order_number, cont_name, orgCode, direct_truck, userID}) => {
      return unloadContainer(order_number, cont_name, orgCode, direct_truck, userID);
    },
    onSuccess:  () => {
      toast.success(`${cont_name} successfully unloaded from ${direct_truck}`)
  
        queryClient.invalidateQueries({
          queryKey: ['containers']
        }),
        queryClient.invalidateQueries({
          queryKey: ['truckInfo']
        })
    

    },
    onError: (err) => toast.error(err.message) 
  })

  // const {isLoading: loadingTruck, mutate: checkWeight} = useMutation({
  //   mutationFn: (selectedTruck) => {
  //     return getWeight(selectedTruck)
  //   },
  //   onSuccess: () => 
  // })
  

  return (
    
    <tr>
      <td>{order_number}</td>
      <td>{cont_name}</td>
      <td>{item_description}</td>
      <td>{cont_qty}</td>
      <td>{cont_gross_wt}</td>
      <td>{shipping_instructions}</td>
      <td><button className='hover:cursor-pointer'  onClick={() => assignContainer({order_number, cont_name, orgCode, selectedTruck, userID})} disabled={assigning}>{direct_truck ? direct_truck : 'click'}</button></td>
      <td><button className='hover:cursor-pointer' onClick={() => unassignContainer({order_number, cont_name, orgCode, direct_truck, userID})} disabled={removing}>{direct_truck ? 'unload' : ''}</button></td>

    </tr>
  )
}

export default ContainerRow

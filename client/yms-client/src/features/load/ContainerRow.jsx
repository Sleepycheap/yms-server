import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ContainerRow.module.css'
import { useSelector } from 'react-redux';
import { unloadContainer, loadContainer } from '../../utils/apiFunctions';
import { useState } from 'react';
import Button from '../../ui/Button';
import toast from 'react-hot-toast';




function ContainerRow({container}) {
  const orgCode = useSelector((state) => state.user.orgCode)
  const [isLoaded, setIsLoaded] = useState(false)
  const {cont_name, item_description, cont_qty, cont_gross_wt, direct_truck, order_number, shipping_instructions} = container;

  const selectedTruck = useSelector((state) => state.truck.selectedTruck)

  const queryClient = useQueryClient()

  const user_id = 122452;

  const {isLoading: assigning, mutate: assignContainer} = useMutation({
    mutationFn: ({order_number, cont_name, orgCode, selectedTruck, user_id}) => {
      return loadContainer(order_number, cont_name, orgCode, selectedTruck, user_id);
    },
    onSuccess: () => {
      toast.success(`${cont_name} successfully loaded onto ${selectedTruck}`)

      queryClient.invalidateQueries({
        queryKey: ['containers']
      })
    },
    onError: (err) => toast.error(err.message) 
  })

  const {isLoading: removing, mutate: unassignContainer} = useMutation({
    mutationFn: ({order_number, cont_name, orgCode, direct_truck, user_id}) => {
      return unloadContainer(order_number, cont_name, orgCode, direct_truck, user_id);
    },
    onSuccess: () => {
      toast.success(`${cont_name} successfully unloaded from ${direct_truck}`)

      queryClient.invalidateQueries({
        queryKey: ['containers']
      })
    },
    onError: (err) => toast.error(err.message) 
  })
  

  return (
    
    <tr>
      <td>{order_number}</td>
      <td>{cont_name}</td>
      <td>{item_description}</td>
      <td>{cont_qty}</td>
      <td>{cont_gross_wt}</td>
      <td>{shipping_instructions}</td>
      <td><button className='hover:cursor-pointer'  onClick={() => assignContainer({order_number, cont_name, orgCode, selectedTruck, user_id})} disabled={assigning}>{direct_truck ? direct_truck : 'click'}</button></td>
      <td><button className='hover:cursor-pointer' onClick={() => unassignContainer({order_number, cont_name, orgCode, direct_truck, user_id})} disabled={removing}>unload</button></td>

    </tr>
  )
}

export default ContainerRow

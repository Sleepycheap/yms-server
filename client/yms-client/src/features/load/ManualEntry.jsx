/*
Send container name from LoadScreen into ManualEntry input component. container name will then be used inside ManualEntry component to get query and updated after load is sent
*/

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSelector, useDispatch } from "react-redux"
import { getContainers, loadContainer } from "../../utils/apiFunctions"
import toast from "react-hot-toast"
import styles from './ManualEntry.module.css'
import { setScannedContainer } from "../pictures/pictureSlice"


function ManualEntry() {
  const orderNumber = useSelector((state) => state.order.orderNumber)
  const orgCode = useSelector((state) => state.user.orgCode)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const userID = useSelector((state) => state.user.userID)
  const scannedContainer = useSelector((state) => state.picture.scannedContainer)

  const queryClient = useQueryClient()

  const contName = scannedContainer.split('|')[2]

  const {isLoading, data:containers, error} = useQuery({
    queryKey: ['containers', orderNumber],
    queryFn: async () => {
      const data = await getContainers(orderNumber)
      return data
    }
  })

  const {isLoading: isSubmitting, mutate: assignContainer, error:submitError} = useMutation({
    mutationFn: ({order_number, cont_name, orgCode, selectedTruck, userID}) => {
      return loadContainer(order_number, cont_name, orgCode, selectedTruck, userID)
    },
    onSuccess: () => {
      toast.success(`${cont_name} successfully loaded onto ${selectedTruck}`)

      queryClient.invalidateQueries({
        queryKey: ['containers']
      })

      queryClient.invalidateQueries({
        queryKey: ['truckInfo']
      })

    },
    onError: (err) => toast.error(err.message)
  })

  let filteredContainer
  if (containers) {
    filteredContainer = containers.filter((container) => container.cont_name !== null )
  }


  const {delivery_detail_id, cont_name, cont_qty, cont_gross_wt, item_description, order_number, shipping_instructions} = filteredContainer;

  // const truckBarCodeRegEx = /^[A-Z]{3}[|][0-9]{10,}[|][a-zA-Z0-9]/gm

  
  function handleManualAssign() {
    assignContainer({order_number, cont_name, orgCode, selectedTruck, userID})
  }
  
  return (
    <>
    <button className={styles.title_button} onClick={handleManualAssign} disabled={isSubmitting}>Manual Entry</button>
    </>
  )
}

export default ManualEntry

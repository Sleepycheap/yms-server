import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import styles from './Submit.module.css'
import { loadContainer } from "../../utils/apiFunctions";
import { createPortal } from "react-dom";
import e from "cors";

function Submit({container}) {
  const orgCode = useSelector((state) => state.user.orgCode)
  const userID = useSelector((state) => state.user.userID)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const queryClient = useQueryClient()
  
  let cont_name;
  let order_number;
  

  if (container) {
    cont_name = container.cont_name;
    order_number = container.order_number
  }



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

  function handleClick(e) {
    e.preventDefault();
    console.log('loading..')
    // console.log(order_number)
    assignContainer({order_number, cont_name, orgCode, selectedTruck, userID})
  }

  return (
    <>
      <button type='submit' form='scan-submit' className="border-2 border-black hover:cursor-pointer" onClick={handleClick}>Scan Submit</button>
    </>
  )
}

export default Submit

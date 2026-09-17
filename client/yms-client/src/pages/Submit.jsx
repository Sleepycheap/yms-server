import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { loadContainer } from "../utils/apiFunctions";

function Submit({container, setSubmit}) {
  const orgCode = useSelector((state) => state.user.orgCode)
  const {cont_name, item_description, cont_qty, cont_gross_wt, direct_truck, order_number, shipping_instructions} = container;
  const userID = useSelector((state) => state.user.userID)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)

  const queryClient = useQueryClient()


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

  function handleClick() {
    setSubmit(false)
  }

  return (
    <div>
      {/* <p>{container.order_number}</p>
      <p>{container.cont_name}</p>
      <p>{container.cont_qty}</p>
      <p>{container.cont_gross_wt}</p> */}
      <button onClick={() => assignContainer({order_number, cont_name, orgCode, selectedTruck, userID})}>Submit</button>
      <button onClick={handleClick}>Go Back</button>
    </div>
  )
}

export default Submit

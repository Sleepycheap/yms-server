import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
// import { getLoadedContainers } from "../utils/apiFunctions";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { getContainerName, getScacCodes, loadContainer } from "../utils/apiFunctions";
import ScanTruckBarcode from "./ScanTruckBarcode";
import { setScanBarCode, setScannedObject } from "../features/pictures/pictureSlice";
import { useNavigate } from "react-router-dom";
import { getContainerDesc } from "../utils/apiFunctions";
import Submit from "../pages/Submit";

function TableOptions({containers}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const userID = useSelector((state) => state.user.userID)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck) 
  const orgCode = useSelector((state) => state.user.orgCode)
  const [submit, setSubmit] = useState(false)
  // const [containerName, setContainerName] = useState('')
  const [scanBarcode, setScanBarcode] = useState(false)
  const dispatch = useDispatch()
  const scannedContainer = useSelector((state) => state.picture.scannedContainer)
  const scannedObject = useSelector((state) => state.picture.scannedObject)
  
  // const container = containers[0]
  // const {item_description, cont_qty, cont_gross_wt, direct_truck, order_number, shipping_instructions} = container;
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // const cont_name = '1BT'


  const containerName = scannedObject.cont_name;

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
  
 const filter = containers.filter((container) => container.cont_name === containerName)
    const filteredContainer = filter[0]


  function handleSelect(value) {
    searchParams.set("filter", value)
    setSearchParams(searchParams)
  }

  function handleScan() {
    navigate('/scanner')
  }

  // async function handleSubmit() {
  //   if (!scannedContainer) {
  //     return 'no scanned container'
  //   }
  //   const org_code = scannedContainer.split('|')[0]
  //   const order_number = scannedContainer.split('|')[1].split('|')[0]
  //   const container_name = scannedContainer.split('|')[2]
  //   console.log(container_name)
  //   for (let i = 0; i < containers.length; i++) {

  //   }
  // }

  // async function handleSubmit() {
  //   // const {item_description} = containerName[0]
  //   // console.log(item_description)
  //   const filteredContainer = containers.filter((container) => container.cont_name === containerName)
  //   const data = filteredContainer[0]
  //   console.log(data)
  //   const {cont_name, order_number} = data
  //   // console.log(cont_name)
  //   assignContainer({order_number, cont_name, orgCode, selectedTruck, userID})
  // }

  function handleSubmit() {
 
    setSubmit(true)
  }  

  return (
    <>
    {!submit && 
    <div className="border-2 border-gray-400 bg-gray-100 shadow-sm rounded-sm p-[0.4rem] flex gap-[0.4rem]">
      <select value={searchParams} onChange={e => handleSelect(e.target.value)}>
      <option value=''>Filter Containers</option>
      <option value='loaded'>Loaded</option>
      <option value='picked'>picked</option>
      <option value='unpicked'>unpicked</option>
      </select>
      <span className="w-10"></span>
      <button className="hover:cursor-pointer border border-stone-600 px-1 hover:shadow-xl/30 hover:shadow-stone-700" onClick={handleScan}>Scan barcode</button>
      <span className="w-10"></span>
      <button className="hover:cursor-pointer border border-stone-600 px-1 hover:shadow-xl/30 hover:shadow-stone-700" onClick={handleSubmit}>Submit</button>
      <span className="w-10"></span>
      
      </div>
    }
    {submit && <Submit container={filteredContainer} setSubmit={setSubmit} />}
    </>
  )
}

export default TableOptions

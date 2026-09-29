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
import Modal from "../ui/Modal";
import ScannerInterface from "../pages/ScannerInterface";
import cameraIcon from '../assets/camera_icon.png'
import TruckPhotos from "../features/truck/TruckPhotos";

function TableOptions({containers}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [takePictures, setTakePictures] = useState(false)
  const userID = useSelector((state) => state.user.userID)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck) 
  const orgCode = useSelector((state) => state.user.orgCode)
  const [submit, setSubmit] = useState(false)
  const [scanBarcode, setScanBarcode] = useState(false)
  const dispatch = useDispatch()
  const scannedContainer = useSelector((state) => state.picture.scannedContainer)
  const scannedObject = useSelector((state) => state.picture.scannedObject)
  
  const navigate = useNavigate()
  const queryClient = useQueryClient()



  const containerName = scannedObject?.cont_name;

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

  function handleCamera() {
    setTakePictures(true)
  }  

  // console.log(containers)

  return (
    <>
    {isModalOpen && <Modal onClose={() => setIsModalOpen((false))}><ScannerInterface containers={containers} onCloseModal={() => setIsModalOpen(false)} /> </Modal>}
    {takePictures && <Modal onClose={() => setTakePictures((false))}><TruckPhotos onCloseModal={() => setTakePictures(false)} /> </Modal>}
    {!submit && 
    <div className="border-2 border-gray-400 bg-gray-100 shadow-sm rounded-sm p-[0.4rem] flex gap-[0.4rem]">
      <select value={searchParams} onChange={e => handleSelect(e.target.value)}>
      <option value=''>Filter Containers</option>
      <option value='loaded'>Loaded</option>
      <option value='picked'>picked</option>
      <option value='unpicked'>unpicked</option>
      </select>
      <span className="w-10"></span>
      <button className="hover:cursor-pointer px-1 hover:shadow-xl/30 hover:shadow-stone-700" onClick={() => setIsModalOpen(true)}>Scan barcode</button>
      <span className="w-10"></span>
      <button className="hover:cursor-pointer  px-1 hover:shadow-xl/30 hover:shadow-stone-700" onClick={handleCamera}><img src={cameraIcon} className="h-10 " /></button>
      <span className="w-10"></span>
    </div>
    }

    </>
  )
}

export default TableOptions

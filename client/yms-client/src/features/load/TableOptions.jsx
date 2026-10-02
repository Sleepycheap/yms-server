import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
// import { getLoadedContainers } from "../utils/apiFunctions";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {loadContainer } from "../../utils/apiFunctions";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import ScannerInterface from "./ScannerInterface";
import cameraIcon from '../../assets/camera_icon.png'
import TruckPhotos from "../truck/TruckPhotos";
import { setScannedContainer } from "../pictures/pictureSlice";
import Submit from "./Submit";

function TableOptions({containers}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitManual, setSubmitManual] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [takePictures, setTakePictures] = useState(false)
  const [manualName, setManualName] = useState('')
  const [manualOrder, setManualOrder] = useState('')
  const [submittedContainer, setSubmittedContainer] = useState('')
  const selectedTruck = useSelector((state) => state.truck.selectedTruck) 
  const [submit, setSubmit] = useState(false)
  const scannedObject = useSelector((state) => state.picture.scannedObject)
  const scannedContainer = useSelector((state) => state.picture.scannedContainer)
  const userID = useSelector((state) => state.user.userID)
  const orgCode = useSelector((state) => state.user.orgCode)
  
  const dispatch = useDispatch()
  
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
  
  function handleEntry(e) {
    let contName;
    dispatch(setScannedContainer(e))
    const truckBarCodeRegEx = /^[A-Z]{3}[|][0-9]{10,}[|][a-zA-Z0-9]/gm
    if (truckBarCodeRegEx.test(e)) {
      contName = e.split('|')[2]
      const manualFilter = containers.filter((container) => container.cont_name === contName)
      console.log(manualFilter[0])
      setSubmittedContainer(manualFilter[0])
    }   
  }

  function submitContainer() {
    console.log(manualName, manualOrder)
    assignContainer({manualOrder, manualName, orgCode, selectedTruck, userID})
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
      <form id='scan-submit'>
      <label className="self-center">Manual Entry</label>
      <input type='text' value={scannedContainer} autoFocus className="text-size-6/[calc(2 / 1.5)] bg-stone-400 w-50% text-stone-950" onChange={(e) => handleEntry(e.target.value)}></input>
      <Submit container={submittedContainer}/>
      </form>
    </div>
    }

    </>
  )
}

export default TableOptions

import Button from "../../ui/Button"
import axios from 'axios'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setTrailerNumber, setGeneratedTruck, setSelectedTruck } from "./truckSlice"

const url = 'http://localhost:8080/api'

function CreateTruck({setCreateTruck}) {
  const [scacCodes, setScacCodes] = useState([])
  const [selectedScac, setSelectedScac] = useState('')
  const [error, setError] = useState(false)
  const [errorText, setErrorText] = useState()
  const generatedTruck = useSelector((state) => state.truck.generatedTruck)
  const trailerNumber = useSelector((state) => state.truck.trailerNumber)
  const date = useSelector((state) => state.user.date)
  const dispatch = useDispatch()

  useEffect(() => {
    async function getScacCodes() {
      try {
        const response = await axios.get(`${url}/scaccodes`);
        const {data} = response;
        console.log('data', data)
        setScacCodes(data)
      } catch (err) {
        console.log('scac error', err.message)
      }
    }
    
    getScacCodes()
  }, [])

  useEffect(() => {

  })

  function handleScacSelect(e) {
    setSelectedScac(e)
  }

  function handleTruckInput(e) {
    if (e.length > 8) {
      setError(true)
      setErrorText('Entry cannot exceed 8 characters')
      return
    } 
    if (e.length < 8 && error) {
      setError(false)
    }
    dispatch(setTrailerNumber(e))
  }

  function handleCreateTruck() {
    let dateString = ''
    if (!date.startsWith('0')) {
      dateString = `0${date}`
    } else {
      dateString = date
    } 
    const string = `${selectedScac}${trailerNumber} ${dateString}`
    dispatch(setGeneratedTruck((string)))
    dispatch(setSelectedTruck((string)))
    setCreateTruck(false)
  }

  function handleDeleteTruck() {
    dispatch(setGeneratedTruck(''))
    dispatch(setSelectedTruck(''))
    setSelectedScac('')
    dispatch(setTrailerNumber(''))
  }

  return (
    <div id='ct-main' className="grid grid-rows-5 grid-cols-3 sm:m-5">
      <h1 id='ct-header' className="row-start-1 col-start-2 text-center text-2xl self-center border-b-2 border-stone-500 md:mb-4">Create Truck {generatedTruck}</h1>
      <div id='ct-options' className="grid grid-rows-3 grid-cols-1 col-start-2 row-start-2 row-span-3 justify-self-center items-center  w-100 sm:w-120 h-35 sm:h-full">
        <div id='ct-scac-select' className="flex sm:w-120 justify-evenly">
          <label htmlFor='scac-code' className="text-2xl">SCAC Code</label>
          <select className="text-center appearance-none bg-gray-50 w-45 relative left-2" value={selectedScac} onChange={e => handleScacSelect(e.target.value)}
            >
              <option value=''>
                Please select a ScacCode
              </option>
              {scacCodes.map((code, index) => (
                <option value={code} key={index}>{code}</option>
              ))}
            </select> 
        </div>
        <div id='ct-tn' className="row-start-2 flex justify-evenly sm:w-120">
          <label className="text-2xl">Trailer Number</label>
          <input type='text' className="bg-gray-50 relative right-1" value={trailerNumber} onChange={e => handleTruckInput(e.target.value)}/>
          {error && <p className="">{errorText}</p>}
        </div>
        <div id='ct-date' className="row-start-3 flex justify-evenly sm:w-120">
          <label htmlFor='date' className="text-2xl">Date</label>
          <label type='date' className="w-45 relative left-8 bg-gray-300 text-stone-900 text-center align-center">{date}</label>
        </div>
      </div>
        <div className="flex row-start-5 col-start-2 justify-evenly relative md:top-2 bottom-1 md:bottom-0">
          <span className="relative right-20 md:right-0">
            <Button type='primary' onClick={handleCreateTruck}>Create Truck</Button>
          </span>
          <span className="relative left-10 md:left-0">
            <Button type='primary' onClick={handleDeleteTruck}>Delete Truck</Button>
          </span>
        </div>
    </div>

  )
}

export default CreateTruck

import Loader from "../ui/Loader"
import { useState, useEffect } from "react"
import axios from "axios"
import { addTruckID } from "../features/truck/truckSlice"

function CreateTruckID() {
  const [scacCodes, setScacCodes] = useState([])
  useEffect(() => {
    async function getScac() {
      const response = await axios.get('http://localhost:8080/api/scaccodes')
      const {data} = response;
      setScacCodes(data)
    }

    getScac()
  }, [])

  return (
    <div>
      <h1>Create Truck</h1>
      <form>
        <label for='scac-code'>Scac code</label>
        <select>
          <option value=''>Select</option>
          {scacCodes.map((code, index) => (
            <option value={code} key={index}>{code}</option>
          ))}
        </select>
        <label for='trailer-number'>Trailer Number</label>
        <input value='trailer-number'></input>
      </form>
    </div>
  )
}

export default CreateTruckID


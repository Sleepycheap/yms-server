// import { getPosition } from "../utils/getPosition"
// import { determineClosestPlant } from "../utils/geoLocation"
import { useEffect, useState} from "react"
import axios from "axios"

// import { insideCircle, distanceTo, toLatLon, getLongitude } from "geolocation-utils";


function Tests() {
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

export default Tests

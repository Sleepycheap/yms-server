import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { getContext } from "@microsoft/power-apps/app";
import { setOrg } from "../features/truck/truckSlice.js";
import Loader from './Loader.jsx'
// import Trucks from "../components/Trucks.jsx";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button.jsx";
import { getPosition } from "../utils/getPosition.js";
import { determineClosestPlant } from "../utils/geoLocation.js";
import {updateName, updateOrgCode} from '../features/user/userSlice.js'
import Login from "../features/user/Login.jsx";
import Webcam from 'react-webcam'
import TakePicture from "../components/TakePicture.jsx";

function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState('')
  const [takePhoto, setTakePhoto] = useState(false)
  const username = useSelector((state) => state.user.username)
  const orgCode = useSelector((state) => state.user.orgCode)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(username === '') {
      setIsLoading(true)
      async function login() {
        const positionObj = await getPosition();
        const center = {
          lon: positionObj.coords.longitude,
          lat: positionObj.coords.latitude
        };  
        const code = await determineClosestPlant(center)
        dispatch(updateOrgCode(code))
        
        const ctx = await getContext();
        
        const {userPrincipalName} = ctx.user;
        
        const name = userPrincipalName.split('@')[0].split('.').join(' ')
        
        dispatch(updateName(name))


        setIsLoading(false)
      }
      
      login()
    }


  }, [username])
  
  
  function handleSelect(e) {
    dispatch(updateOrgCode(e))
  }

  function handleClick() {
    navigate('/tests')
  }


  return (
  <div>
    {isLoading && (
      <Loader />
    )}
    {!isLoading && (
    <div className="justify-center flex flex-col text-center h-182 ">
      <h1 className="text-2xl capitalize ">Hello {username}</h1>
      <p>It looks like you are logging in from {orgCode}, if this is not correct please choose org below</p>
      <select className="text-center appearance-none bg-gray-50 w-50 relative left-165" value='' onChange={e => handleSelect(e.target.value)}>
        <option value=''>SELECT A PLANT</option>
        <option value="ANN">Annville</option>
        <option value="VIS">Visalia</option>
        <option value="JAC">Jackson</option>
        <option value="MTY">Monterrey</option>
        <option value="STJ">St. Joseph</option>
        <option value="RAI">Rainsville</option>
        <option value="EVA">Evansville</option>
      </select>
    
       

    <div>

      <Button type='primary' onClick={handleClick}>If org is correct, click here</Button>
    </div>
    </div>


    )}
  </div>

  )
}



export default Home


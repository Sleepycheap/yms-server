import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { getContext } from "@microsoft/power-apps/app";
import { setOrg } from "../features/truck/truckSlice.js";
import Loader from './Loader.jsx'
import TruckSelection from "../features/truck/TruckSelection.jsx";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button.jsx";
import { getPosition } from "../utils/getPosition.js";
import { determineClosestPlant } from "../utils/geoLocation.js";
import {updateName, updateOrgCode, setDate, setUserID} from '../features/user/userSlice.js'
import Login from "../features/user/Login.jsx";
import Webcam from 'react-webcam'
import TakePicture from "../components/Camera.jsx";
import CreateTruck from "../features/truck/CreateTruck.jsx";
import { getUserID } from "../utils/apiFunctions.js";

function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState('')
  const [takePhoto, setTakePhoto] = useState(false)
  const [createTruck, setCreateTruck] = useState(false);
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

        const ID = await getUserID(userPrincipalName)

        dispatch(setUserID(ID))
        
        const name = userPrincipalName.split('@')[0].split('.').join(' ')

        dispatch(updateName(name))

        const now = new Date()
        const day = now.getDate()
        const month = now.getMonth() + 1

        dispatch(setDate(`${month}-${day}`))

        setIsLoading(false)
      }
      
      login()
    }


  }, [username])
  
  
  
  function handleSelect(e) {
    dispatch(updateOrgCode(e))
  }

  function handleClick() {
    setCreateTruck(true)
  }


  return (
    <div className="md:m-10">
      <Button to='tests'>Click me</Button>
    {isLoading && (
      <Loader />
    )}
    {!isLoading && (
      <>
      <TruckSelection />
      </>
    )}
    </div>
  )

  
}



export default Home


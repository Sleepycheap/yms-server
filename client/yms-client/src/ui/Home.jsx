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
import {updateName, updateOrgCode} from '../features/user/userSlice.js'
import Login from "../features/user/Login.jsx";
import Webcam from 'react-webcam'
import TakePicture from "../components/TakePicture.jsx";
import CreateTruck from "../features/truck/CreateTruck.jsx";

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
    setCreateTruck(true)
  }


  return (
    <div className=" my-5 ">
    {isLoading && (
      <Loader />
    )}
    {!isLoading && (
      <>
      <TruckSelection />
      {/* <Button type="primary" onClick={handleClick}>Click here to create a truck</Button> */}
      </>
    )}
    {/* {
      createTruck && (
        <CreateTruck />
      )
    } */}
    </div>
  )

  
}



export default Home


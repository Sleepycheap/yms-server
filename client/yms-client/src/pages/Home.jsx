import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getContext } from "@microsoft/power-apps/app";
import Loader from '../components/Loader.jsx'
import TruckSelection from "../features/truck/TruckSelection.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getPosition } from "../utils/getPosition.js";
import { determineClosestPlant } from "../utils/geoLocation.js";
import {updateName, updateOrgCode, setDate, setUserID} from '../features/user/userSlice.js'
import { getUserID } from "../utils/apiFunctions.js";
import toast from "react-hot-toast";
import Error from "../ui/Error.jsx";

function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [createTruck, setCreateTruck] = useState(false);
  const [loadError, setLoadError] = useState(false)
  const username = useSelector((state) => state.user.username)
  const orgCode = useSelector((state) => state.user.orgCode)

  const dispatch = useDispatch()

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
        if (ID.failed) {
          toast.error('Error 500: cannot access server')
          setLoadError(true)
          setIsLoading(false)
          return;
        }

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
      {/* <Button to='tests'>Click me</Button> */}
    {isLoading && (
      <Loader />
    )}
    {!isLoading && !loadError && (
      <>
      <TruckSelection />
      </>
    )}
    {!isLoading && loadError && (
      <Error />
    )}
    </div>
  )

  
}



export default Home


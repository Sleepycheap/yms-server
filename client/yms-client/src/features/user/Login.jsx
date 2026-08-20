import { useNavigation } from "react-router-dom";
import { getUserDetails } from "./userSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import Button from "../../ui/Button";

function Login() {
  // const {username, orgCode, status: distanceStatus, error} = useSelector((state) => state.user);
  const username = useSelector((state) => state.user.username)
  const orgCode = useSelector((state) => state.user.orgCode)

  // const isLoadingDistance = distanceStatus === 'Loading';
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const dispatch = useDispatch();

  useEffect(() => {
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

    const name = userPrincipalName.split('@')[0].split('.').join(' ');

    dispatch(updateName(name))
  
    login()

    }
  }, [])


  return (
    <div>
      <h1>Welcome {username}</h1>
      <p>It looks like you are logging in from {orgCode}, if this is not correct please choose org below</p>
      {/* <Button type='primary' to='/'>Back to home</Button> */}
    </div>
  )
}

export default Login

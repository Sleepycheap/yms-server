import {Link} from 'react-router-dom'
import logo from '../assets/Bluescope-logo.png'
import svgLogo from '../assets/BSL.AX.svg'
import whiteLogo from '../assets/logo_white.png'
import {getContext} from '@microsoft/power-apps/app'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import user from '../assets/react.svg'
import { updateName } from '../features/user/userSlice'
import { useDispatch } from 'react-redux'
import Username from '../features/user/Username'

function Header() {
  // const [user, setUser] = useState('')
  // const username = useSelector((state) => state.user.username);

  // const dispatch = useDispatch();

  // if (username === '') {
  //   setUser('LOGIN')
  // } else {
  //   setUser(username)
  // }
  // useEffect(() => {
  //   async function getUser() {
  //     const ctx = await getContext();
  //     const {userPrincipalName} = ctx.user;
  //     const username = userPrincipalName.split('@')[0].split('.').join(' ');
  //     dispatch(updateName(username))
  //   }

  //   getUser();
  // }, [])


  return (
    <header className="bg-blue-700 px-4 py-3 sm:px-6 uppercase flex justify-between items-center">

      <span><img src={whiteLogo} className='w-50'></img></span>
      <Link to='/' className='text-stone-100 relative right-5'>
        Yard Management System
      </Link>
      <Username />
    </header>
  )
}

export default Header

//"flex items-center justify-center border-b border-stone-200 bg-blue-700 px-4 py-3 uppercase sm:px-6 h-20"
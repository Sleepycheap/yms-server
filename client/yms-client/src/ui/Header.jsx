import {Link} from 'react-router-dom'
import logo from '../assets/Bluescope-logo.png'
import svgLogo from '../assets/BSL.AX.svg'
import whiteLogo from '../assets/logo_white.png'
import {getContext} from '@microsoft/power-apps/app'
import { useEffect, useState } from 'react'
import user from '../assets/react.svg'

function Header() {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')

  // async function context() {
  //   const ctx = await getContext();
  //   return ctx;
  // }

  useEffect(() => {
    async function contextGet() {
      const ctx = await getContext();
      setUsername(ctx.user.userPrincipalName)
      setName(ctx.user.fullName)
    }

    contextGet()
  }, [])



  return (
    <header className="bg-blue-700 px-4 py-3 h-20 sm:px-6 uppercase flex justify-between items-center">

      <span><img src={whiteLogo} className='w-50'></img></span>
      <Link to='/' className='text-amber-100 relative left-5'>
        Yard Management System
      </Link>
      <span className='text-amber-100'><p>{username}</p></span>
    </header>
  )
}

export default Header

//"flex items-center justify-center border-b border-stone-200 bg-blue-700 px-4 py-3 uppercase sm:px-6 h-20"
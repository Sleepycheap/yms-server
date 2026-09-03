import {Link} from 'react-router-dom'
import whiteLogo from '../assets/logo_white.png'
import Username from '../features/user/Username'
import { useSelector } from 'react-redux'
import { useState } from 'react'

function Header() {
  const [load, setLoad] = useState(false)
  const screen = useSelector((state) => state.layout.screen)

  // if (screen === 'LoadScreen') setLoad(true)

  return (
    <header className="bg-blue-700 px-4 py-3 sm:px-6 uppercase flex md:justify-between justify-around items-center">

      <span><img src={whiteLogo} className='md:block md:w-50 w-30'></img></span>
      <Link to='/' className='text-stone-100 relative md:right-5 text-xs md:text-base'>
        Yard Management System
      </Link>
      <Username />
    </header>
  )
}

export default Header

//"flex items-center justify-center border-b border-stone-200 bg-blue-700 px-4 py-3 uppercase sm:px-6 h-20"
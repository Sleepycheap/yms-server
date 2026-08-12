import {Link} from 'react-router-dom'
import logo from '../assets/Bluescope-logo.png'

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-blue-700 px-4 py-3 uppercase sm:px-6">
      <span><img src={logo}></img></span>
      <Link to='/' className='tracking-widest'>
        Yard Management System
      </Link>
    </header>
  )
}

export default Header
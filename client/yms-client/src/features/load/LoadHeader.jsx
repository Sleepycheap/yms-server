import Button from "../../ui/Button"
import { useNavigate } from "react-router-dom"
import Camera from "../../components/Camera"
import { useState } from "react"

function LoadHeader() {
  const [takePhoto, setTakePhoto] = useState(false)
  const navigate = useNavigate()


  function handleNavigation() {
    navigate('/')
  }

  function handlePhoto() {
    setTakePhoto(true)
  }

  return (
    <>
    {!takePhoto && 
      <div>
      <header className="bg-blue-700 px-4 py-3 sm:px-6 uppercase flex justify-between items-center">
      <Button type='small'>Filter Options</Button>
      <Button type='small' onClick={handlePhoto} >Take Pictures</Button>
      <p className='text-stone-100  text-xs md:text-base'>
      Yard Management System
      </p>
      <Button type='small'>Truck</Button>
      <Button type='small' onClick={handleNavigation} >Close</Button>
      </header>
      </div>
    }
    {takePhoto && <Camera setTakePhoto={setTakePhoto} />}
    </>
  )
}

export default LoadHeader

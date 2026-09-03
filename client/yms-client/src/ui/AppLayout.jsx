import { Outlet, useNavigation } from "react-router-dom"
import Header from './Header'
import Loader from "./Loader"
import { useSelector } from "react-redux"
import TruckFooter from "./TruckFooter"
import { useState } from "react"
import LoadHeader from "../features/load/LoadHeader"


function AppLayout() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const screen = useSelector((state) => state.layout.screen)
  const [createTruck, setCreateTruck] = useState('')
  const [footer, setFooter] = useState(true)

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] md:w-100dvw box-border text-center">
      {isLoading && <Loader />}
      
    
      {/* <Header /> */}
    

      {screen !== 'LoadScreen' && <Header />} 

      <div >
        <main >
          <Outlet />
        </main>
      </div>
    {/* {selectedTruck && footer && <TruckFooter setCreateTruck={setCreateTruck} setFooter={setFooter}/>}   */}
    </div>
  )
}

export default AppLayout




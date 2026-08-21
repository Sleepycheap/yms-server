import { Outlet, useNavigation } from "react-router-dom"
import Header from './Header'
import Loader from "./Loader"

function AppLayout() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <div className="grid h-screen grid-rows-[10%_auto_15%] w-100vw h-100vh box-border text-center">
      {isLoading && <Loader />}
      
      <Header />

      <div >
        <main >
          <Outlet />
        </main>
      </div>
      
    </div>
  )
}

export default AppLayout




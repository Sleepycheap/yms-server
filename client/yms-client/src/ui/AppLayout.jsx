import { Outlet, useNavigation } from "react-router-dom"
import Header from './Header'

function AppLayout() {
  const navigation = useNavigation()
  // const isLoading = navigation.state === 'loading'

  return (
    <div >
      
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




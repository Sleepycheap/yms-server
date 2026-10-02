import {createHashRouter, RouterProvider} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import AppLayout from './ui/AppLayout'
import Error from './ui/Error'
import Home from './pages/Home'
import LoadScreen from './pages/LoadScreen'
import Tests from './pages/Tests'
import LoadVerification from './pages/LoadVerification'
import { Toaster } from 'react-hot-toast'
import 'dotenv/config'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
    
  }
})

const router = createHashRouter([
{
  element: <AppLayout />,
  errorElement: <Error />,

  children: [
    {
      path: '/',
      element: <Home />,
      errorElement: <Error />
    },
    {
      path: `/load`,
      element: <LoadScreen />,
      errorElement: <Error />
    },
    {
      path: '/tests',
      element: <Tests/>
    },
    {
      path: 'error',
      element: <Error />
    },
    {
      path: '/complete',
      element: <LoadVerification />
    }

  ]
}
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
      <Toaster
       position='top-center' 
       gutter={12} 
       containerStyle={{margin: '8px'}}
       toastOptions={{
        success: {
          duration: 3000,
        },
        error: {
          duration: 3000
        },
        style: {
          fontSize: "16px",
          maxWidth: "500px",
          padding: "16px 24px",
          backgroundColor: "oklch(86.9% 0.005 56.366)",
          color: "oklch(21.6% 0.006 56.043)"
        }
       }} 
      />
    </QueryClientProvider>

  )
}

export default App

import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { useState, useEffect } from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import AppLayout from './ui/AppLayout'
import Error from './ui/Error'
import Home from './ui/Home'
import LoadScreen from './features/load/LoadScreen'
import TruckIDs from './features/truck/TruckIDs'
import { getTrucks } from './utils/apiFunctions'
import { truckLoader } from './utils/loaders'
import Login from './features/user/Login'
import Tests from './ui/Tests'
import BarcodeScanner from './components/BarcodeScanner'
import LoadTable from './features/load/LoadTable'
import Spinner from './components/Spinner'
import { Toaster } from 'react-hot-toast'
// import axios from 'axios'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0
    }
  }
})

const router = createBrowserRouter([
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
      path: '/truckids/:orgcode',
      element: <TruckIDs />,
      errorElement: <Error />,
      loader: truckLoader,
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/tests',
      element: <LoadTable />
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
          duration: 5000
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

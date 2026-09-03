import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { useState, useEffect } from 'react'
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
// import axios from 'axios'

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
      element: <Tests />
    }

  ]
}
])


function App() {
  return (
      <RouterProvider router={router} />

  )
}

export default App

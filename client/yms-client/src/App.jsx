import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import AppLayout from './ui/AppLayout'
import Error from './ui/Error'
import Home from './ui/Home'
// import axios from 'axios'

const router = createBrowserRouter([
{
  path: '/',
  element: <AppLayout />,
  errorElement: <Error />,

  children: [
    {
      index: true,
      element: <Home />
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

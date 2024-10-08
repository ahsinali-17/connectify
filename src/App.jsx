import  Login  from './components/Login'
import  Home from './components/Home'
import Profile from './components/Profile'
import Navbar from './components/Navbar'
import Register from './components/Register'
import { useState } from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from './components/ForgotPassword'
import ResetPass from './components/ResetPass'
import ChangePass from './components/ChangePass'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login/>,
    },
    {
      path: '/home',
      element:<><Navbar/><Home/></>,
    },
    {
      path: '/profile/:userId',
      element:<><Navbar/><Profile/></>,
    },
    {
      path: '/register',
      element: <Register/>,
    },
    {
      path: '/forgotpassword',
      element: <ForgotPassword/>,
    },
    {
      path: '/resetpass/:token',
      element: <ResetPass/>,
    },
    {
      path: '/changepass/:id',
      element: <ChangePass/>,
    }
  ])

  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      <RouterProvider router={router}/>
    </>
  )
}

export default App

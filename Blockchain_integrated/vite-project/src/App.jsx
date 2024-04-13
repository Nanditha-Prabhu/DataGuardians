import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Navbar from "../components/Navbar"
import Home from "../components/Home"
import SignUp from "../components/SignUp"
import SignIn from "../components/SignIn"
import Footer from "../components/Footer"
import UploadData from '../components/UploadData';
import AccessData from '../components/AccessData';
import { AuthProvider } from "../src/contexts/authContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/SignIn",
    element: (
      <AuthProvider>
        <Navbar />
        <SignIn />
        <Footer />
      </AuthProvider>
    ),
  },
  {
    path: "/SignUp",
    element: (
      <AuthProvider>
        <Navbar />
        <SignUp />
        <Footer />
      </AuthProvider>
    ),
  },
  {
    path: "/Access_Data",
    element: (
      <>
        <Navbar />
        <AccessData/>
        <Footer />
      </>
    ),
  },
  {
    path: "/Upload_Data",
    element: (
      <>
        <Navbar />
        <UploadData/>
        <Footer />
      </>
    ),
  },
  {
    path: "/Privacy_Regulations",
    element: (
      <>
        <Navbar />
        <Footer />
      </>
    ),
  },
  
]);

export default function App() {
  return <RouterProvider router={router} />;
}

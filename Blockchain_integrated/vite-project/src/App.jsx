import "./App.css";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import Footer from "../components/Footer";
import UploadData from "../components/UploadData";
import AccessData from "../components/AccessData";
import PrivacyRegulations from "../components/PrivacyRegulations";
import YourProfile from "../components/YourProfile";
import { AuthProvider } from "../src/contexts/authContext/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Navbar />
        <Home />
        <Footer />
      </AuthProvider>
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
      <AuthProvider>
        <Navbar />
        <AccessData />
        <Footer />
      </AuthProvider>
    ),
  },
  {
    path: "/Upload_Data",
    element: (
      <AuthProvider>
        <Navbar />
        <UploadData />
        <Footer />
      </AuthProvider>
    ),
  },
  {
    path: "/Privacy_Regulations",
    element: (
      <AuthProvider>
        <Navbar />
        <PrivacyRegulations />
        <Footer />
      </AuthProvider>
    ),
  },
  {
    path: "/Your_Profile",
    element: (
      <AuthProvider>
        <Navbar />
        <YourProfile />
        <Footer />
      </AuthProvider>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

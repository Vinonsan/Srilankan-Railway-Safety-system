/* eslint-disable no-unused-vars */
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/react/LoginPage";
import Register from "./pages/react/RegisterPage";
import HomePage from "./pages/react/HomePage ";
import ResetPassword from "./pages/react/ResetPassword";
import SelectRoute from "./pages/react/SelectRoute  ";
import HazardLocation from "./pages/react/HazardLocation ";
import AdminHomePage from "./pages/react/AdminHomePage ";
import ApproveHazard from "./pages/react/ApproveHazard ";
import AdminApproveHazardLocation from "./pages/react/AdminApproveHazardLocation ";
import UpdateLPDetails from "./pages/react/UpdateLPDetails";
import AdminHazardLocation from "./pages/react/AdminHazardLocation ";
import UpdateHazard from "./pages/react/UpdateHazard";
import Checking from "./pages/react/Checking";
import AdminViewHazardLocation from "./pages/react/AdminViewHazardLocation";
import ChangePassword from "./pages/react/ChangePassword";
import App from "./App";



const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/homepage",
    element: <HomePage />,
  },
  {
    path: "/resetpassword",
    element: <ResetPassword />,
  },
  {
    path: "/selectroute",
    element: <SelectRoute />,
  },
  {
    path: "/hazardlocation",
    element: <HazardLocation />,
  },
  {
    path: "/adminhomepage",
    element: <AdminHomePage />,
  },
  {
    path: "/approvehazard",
    element: <ApproveHazard />,
  },
  {
    path: "/adminapprovehazardlocation",
    element: <AdminApproveHazardLocation />,
  },
  {
    path: "/updatelpdetails",
    element: <UpdateLPDetails />,
  },
  {
    path: "/adminhazardlocation",
    element: <AdminHazardLocation />,
  },
  {
    path: "/updatehazard",
    element: <UpdateHazard />,
  },
  {
    path: "/adminviewhazardlocation",
    element: <AdminViewHazardLocation />,
  },
  {
    path: "/check",
    element: <Checking />,
  },
  {
    path: "/changepassword",
    element: <ChangePassword />,
  },
  {
    path: "/app",
    element: <App />,
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


import './index.css'
import App from './App.jsx'
import * as React from "react";
import * as ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Login from './Dashboard/Login.jsx';
import { AuthProvider } from './AuthContext.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import SingleStory from './SingleStory.jsx';
import MainLayout from './MainLayout.jsx';




const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {

        path : "/",
        element: <App></App>
      },
      {
        path: "/story/:id",
        element: <SingleStory />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboardWebsite",
    element: <Dashboard />
  }
  
 

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

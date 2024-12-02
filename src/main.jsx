import './index.css';
import App from './App.jsx';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'; // Ensure Navigate is imported here
import './index.css';
import Login from './Dashboard/Login.jsx';
import { AuthProvider } from './AuthContext.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import SingleStory from './SingleStory.jsx';
import Videos from './Videos.jsx';
import Story from './Story.jsx';
import StoryHeader from './StoryHeader.jsx';
import Gallery from './Gallery.jsx';
import PrivateRoute from './Dashboard/PrivateRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/story/:id',
    element: <SingleStory />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboardWebsite',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: '/videos',
    element: (
      <div className="bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] min-h-[100vh] pb-10 md:pb-20">
        <StoryHeader />
        <Videos />
      </div>
    ),
  },
  {
    path: '/story',
    element: (
      <div className="bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] min-h-[100vh] pb-10 md:pb-20">
        <StoryHeader />
        <Story />
      </div>
    ),
  },
  {
    path: '/gallery',
    element: (
      <div className="bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] min-h-[100vh] pb-10 md:pb-20">
        <StoryHeader />
        <Gallery />
      </div>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" />, // Redirect unknown routes to login
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

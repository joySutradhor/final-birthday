import './index.css';
import App from './App.jsx';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import './index.css';
import Dashboard from './Dashboard/Dashboard.jsx';
import SingleStory from './SingleStory.jsx';
import Videos from './Videos.jsx';
import Story from './Story.jsx';
import StoryHeader from './StoryHeader.jsx';
import Gallery from './Gallery.jsx';
import UserLogin from './UserLogin.jsx';
import PrivateRoute from './PrivateRoute.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLogin />,
  },
  {
    path: '/root-page',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },
  {
    path: '/story/:id',
    element: (
      <PrivateRoute>
        <SingleStory />
      </PrivateRoute>
    ),
  },

  {
    path: '/dashboard',
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
        <PrivateRoute>
          <StoryHeader />
          <Videos />
        </PrivateRoute>
      </div>
    ),
  },
  {
    path: '/story',
    element: (
      <div className="bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] min-h-[100vh] pb-10 md:pb-20">
        <PrivateRoute>
          <StoryHeader />
          <Story />
        </PrivateRoute>
      </div>
    ),
  },
  {
    path: '/gallery',
    element: (
      <div className="bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] min-h-[100vh] pb-10 md:pb-20">
        <PrivateRoute>
          <StoryHeader />
          <Gallery />
        </PrivateRoute>
      </div>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

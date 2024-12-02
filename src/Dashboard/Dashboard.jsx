import React from 'react';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Banner from './Banner/Banner';
import Story from './Story/Story';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import VideoAlbum from './VideoAlbum/VideoAlbum';
import DashboardMainLayout from './DashboardMainLayout';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import './dashboard.css';
import Photo from './PhotoGallery/Photo';
import { useNavigate } from 'react-router-dom';  
import { AiOutlineGlobal } from "react-icons/ai";
import Music from './Music/Page';


const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'create-banner', title: 'Create Banner', icon: <AddIcon /> },
  { segment: 'create-story', title: 'Create Story', icon: <BorderColorIcon /> },
  { segment: 'video-album', title: 'Video Album', icon: <OndemandVideoIcon /> },
  { segment: 'photo-gallery', title: 'Photo Gallery', icon: <AddToPhotosIcon /> },
  { segment: 'upload-music', title: 'Upload Music', icon: <AddToPhotosIcon /> },
];

const demoTheme = extendTheme({
  // Removed dark/light mode settings
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => ({
    pathname,
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);

  return router;
}

export default function Dashboard(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const navigate = useNavigate(); // Initialize useNavigate

  // Map routes to components
  const routeToComponent = {
    '/dashboard': <DashboardMainLayout />,
    '/create-banner': <Banner />,
    '/create-story': <Story />,
    '/video-album': <VideoAlbum />,
    '/photo-gallery': <Photo />,
    '/upload-music': <Music />,
  };

  // Default to "Page Not Found" if no route matches
  const CurrentComponent = routeToComponent[router.pathname] || <div>Page Not Found</div>;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={window ? window() : undefined}
    >
      <DashboardLayout>
        <PageContainer>
          {/* Render the component for the current route */}
          <button 
            onClick={() => navigate('/')} 
            className="mt-4  flex gap-2 items-center bg-gray-700 text-white/80 py-2 px-6 rounded transition-all duration-500 ease-in-out"
          >
           <AiOutlineGlobal/> Go to Homepage
          </button>
          {CurrentComponent}
          {/* Add a button to navigate to the homepage */}
          
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}

import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('rootToken'); 
  const location = useLocation();

  if (!isLoggedIn) {
    
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;


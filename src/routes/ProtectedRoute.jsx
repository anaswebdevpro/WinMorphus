
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();
  
  if (!isAuthenticated) {
    
    
    return <Navigate to="/login" replace state={{ from: location }} />;
  }     
  
  return <Outlet />;
};

export default ProtectedRoute;
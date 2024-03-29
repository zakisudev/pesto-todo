import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const userInfo =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo'));

  return userInfo?.success ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

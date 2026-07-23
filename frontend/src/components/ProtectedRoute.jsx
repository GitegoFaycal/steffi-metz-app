import { Navigate, Outlet } from 'react-router-dom';
import { isAdminLoggedIn } from '../api/authApi';

export default function ProtectedRoute() {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
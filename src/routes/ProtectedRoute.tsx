import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

interface ProtectedRouteProps {
  requiredRole?: "ADMIN" | "USER";
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredRole && auth.user?.rol !== requiredRole) {
    return <Navigate to="/dashboard" />; // O redirige a una página de error 403
  }

  return <Outlet />;
}

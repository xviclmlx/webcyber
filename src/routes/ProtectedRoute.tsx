import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

interface ProtectedRouteProps {
  requiredRole?: "ADMIN" | "USER";
  children: React.ReactNode; // 👈 Necesario para recibir el Layout
}

export default function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredRole && auth.user?.rol !== requiredRole) {
    return <Navigate to="/" />; // O a una página de error 403
  }

  return <>{children}</>; // ✅ Renderiza el layout con navbar y Outlet
}

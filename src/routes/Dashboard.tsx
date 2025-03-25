import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const auth = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Tu estado es: {auth.isAuthenticated ? "Autenticado" : "No autenticado"}</p>
      <button onClick={auth.logout}>Cerrar sesión</button>
    </div>
  );
}

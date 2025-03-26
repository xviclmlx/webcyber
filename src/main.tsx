import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';

import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';

// CLIENTE
import ClientProfile from './pages/client/Profile.tsx';
import Comparaciones from './pages/client/Comparaciones.tsx';
import Recorridos from './pages/client/Recorridos.tsx';

// ADMIN
import AdminProfile from './pages/admin/Profile.tsx';
import Usuarios from './pages/admin/Usuarios.tsx';
import Records from './pages/admin/Records.tsx';

import ProtectedRoute from './routes/ProtectedRoute.tsx';
import DefaultLayout from './layout/DefaultLayout.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';

// 🔐 Layout del CLIENTE
const ClientLayout = () => (
  <ProtectedRoute allowedRoles={["USER"]}>
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  </ProtectedRoute>
);

// 🔐 Layout del ADMIN
const AdminLayout = () => (
  <ProtectedRoute allowedRoles={["ADMIN"]}>
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  </ProtectedRoute>
);

// 🔗 Rutas
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/client",
    element: <ClientLayout />,
    children: [
      { path: "profile", element: <ClientProfile /> },
      { path: "comparaciones", element: <Comparaciones /> },
      { path: "recorridos", element: <Recorridos /> }
    ]
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "profile", element: <AdminProfile /> },
      { path: "usuarios", element: <Usuarios /> },
      { path: "records", element: <Records /> }
    ]
  }
]);

// 🧠 Render
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

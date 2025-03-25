import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx'; // ✅

import Dashboard from './routes/Dashboard.tsx';
import Comparaciones from './pages/client/Comparaciones.tsx';
import Profile from './pages/client/Profile.tsx';

import ProtectedRoute from './routes/ProtectedRoute.tsx';
import DefaultLayout from './layout/DefaultLayout.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';

// 🛠️ Configuración de rutas
const router = createBrowserRouter([
  {
    path: "/", // Página pública principal
    element: <Home />
  },
  {
    path: "/login", // Página pública
    element: <Login />
  },
  {
    path: "/register", // ✅ Usamos /register en lugar de /signup
    element: <Register />
  },
  {
    path: "/", // Rutas protegidas (navbar + autenticación)
    element: (
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/comparaciones",
        element: <Comparaciones />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ]
  }
]);

// 🧠 Montaje en el DOM
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

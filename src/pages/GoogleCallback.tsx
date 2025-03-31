import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../auth/constants';
import styles from '../styles/GoogleCallback.module.css';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');
      const userId = params.get('userId');

      if (!accessToken || !refreshToken || !userId) {
        setError('Faltan datos de autenticación. Por favor, intente nuevamente.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener datos del usuario');
        }

        const userData = await response.json();
        await saveUser({
          accessToken,
          refreshToken,
          user: {
            id: parseInt(userId),
            email: userData.email,
            name: userData.name,
            rol: userData.rol
          }
        });

        // Redirigir según el rol
        if (userData.rol === 'ADMIN') {
          navigate('/admin/profile');
        } else {
          navigate('/client/profile');
        }
      } catch (error) {
        console.error('Error en el callback de Google:', error);
        setError('Error al procesar el inicio de sesión. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    handleGoogleCallback();
  }, [navigate, location, saveUser]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>Error de Autenticación</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className={styles.retryButton}
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loadingCard}>
        <div className={styles.spinner}></div>
        <p>Procesando inicio de sesión...</p>
      </div>
    </div>
  );
} 
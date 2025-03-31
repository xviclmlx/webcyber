import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import { AuthResponse, AuthResponseError } from "../Types/types";
import styles from "../styles/Login.module.css";
import DefaultLayout from "../layout/DefaultLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.isAuthenticated) {
    const rol = auth.user?.rol;
    return <Navigate to={rol === "ADMIN" ? "/admin/profile" : "/client/profile"} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorResponse("");
    setIsLoading(true);

    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      setErrorResponse("Por favor, complete todos los campos.");
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setErrorResponse("Por favor, ingrese un correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const json = (await response.json()) as AuthResponse;
        if (json.accessToken && json.refreshToken) {
          await auth.saveUser(json);
          if (json.user?.rol === "ADMIN") {
            navigate("/admin/profile");
          } else {
            navigate("/client/profile");
          }
        } else {
          setErrorResponse("Error en la respuesta del servidor.");
        }
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorResponse("Error de conexión con el servidor. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  function handleGoogleLogin() {
    const params = new URLSearchParams({
      prompt: 'select_account',
      access_type: 'offline'
    });
    const googleAuthUrl = `${API_URL}/auth/google?${params.toString()}`;
    console.log('Redirigiendo a:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  }

  return (
    <DefaultLayout>
      <div className={styles.loginContainer}>
        <span onClick={() => navigate("/")} className={styles.backArrow}>
          ⬅️
        </span>

        <div className={styles.loginCard}>
          <h2>Iniciar Sesión</h2>

          {!!errorResponse && (
            <div className={styles.errorMessage}>{errorResponse}</div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              required
            />

            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Entrar"}
            </button>
          </form>

          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className={`${styles.loginButton} ${styles.googleButton}`}
            disabled={isLoading}
          >
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}

import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constatns";
import { AuthResponse, AuthResponseError } from "../Types/types";
import styles from "../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  // 🔁 Corregido: redirige al perfil según el rol
  if (auth.isAuthenticated) {
    const rol = auth.user?.rol;
    return <Navigate to={rol === "ADMIN" ? "/admin/profile" : "/client/profile"} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        setErrorResponse("");
        const json = (await response.json()) as AuthResponse;

        if (json.accessToken && json.refreshToken) {
          await auth.saveUser(json);

          // 🔁 Redirige según el rol
          if (json.user?.rol === "ADMIN") {
            navigate("/admin/profile");
          } else {
            navigate("/client/profile");
          }
        }
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
      }

    } catch (error) {
      console.error(error);
      setErrorResponse("Error de conexión con el servidor");
    }
  };

  return (
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
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />

          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

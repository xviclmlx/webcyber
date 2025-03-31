import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../Types/types";
import styles from "../styles/Register.module.css"; // 🎨 Estilos elegantes

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!name.trim()) return setError("El nombre es obligatorio.");
    if (!email.trim()) return setError("El correo es obligatorio.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const json = (await response.json()) as AuthResponseError;
        setError(json.body.error);
      }
    } catch (error) {
      console.error(error);
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <span className={styles.backButton} onClick={() => navigate("/")}>
        ⬅️
      </span>

      <div className={styles.registerBox}>
        <h2 className={styles.title}>Registro</h2>

        {error && <p className={styles.errorText}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />

          <button type="submit" className={styles.registerButton}>
            Registrarse
          </button>
        </form>

        <p className={styles.loginText}>
          ¿Ya tienes una cuenta?{" "}
          <span className={styles.loginLink} onClick={() => navigate("/login")}>
            Inicia sesión aquí
          </span>
        </p>
      </div>
    </div>
  );
}

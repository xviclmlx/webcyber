import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../auth/constatns";
import styles from "../../styles/Profile.module.css";

const Profile = () => {
  const auth = useAuth();
  const userId = localStorage.getItem("userId");
  const token = auth.getAccessToken();

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setFormData({ name: data.name || "", email: data.email || "" });
        } else {
          setError("Error al obtener los datos del perfil.");
        }
      } catch (err) {
        setError("Error de red.");
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMessage("Perfil actualizado con éxito 🥳");
      } else {
        const err = await res.json();
        setError(err.message || "Error al actualizar.");
      }
    } catch (err) {
      setError("Error de red.");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Mi Perfil</h2>

      {error && <p className={styles.errorText}>{error}</p>}
      {successMessage && <p className={styles.successText}>{successMessage}</p>}

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <label>Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          placeholder="Tu nombre completo"
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="tucorreo@ejemplo.com"
        />

        <button type="submit" className={styles.saveButton}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default Profile;

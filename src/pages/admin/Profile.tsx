import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../auth/constants";
import styles from "../../styles/Profile.module.css";

const AdminProfile = () => {
  const auth = useAuth();
  const userId = localStorage.getItem("userId");
  const token = auth.getAccessToken();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // campo extra para nueva contraseña
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
          }));
        } else {
          setError("Error al obtener los datos del administrador.");
        }
      } catch (err) {
        setError("Error de red.");
      }
    };

    fetchAdmin();
  }, [userId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const dataToSend = {
      name: formData.name,
      email: formData.email,
      ...(formData.password && { password: formData.password }) // solo si se escribe
    };

    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        setSuccessMessage("Perfil actualizado correctamente ✅");
        setFormData({ ...formData, password: "" }); // limpiar campo de contraseña
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
      <h2>Mi Perfil (Admin)</h2>

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
          placeholder="Tu nombre"
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

export default AdminProfile;

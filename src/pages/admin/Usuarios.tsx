import React, { useEffect, useState } from "react";
import Recorridos from "../client/Recorridos";
import Comparaciones from "../client/Comparaciones";
import GraficaResumen from "../../components/GraficaResumen";
import { Dialog } from "@headlessui/react";
import styles from "../../styles/Usuarios.module.css";
import { API_URL } from "../../auth/constants";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserRol, setSelectedUserRol] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Formulario
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const openModal = (userId: number, rol: string) => {
    if (rol === "ADMIN") return;
    setSelectedUserId(userId);
    setSelectedUserRol(rol);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedUserId(null);
      setSelectedUserRol(null);
    }, 300);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al crear el usuario.");
      }

      setForm({ name: "", email: "", password: "" });
      fetchUsuarios();
      setSuccessMsg("✅ Administrador registrado exitosamente.");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>👨‍💼 Crear nuevo administrador</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={handleInput}
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleInput}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleInput}
        />

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {successMsg && <p className={styles.success}>{successMsg}</p>}

        <button type="submit" className={styles.saveButton} disabled={loading}>
          {loading ? "Guardando..." : "Registrar administrador"}
        </button>
      </form>

      <hr className={styles.separator} />

      <h2 className={styles.title}>📋 Usuarios registrados</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user: any) => (
              <tr key={user.id} className={user.rol === "ADMIN" ? styles.adminRow : ""}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>
                  {user.rol === "USER" ? (
                    <button
                      className={styles.detailsButton}
                      onClick={() => openModal(user.id, user.rol)}
                    >
                      Ver detalles
                    </button>
                  ) : (
                    <span className={styles.disabledTag}>Sin viajes</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isOpen} onClose={closeModal} className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <Dialog.Panel className={styles.modalPanel}>
            <Dialog.Title className={styles.modalTitle}>
              Detalles del usuario #{selectedUserId}
            </Dialog.Title>

            {selectedUserId && selectedUserRol === "USER" && (
              <>
                <Recorridos key={`recorridos-${selectedUserId}`} userIdProp={selectedUserId} />
                <Comparaciones key={`comparaciones-${selectedUserId}`} userIdProp={selectedUserId} />
                <GraficaResumen userId={selectedUserId} />
              </>
            )}

            <div className={styles.modalActions}>
              <button className={styles.closeButton} onClick={closeModal}>
                ✖️ Cerrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Usuarios;

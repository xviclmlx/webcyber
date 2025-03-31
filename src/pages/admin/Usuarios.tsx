import React, { useEffect, useState } from "react";
import Recorridos from "../client/Recorridos";
import Comparaciones from "../client/Comparaciones";
import { Dialog } from "@headlessui/react";
import styles from "../../styles/Usuarios.module.css";
import { API_URL } from "../../auth/constants";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const openModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedUserId(null);
    }, 300); // espera animación antes de desmontar componentes
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🗂️ Gestión de usuarios</h2>
      <p className={styles.subtitle}>
        Aquí puedes ver, editar o eliminar usuarios registrados.
      </p>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>🆔 IDENTIFICACIÓN</th>
              <th>👤 Nombre</th>
              <th>📧 Correo</th>
              <th>⚙️ Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(usuarios) &&
              usuarios.map((user: any) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className={styles.detailsButton}
                      onClick={() => openModal(user.id)}
                    >
                      Detalles de {user.name}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={isOpen}
        onClose={closeModal}
        className={styles.modalOverlay}
      >
        <div className={styles.modalContent}>
          <Dialog.Panel className={styles.modalPanel}>
            <Dialog.Title className={styles.modalTitle}>
              Detalles del usuario #{selectedUserId}
            </Dialog.Title>

            {selectedUserId && (
              <>
                <Recorridos key={`recorridos-${selectedUserId}`} userIdProp={selectedUserId} />
                <Comparaciones key={`comparaciones-${selectedUserId}`} userIdProp={selectedUserId} />
              </>
            )}

            <div className={styles.modalActions}>
              <button
                className={styles.closeButton}
                onClick={closeModal}
              >
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from "../styles/Home.module.css"; // Aplica estilos
import serviceImage from "../assets/image.png"; // Ruta de la imagen del modal

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <PayPalScriptProvider options={{ clientId: "AYc6RjCjAfk3zWRkUyU5ivi0ZFz3tXOOKIG0lbURxuH9t8AFEYQTpMfTqk468bWq5K6ytkE81UNefqIC" }}>
      <div className={styles.homeContainer}>
        {/* Título con animación */}
        <h1 className={styles.homeTitle}>CyberBag</h1>

        {/* Botón de Iniciar Sesión (A la izquierda, más abajo) */}
        <div className={styles.leftButtonContainer}>
          <button className={styles.loginButton} onClick={() => navigate("/login")}>
            Iniciar Sesión
          </button>
        </div>

        {/* Nuevo botón de REGISTRARSE que abre el modal */}
        <div className={styles.registerContainer}>
          <button className={styles.registerButton} onClick={() => setModalOpen(true)}>
            Registrarse
          </button>
        </div>

        {/* Modal de pago con PayPal */}
        {modalOpen && (
          <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>Información del Servicio</h2>
              <img src={serviceImage} alt="Servicio" className={styles.modalImage} />
              <p className={styles.modalText}>
                Mochila monitoreadora de distancias largas para su control y cuidado de temperatura, 
                además de seguimiento GPS en tiempo real.
              </p>

              {/* Botón de Pago con PayPal */}
              <div className={styles.paypalContainer}>
                <h3>Adquirir CyberBag</h3>
                <PayPalButtons
                  style={{ layout: "horizontal" }}
                  createOrder={(data, actions) => {
                    if (!actions.order) return Promise.reject(new Error("Order action not available"));
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: "99.99",
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    if (!actions.order) return Promise.reject(new Error("Order action not available"));
                    return actions.order.capture().then((details) => {
                      const payerName = details.payer?.name?.given_name || "Usuario";
                      alert(`Pago exitoso. Bienvenido ${payerName}!`);
                      setModalOpen(false); // ✅ Cierra el modal después del pago
                      navigate("/register"); // ✅ Redirige al formulario de registro
                    });
                  }}
                />
              </div>

              {/* Botón de Cerrar Modal */}
              <button className={styles.closeButton} onClick={() => setModalOpen(false)}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default Home;

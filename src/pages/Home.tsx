import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from "../styles/Home.module.css";
import serviceImage from "../assets/image.png";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <PayPalScriptProvider options={{ clientId: "AYc6RjCjAfk3zWRkUyU5ivi0ZFz3tXOOKIG0lbURxuH9t8AFEYQTpMfTqk468bWq5K6ytkE81UNefqIC" }}>
      <div className={styles.mainContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoText}>CYBER</span>
            <span className={styles.logoAccent}>PACK</span>
          </div>
          <nav className={styles.nav}>
            <button className={styles.navButton} onClick={() => navigate("/login")}>
              <span>Iniciar Sesión</span>
            </button>
            <button className={styles.navButtonAccent} onClick={() => setModalOpen(true)}>
              <span>Registrarse</span>
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              El Futuro del
              <span className={styles.gradientText}> Monitoreo Inteligente</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Tecnología de vanguardia para el seguimiento y control de tus envíos
            </p>
            <button className={styles.ctaButton} onClick={() => setModalOpen(true)}>
              Obtener CyberPack
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Características Principales</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌡️</div>
              <h3>Control de Temperatura</h3>
              <p>Monitoreo en tiempo real de la temperatura de tus productos</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📍</div>
              <h3>GPS en Tiempo Real</h3>
              <p>Seguimiento preciso de la ubicación en todo momento</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Análisis Avanzado</h3>
              <p>Estadísticas detalladas de cada envío</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>Seguridad Garantizada</h3>
              <p>Protección total de tus productos durante el transporte</p>
            </div>
          </div>
        </section>

        {/* Objetivos Section */}
        <section className={styles.objectivesSection}>
          <h2 className={styles.sectionTitle}>Nuestros Objetivos</h2>
          <div className={styles.objectivesContent}>
            <div className={styles.objectiveCard}>
              <h3>Innovación Continua</h3>
              <p>Desarrollamos soluciones tecnológicas de vanguardia para revolucionar la logística.</p>
            </div>
            <div className={styles.objectiveCard}>
              <h3>Satisfacción del Cliente</h3>
              <p>Nos comprometemos a superar las expectativas de nuestros clientes en cada envío.</p>
            </div>
            <div className={styles.objectiveCard}>
              <h3>Sostenibilidad</h3>
              <p>Implementamos prácticas eco-amigables en toda nuestra cadena de operaciones.</p>
            </div>
          </div>
        </section>

        {/* Valores Section */}
        <section className={styles.valuesSection}>
          <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>⭐</span>
              <h3>Excelencia</h3>
              <p>Buscamos la perfección en cada aspecto de nuestro servicio.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🤝</span>
              <h3>Confianza</h3>
              <p>Construimos relaciones sólidas basadas en la transparencia y honestidad.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>💡</span>
              <h3>Innovación</h3>
              <p>Mejoramos constantemente nuestras soluciones tecnológicas.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🌍</span>
              <h3>Responsabilidad</h3>
              <p>Comprometidos con el medio ambiente y la sociedad.</p>
            </div>
          </div>
        </section>

        {/* Beneficios Section */}
        <section className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>Beneficios del Servicio</h2>
          <div className={styles.benefitsContainer}>
            <div className={styles.benefitColumn}>
              <h3>Para Empresas</h3>
              <ul className={styles.benefitsList}>
                <li>✓ Control total de la cadena de suministro</li>
                <li>✓ Reducción de costos operativos</li>
                <li>✓ Análisis predictivo de rutas</li>
                <li>✓ Reportes personalizados</li>
                <li>✓ Integración con sistemas existentes</li>
              </ul>
            </div>
            <div className={styles.benefitColumn}>
              <h3>Para Clientes</h3>
              <ul className={styles.benefitsList}>
                <li>✓ Seguimiento en tiempo real</li>
                <li>✓ Notificaciones instantáneas</li>
                <li>✓ Interfaz intuitiva</li>
                <li>✓ Soporte 24/7</li>
                <li>✓ Garantía de entrega</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Estadísticas Section */}
        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Nuestro Impacto</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>98%</span>
              <p>Satisfacción del cliente</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>50K+</span>
              <p>Envíos monitoreados</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>24/7</span>
              <p>Soporte técnico</p>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>30%</span>
              <p>Reducción de costos</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>¿Listo para revolucionar tu logística?</h2>
          <p>Únete a las empresas que ya confían en CyberPack</p>
          <button className={styles.ctaButton} onClick={() => setModalOpen(true)}>
            Comenzar Ahora
          </button>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerColumn}>
              <h3>CyberPack</h3>
              <p>Innovación en logística y monitoreo de envíos</p>
            </div>
            <div className={styles.footerColumn}>
              <h3>Contacto</h3>
              <p>Email: info@cyberpack.com</p>
              <p>Tel: +1 234 567 890</p>
            </div>
            <div className={styles.footerColumn}>
              <h3>Síguenos</h3>
              <div className={styles.socialLinks}>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
                <a href="#">Facebook</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2024 CyberPack. Todos los derechos reservados.</p>
          </div>
        </footer>

        {/* Modal de Registro */}
        {modalOpen && (
          <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Únete a la Revolución CyberPack</h2>
                <button className={styles.closeButton} onClick={() => setModalOpen(false)}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalImageContainer}>
                  <img src={serviceImage} alt="CyberPack Device" className={styles.modalImage} />
                  <div className={styles.imageOverlay}>
                    <span className={styles.tagNew}>NUEVO</span>
                    <span className={styles.tagPrice}>$99.99 USD</span>
                  </div>
                </div>

                <div className={styles.modalInfo}>
                  <h3 className={styles.modalSubtitle}>Características Premium</h3>
                  <ul className={styles.featuresList}>
                    <li>✓ Monitoreo GPS en tiempo real</li>
                    <li>✓ Control de temperatura avanzado</li>
                    <li>✓ Alertas instantáneas</li>
                    <li>✓ Dashboard personalizado</li>
                    <li>✓ Soporte técnico 24/7</li>
                  </ul>

                  <div className={styles.paypalSection}>
                    <h3 className={styles.paypalTitle}>Adquiere Tu CyberPack Ahora</h3>
                    <PayPalButtons
                      style={{ 
                        layout: "horizontal",
                        color: "blue",
                        shape: "pill",
                        label: "pay"
                      }}
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
                          alert(`¡Bienvenido a CyberPack, ${payerName}!`);
                          setModalOpen(false);
                          navigate("/register");
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default Home;

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rol = auth.user?.rol;

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const currentPath = location.pathname;

  const clientLinks = [
    { path: "/client/profile", label: "Perfil" },
    { path: "/client/recorridos", label: "Recorridos" },
    { path: "/client/comparaciones", label: "Comparaciones" }
  ];

  const adminLinks = [
    { path: "/admin/profile", label: "Perfil" },
    { path: "/admin/usuarios", label: "Usuarios" },
    { path: "/admin/records", label: "Records" }
  ];

  const userLinks = rol === "USER" ? clientLinks : rol === "ADMIN" ? adminLinks : [];

  const handleLogout = () => {
    auth.logout(); // ← tu método en AuthProvider
    navigate("/login");
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.logo}>
          <Link to="/" style={styles.brand}>CyberPack</Link>
        </div>

        <div style={styles.menuContainer}>
          {!auth.isAuthenticated && currentPath !== "/login" && (
            <button onClick={() => navigate("/login")} style={styles.loginBtn}>
              Iniciar Sesión
            </button>
          )}

          {auth.isAuthenticated && (
            <div style={styles.dropdown}>
              <button onClick={toggleMenu} style={styles.dropdownBtn}>
                Menú ☰
              </button>
              {menuOpen && (
                <ul style={styles.dropdownContent}>
                  {userLinks.filter(link => link.path !== currentPath).map(link => (
                    <li key={link.path}>
                      <Link to={link.path} style={styles.link} onClick={() => setMenuOpen(false)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <hr style={{ borderColor: "#222", margin: "0.5rem 0" }} />
                  <li>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </header>

      <main style={styles.main}>{children}</main>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: "#000",
    borderBottom: "2px solid #00BFFF",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  brand: {
    color: "#00BFFF",
    textDecoration: "none",
    fontSize: "1.5rem",
    fontWeight: "bold"
  },
  menuContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  loginBtn: {
    backgroundColor: "transparent",
    color: "#00BFFF",
    border: "1px solid #00BFFF",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  dropdown: {
    position: "relative"
  },
  dropdownBtn: {
    backgroundColor: "#000",
    color: "#00BFFF",
    border: "1px solid #00BFFF",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  dropdownContent: {
    position: "absolute",
    right: 0,
    top: "110%",
    backgroundColor: "#111",
    border: "1px solid #00BFFF",
    borderRadius: "8px",
    padding: "0.5rem",
    listStyle: "none",
    zIndex: 999,
    minWidth: "180px"
  },
  link: {
    color: "#00BFFF",
    textDecoration: "none",
    padding: "6px 12px",
    display: "block",
    fontWeight: "bold",
    borderRadius: "4px"
  },
  logoutBtn: {
    background: "transparent",
    color: "#ccc",
    fontSize: "0.85rem",
    border: "none",
    cursor: "pointer",
    padding: "6px 12px",
    textAlign: "left",
    width: "100%"
  },
  logo: {
    display: "flex",
    alignItems: "center"
  },
  main: {
    padding: "2rem",
    backgroundColor: "#111",
    minHeight: "100vh",
    color: "#fff"
  }
};

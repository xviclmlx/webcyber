import React, { useEffect, useState } from "react";
import styles from "../../styles/Recorridos.module.css";

interface RecorridosProps {
  userIdProp?: number;
}

const Recorridos = ({ userIdProp }: RecorridosProps) => {
  const [recorridos, setRecorridos] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = userIdProp || Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchRecorridos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/viajes/${userId}`);
        const data = await res.json();
        console.log("📦 Datos recibidos:", data);
        setRecorridos(data);
      } catch (err) {
        console.error("❌ Error al obtener recorridos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchRecorridos();
  }, [userId]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📘 Recorridos</h2>
      <p className={styles.subtitle}>Aquí puedes visualizar los recorridos realizados con tu CyberBag.</p>

      {loading ? (
        <p className={styles.loading}>Cargando...</p>
      ) : recorridos.length === 0 ? (
        <p className={styles.noData}>No hay recorridos disponibles.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Kilómetros</th>
                <th>Duración</th>
                <th>Temperatura</th>
                <th>Humedad</th>
              </tr>
            </thead>
            <tbody>
              {recorridos.map((recorrido, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(recorrido.fechaInicio).toLocaleString()}</td>
                  <td>{recorrido.fechaFin ? new Date(recorrido.fechaFin).toLocaleString() : "En curso..."}</td>
                  <td>{recorrido.totalKm} km</td>
                  <td>{Math.floor((recorrido.duracionSeg || 0) / 60)} min</td>
                  <td>{recorrido.temperaturaPromedio} °C</td>
                  <td>{recorrido.humedadPromedio} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Recorridos;

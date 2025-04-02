import React, { useEffect, useState } from "react";
import styles from "../../styles/Recorridos.module.css";

interface Recorrido {
  fechaInicio: string;
  fechaFin: string | null;
  totalKm: number;
  duracionSeg: number;
  temperaturaPromedio: number;
  humedadPromedio: number;
}

interface RecorridosProps {
  userIdProp?: number;
}

const Recorridos = ({ userIdProp }: RecorridosProps) => {
  const [recorridos, setRecorridos] = useState<Recorrido[]>([]);
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
        <>
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

          <div className={styles.promediosContainer}>
            <h3 className={styles.promediosTitle}>📊 Promedios Totales</h3>
            <div className={styles.promediosGrid}>
              <div className={styles.promedioCard}>
                <span className={styles.promedioLabel}>Kilómetros Promedio</span>
                <span className={styles.promedioValue}>
                  {(recorridos.reduce((acc, curr) => acc + curr.totalKm, 0) / recorridos.length).toFixed(2)} km
                </span>
              </div>
              <div className={styles.promedioCard}>
                <span className={styles.promedioLabel}>Duración Promedio</span>
                <span className={styles.promedioValue}>
                  {Math.floor(recorridos.reduce((acc, curr) => acc + (curr.duracionSeg || 0), 0) / recorridos.length / 60)} min
                </span>
              </div>
              <div className={styles.promedioCard}>
                <span className={styles.promedioLabel}>Temperatura Promedio</span>
                <span className={styles.promedioValue}>
                  {(recorridos.reduce((acc, curr) => acc + curr.temperaturaPromedio, 0) / recorridos.length).toFixed(1)} °C
                </span>
              </div>
              <div className={styles.promedioCard}>
                <span className={styles.promedioLabel}>Humedad Promedio</span>
                <span className={styles.promedioValue}>
                  {(recorridos.reduce((acc, curr) => acc + curr.humedadPromedio, 0) / recorridos.length).toFixed(1)} %
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Recorridos;

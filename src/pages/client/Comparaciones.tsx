import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import styles from "../../styles/Comparaciones.module.css";

interface ComparacionesProps {
  userIdProp?: number;
}

const Comparaciones = ({ userIdProp }: ComparacionesProps) => {
  const [viajes, setViajes] = useState([]);
  const userId = userIdProp || Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const res = await fetch(`http://localhost:3000/viajes/${userId}`);
        const data = await res.json();
        console.log("📊 Viajes del usuario:", data);
        setViajes(data);
      } catch (err) {
        console.error("❌ Error al obtener viajes:", err);
      }
    };

    if (userId) fetchViajes();
  }, [userId]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📈 Comparaciones de tus Viajes</h2>
      <p className={styles.subtitle}>Visualiza la distancia, duración y temperatura de cada uno de tus viajes.</p>

      {viajes.length === 0 ? (
        <p className={styles.loading}>Cargando datos...</p>
      ) : (
        <>
          <div className={styles.graphContainer}>
            <h3 className={styles.graphTitle}>Kilómetros por viaje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viajes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalKm" name="Kilómetros" fill="#00bcd4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.graphContainer}>
            <h3 className={styles.graphTitle}>Duración por viaje (min)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viajes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duracionSeg" name="Duración (seg)" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.graphContainer}>
            <h3 className={styles.graphTitle}>Temperatura promedio por viaje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viajes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="temperaturaPromedio" name="Temperatura °C" fill="#8bc34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Comparaciones;

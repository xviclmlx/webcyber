import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import styles from "../../styles/Records.module.css";
import { CORE_API } from "../../auth/constants"; // ✅ Usamos CORE_API para rutas generales

const Records = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch(`${CORE_API}/viajes/competencia`);
        const data = await res.json();
        console.log("📊 Datos de competencia recibidos:", data);
        setDatos(data);
      } catch (error) {
        console.error("❌ Error al obtener estadísticas de competencia:", error);
      }
    };

    fetchDatos();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏁 Competencia de los usuarios</h2>
      <p className={styles.subtitle}>
        Aquí se comparan los usuarios según su rendimiento acumulado y promedio.
      </p>

      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>Total de Kilómetros Recorridos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalKm" fill="#4fc3f7" name="Kilómetros totales" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>Duración Promedio (segundos)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="promedioDuracion" fill="#ffb74d" name="Duración Promedio" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>Temperatura Promedio</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="promedioTemperatura" fill="#81c784" name="Temp. Promedio" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Records;

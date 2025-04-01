import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
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
import { CORE_API } from "../../auth/constants";

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
          <AreaChart data={datos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4fc3f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="nombre" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="totalKm" stroke="#4fc3f7" fillOpacity={1} fill="url(#colorKm)" name="Kilómetros totales" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>Duración Promedio (segundos)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={datos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDur" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffb74d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ffb74d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="nombre" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="promedioDuracion" stroke="#ffb74d" fillOpacity={1} fill="url(#colorDur)" name="Duración Promedio" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>Temperatura Promedio</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={datos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#81c784" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#81c784" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="nombre" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="promedioTemperatura" stroke="#81c784" fillOpacity={1} fill="url(#colorTemp)" name="Temp. Promedio" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Records;

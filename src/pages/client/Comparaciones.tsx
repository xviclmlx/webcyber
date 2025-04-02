import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ReferenceLine
} from "recharts";
import styles from "../../styles/Comparaciones.module.css";

// Objetivos ideales para cada métrica
const OBJETIVOS = {
  KILOMETROS_IDEALES: 5, // 5 km por viaje
  DURACION_IDEAL: 1800, // 30 minutos en segundos
  TEMPERATURA_IDEAL: 25 // 25°C
};

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
        const dataFormateada = data.map((viaje: any, index: number) => ({
          name: `Viaje ${index + 1}`,
          totalKm: viaje.totalKm ?? 0,
          duracionSeg: viaje.duracionSeg ?? 0,
          temperaturaPromedio: viaje.temperaturaPromedio ?? 0,
          objetivoKm: OBJETIVOS.KILOMETROS_IDEALES,
          objetivoDuracion: OBJETIVOS.DURACION_IDEAL,
          objetivoTemperatura: OBJETIVOS.TEMPERATURA_IDEAL
        }));
        setViajes(dataFormateada);
      } catch (err) {
        console.error("❌ Error al obtener viajes:", err);
      }
    };

    if (userId) fetchViajes();
  }, [userId]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📈 Comparaciones de tus Viajes</h2>
      <p className={styles.subtitle}>
        Visualiza la distancia, duración y temperatura de cada uno de tus viajes.
      </p>

      {viajes.length === 0 ? (
        <p className={styles.loading}>Cargando datos...</p>
      ) : (
        <div className={styles.graphsGrid}>
          {/* Gráfica de Kilómetros */}
          <div className={styles.graphCard}>
            <h3 className={styles.graphTitle}>Kilómetros por Viaje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={viajes}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00bcd4" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2a2a2a", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />

                <ReferenceLine
                  y={OBJETIVOS.KILOMETROS_IDEALES}
                  stroke="#ff4444"
                  strokeDasharray="3 3"
                  label={{ value: "Goal", position: "right", fill: "#ff4444", fontSize: 12 }}
                />

                <Area
                  type="monotone"
                  dataKey="totalKm"
                  stroke="#00bcd4"
                  fillOpacity={1}
                  fill="url(#colorKm)"
                  name="Kilómetros"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica de Duración */}
          <div className={styles.graphCard}>
            <h3 className={styles.graphTitle}>Duración por Viaje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={viajes}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorDuracion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2a2a2a", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />

                <ReferenceLine
                  y={OBJETIVOS.DURACION_IDEAL}
                  stroke="#ff4444"
                  strokeDasharray="3 3"
                  label={{ value: "Goal", position: "right", fill: "#ff4444", fontSize: 12 }}
                />

                <Area
                  type="monotone"
                  dataKey="duracionSeg"
                  stroke="#ff9800"
                  fillOpacity={1}
                  fill="url(#colorDuracion)"
                  name="Duración (seg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica de Temperatura */}
          <div className={styles.graphCard}>
            <h3 className={styles.graphTitle}>Temperatura por Viaje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={viajes}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8bc34a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8bc34a" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2a2a2a", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />

                <ReferenceLine
                  y={OBJETIVOS.TEMPERATURA_IDEAL}
                  stroke="#ff4444"
                  strokeDasharray="3 3"
                  label={{ value: "Goal", position: "right", fill: "#ff4444", fontSize: 12 }}
                />

                <Area
                  type="monotone"
                  dataKey="temperaturaPromedio"
                  stroke="#8bc34a"
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                  name="Temperatura °C"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparaciones;

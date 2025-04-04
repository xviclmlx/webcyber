import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "../../styles/Records.module.css";
import { CORE_API } from "../../auth/constants";

const Records = () => {
  const [datosSubconsulta, setDatosSubconsulta] = useState([]);
  const [datosView, setDatosView] = useState([]);
  const [viajeros, setViajeros] = useState([]);

  // ✅ Mostrar números formateados
  const formatNumber = (value) => {
    return typeof value === "number" ? value.toFixed(2) : "N/A";
  };

  // 📦 Subconsulta: top 3 usuarios
  useEffect(() => {
    const fetchSubconsulta = async () => {
      try {
        const res = await fetch(`${CORE_API}/viajes/competencia`);
        const data = await res.json();
        setDatosSubconsulta(data);
        console.log("📦 Subconsulta:", data);
      } catch (error) {
        console.error("❌ Error en subconsulta:", error);
      }
    };
    fetchSubconsulta();
  }, []);

  // 🧠 View SQL completa
  useEffect(() => {
    const fetchView = async () => {
      try {
        const res = await fetch(`${CORE_API}/viajes/view`);
        const data = await res.json();
        if (Array.isArray(data)) setDatosView(data);
        else setDatosView([]);
      } catch (error) {
        console.error("❌ Error en view:", error);
        setDatosView([]);
      }
    };
    fetchView();
  }, []);

  // 👥 Usuarios con +10 viajes
  useEffect(() => {
    const fetchViajeros = async () => {
      try {
        const res = await fetch(`${CORE_API}/auth/users/viajeros/top`);
        const data = await res.json();
        if (Array.isArray(data)) setViajeros(data);
        else setViajeros([]);
      } catch (error) {
        console.error("❌ Error en viajeros:", error);
        setViajeros([]);
      }
    };
    fetchViajeros();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏁 Comparativa de Usuarios</h2>
      <p className={styles.subtitle}>
        Se muestran los usuarios con mejor rendimiento, comparando distancia,
        duración promedio y temperatura.
      </p>

      {/* 📊 GRÁFICA: Kilómetros */}
      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>
          Kilómetros Recorridos (Top 3 usuarios con más viajes)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={datosSubconsulta}>
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
            <Area
              type="monotone"
              dataKey="totalKm"
              stroke="#4fc3f7"
              fillOpacity={1}
              fill="url(#colorKm)"
              name="Kilómetros totales"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 GRÁFICA: Duración */}
      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>
          Duración Promedio de Viajes (en segundos)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={datosSubconsulta}>
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
            <Area
              type="monotone"
              dataKey="promedioDuracion"
              stroke="#ffb74d"
              fillOpacity={1}
              fill="url(#colorDur)"
              name="Duración Promedio"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 GRÁFICA: Temperatura */}
      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>
          Temperatura Promedio Durante los Viajes (°C)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={datosSubconsulta}>
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
            <Area
              type="monotone"
              dataKey="promedioTemperatura"
              stroke="#81c784"
              fillOpacity={1}
              fill="url(#colorTemp)"
              name="Temp. Promedio"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 📋 TABLA: Subconsulta */}
      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>
          📦 Subconsulta SQL (Top 3 por cantidad de viajes)
        </h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Total KM</th>
              <th>Duración Prom (seg)</th>
              <th>Temperatura Prom (°C)</th>
            </tr>
          </thead>
          <tbody>
            {datosSubconsulta.map((u, i) => (
              <tr key={i}>
                <td>{u.nombre}</td>
                <td>{formatNumber(u.totalKm)}</td>
                <td>{formatNumber(u.promedioDuracion)}</td>
                <td>{formatNumber(u.promedioTemperatura)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📋 TABLA: View */}
      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>🧠 Vista SQL (Todos los usuarios con viajes)</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Total KM</th>
              <th>Duración Prom (seg)</th>
              <th>Temperatura Prom (°C)</th>
            </tr>
          </thead>
          <tbody>
            {datosView.map((u, i) => (
              <tr key={i}>
                <td>{u.nombre}</td>
                <td>{formatNumber(u.totalKm)}</td>
                <td>{formatNumber(u.promedioDuracion)}</td>
                <td>{formatNumber(u.promedioTemperatura)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Records;

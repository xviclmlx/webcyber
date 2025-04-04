import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
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
  const [datosSubconsulta, setDatosSubconsulta] = useState([]);
  const [datosView, setDatosView] = useState([]);
  const [viajeros, setViajeros] = useState([]);

  // ✅ Función segura para mostrar números
  const formatNumber = (value) => {
    if (value === null || value === undefined) return "0.00";
    const parsed = Number(value);
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2);
  };

  // 📦 Subconsulta SQL
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

  // 🧠 View SQL
  useEffect(() => {
    const fetchView = async () => {
      try {
        const res = await fetch(`${CORE_API}/viajes/view`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setDatosView(data);
        } else {
          console.warn("⚠️ Vista SQL no devolvió un arreglo:", data);
          setDatosView([]);
        }
      } catch (error) {
        console.error("❌ Error en view:", error);
        setDatosView([]);
      }
    };
    fetchView();
  }, []);

  // Usuarios con más de 10 viajes
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
      <h2 className={styles.title}>🏁 Competencia de los usuarios</h2>
      <p className={styles.subtitle}>
        Aquí se comparan los usuarios según su rendimiento acumulado y promedio.
      </p>

      {/* 📊 GRÁFICA: Kilómetros */}
      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>Total de Kilómetros Recorridos</h3>
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
        <h3 className={styles.graphTitle}>Duración Promedio (segundos)</h3>
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
        <h3 className={styles.graphTitle}>Temperatura Promedio</h3>
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
        <h3 className={styles.graphTitle}>📦 Subconsulta SQL (Top 3 por cantidad de viajes)</h3>
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

      {/* 📋 TABLA: View SQL */}
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

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface Props {
  userId: number;
}

const GraficaResumen = ({ userId }: Props) => {
  const [datos, setDatos] = useState([]);

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
        }));

        setDatos(dataFormateada);
      } catch (error) {
        console.error("❌ Error al obtener datos del gráfico:", error);
      }
    };

    if (userId) fetchViajes();
  }, [userId]);

  if (datos.length === 0) return null;

  return (
    <div style={{ marginTop: "2rem", background: "#1e1e1e", padding: "1.5rem", borderRadius: "12px" }}>
      <h3 style={{ color: "#00e5ff", marginBottom: "1rem", fontSize: "20px" }}>
        📊 Resumen gráfico de los viajes
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={datos}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2196f3" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDuracion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ba68c8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ba68c8" stopOpacity={0} />
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
          <Area
            type="monotone"
            dataKey="totalKm"
            stroke="#2196f3"
            fillOpacity={1}
            fill="url(#colorKm)"
            name="Kilómetros"
          />
          <Area
            type="monotone"
            dataKey="temperaturaPromedio"
            stroke="#4caf50"
            fillOpacity={1}
            fill="url(#colorTemp)"
            name="Temperatura °C"
          />
          <Area
            type="monotone"
            dataKey="duracionSeg"
            stroke="#ba68c8"
            fillOpacity={1}
            fill="url(#colorDuracion)"
            name="Duración (seg)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficaResumen;

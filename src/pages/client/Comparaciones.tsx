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
  ReferenceLine
} from "recharts";
import styles from "../../styles/Comparaciones.module.css";

const OBJETIVOS = {
  KILOMETROS_IDEALES: 5,
  DURACION_IDEAL: 1800,
  TEMPERATURA_IDEAL: 25
};

interface RawSensorData {
  temperatura: string;
  humedad: string;
  apertura: string;
  createdAt: string;
}

interface SensorData {
  temperatura: number;
  humedad: number;
  apertura: string;
  timestamp: number;
}


interface ComparacionesProps {
  userIdProp?: number;
}

const Comparaciones = ({ userIdProp }: ComparacionesProps) => {
  const [viajes, setViajes] = useState<any[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
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

    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://10.13.2.1:3000/sensor");
        if (!response.ok) throw new Error("Error al obtener datos del sensor");
    
        const allData: RawSensorData[] = await response.json();
    
        // 🔁 Ordenamos por fecha ascendente y tomamos el último
        allData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const rawData = allData[allData.length - 1];
    
        if (!rawData) {
          console.warn("❌ No se encontró ningún dato en el array");
          return;
        }
    
        const temperaturaNum = parseFloat(rawData.temperatura);
        const humedadNum = parseFloat(rawData.humedad);
        const timestamp = new Date(rawData.createdAt).getTime();
    
        console.log("🌡️ Temperatura:", temperaturaNum, "💧 Humedad:", humedadNum);
    
        if (
          isNaN(temperaturaNum) ||
          isNaN(humedadNum) ||
          isNaN(timestamp)
        ) {
          console.warn("❌ Datos inválidos:", rawData);
          return;
        }
    
        const formattedData: SensorData = {
          temperatura: temperaturaNum,
          humedad: humedadNum,
          apertura: rawData.apertura || "desconocido",
          timestamp
        };
    
        setSensorData((prev) => {
          const newData = [...prev, formattedData];
          console.log("✅ Datos agregados a sensorData:", newData);
          return newData.slice(-20);
        });
      } catch (err) {
        console.error("❌ Error al obtener datos del sensor:", err);
      } finally {
        setLoading(false);
      }
    };
    
    


    if (userId) {
      fetchViajes();
      fetchSensorData();
      const interval = setInterval(fetchSensorData, 5000);
      return () => clearInterval(interval);
    }
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
          {/* Kilómetros */}
          <div className={styles.graphCard}>
            <h3 className={styles.graphTitle}>Kilómetros por Viaje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={viajes} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00bcd4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <Tooltip contentStyle={{ backgroundColor: "#2a2a2a", border: "none" }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <ReferenceLine y={OBJETIVOS.KILOMETROS_IDEALES} stroke="#ff4444" strokeDasharray="3 3" label={{ value: "Meta", position: "right", fill: "#ff4444", fontSize: 12 }} />
                <Area type="monotone" dataKey="totalKm" stroke="#00bcd4" fillOpacity={1} fill="url(#colorKm)" name="Kilómetros" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Duración */}
          <div className={styles.graphCard}>
            <h3 className={styles.graphTitle}>Duración por Viaje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={viajes} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDuracion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <Tooltip contentStyle={{ backgroundColor: "#2a2a2a", border: "none" }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <ReferenceLine y={OBJETIVOS.DURACION_IDEAL} stroke="#ff4444" strokeDasharray="3 3" label={{ value: "Meta", position: "right", fill: "#ff4444", fontSize: 12 }} />
                <Area type="monotone" dataKey="duracionSeg" stroke="#ff9800" fillOpacity={1} fill="url(#colorDuracion)" name="Duración (seg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Temperatura */}
          <div className={styles.graphCard}>
            <h3 className={styles.graphTitle}>Temperatura por Viaje</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={viajes} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8bc34a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8bc34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <Tooltip contentStyle={{ backgroundColor: "#2a2a2a", border: "none" }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <ReferenceLine y={OBJETIVOS.TEMPERATURA_IDEAL} stroke="#ff4444" strokeDasharray="3 3" label={{ value: "Meta", position: "right", fill: "#ff4444", fontSize: 12 }} />
                <Area type="monotone" dataKey="temperaturaPromedio" stroke="#8bc34a" fillOpacity={1} fill="url(#colorTemp)" name="Temperatura °C" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sensor en tiempo real */}
          <div className={styles.graphCard}>
            <h3 className={styles.graphTitle}>Datos del Sensor en Tiempo Real</h3>
            {sensorData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sensorData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSensorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSensorHumedad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4facfe" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="timestamp" tick={{ fill: "#ccc" }} tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                    <YAxis tick={{ fill: "#ccc" }} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <Tooltip contentStyle={{ backgroundColor: "#2a2a2a", border: "none" }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
                    <Legend wrapperStyle={{ color: "#fff" }} />
                    <Area type="monotone" dataKey="temperatura" stroke="#00f2fe" fillOpacity={1} fill="url(#colorSensorTemp)" name="Temperatura °C" isAnimationActive={false} />
                    <Area type="monotone" dataKey="humedad" stroke="#4facfe" fillOpacity={1} fill="url(#colorSensorHumedad)" name="Humedad %" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className={styles.sensorStatus}>
  {sensorData.length > 0 ? (
    <>
      <p>Estado: {sensorData[sensorData.length - 1].apertura}</p>
      <p>Última actualización: {new Date().toLocaleString()}</p>
      <p>Temperatura actual: {sensorData[sensorData.length - 1].temperatura}°C</p>
      <p>Humedad actual: {sensorData[sensorData.length - 1].humedad}%</p>
    </>
  ) : (
    <>
      <p>Estado: N/D</p>
      <p>Última actualización: N/D</p>
      <p>Temperatura actual: N/D</p>
      <p>Humedad actual: N/D</p>
    </>
  )}
</div>

              </>
            ) : (
              <div className={styles.loading}>Cargando datos del sensor...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparaciones;

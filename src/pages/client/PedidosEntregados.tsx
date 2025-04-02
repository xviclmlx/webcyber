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
  ReferenceLine,
} from "recharts";
import styles from "../../styles/Comparaciones.module.css";
import { API_URL } from "../../auth/constants";
import { CORE_URL } from "../../auth/constants";

const OBJETIVO_MENSUAL = 8;

interface PedidosEntregadosProps {
  userId: number;
}

interface Viaje {
  id: number;
  userId: number;
  fechaInicio: string;
  fechaFin: string | null;
  totalKm: number | null;
  duracionSeg: number | null;
  temperaturaPromedio: number | null;
  humedadPromedio: number | null;
}

interface DatosMensuales {
  name: string;
  viajesCompletados: number;
  objetivo: number;
}

const PedidosEntregados = ({ userId }: PedidosEntregadosProps) => {
  const [datosMensuales, setDatosMensuales] = useState<DatosMensuales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${CORE_URL}/viajes/${userId}`);
        if (!res.ok) {
          throw new Error("Error al obtener los viajes");
        }

        const data: Viaje[] = await res.json();
        console.log("🚗 Datos de viajes recibidos:", data);

        const viajesUsuario = data.filter((viaje) => viaje.fechaFin !== null);
        const fechasViajes = viajesUsuario.map((v) => new Date(v.fechaFin!));
        if (fechasViajes.length === 0) {
          setDatosMensuales([]);
          return;
        }

        const minFecha = new Date(Math.min(...fechasViajes.map((f) => f.getTime())));
        const hoy = new Date();

        const meses: Date[] = [];
        let actual = new Date(minFecha.getFullYear(), minFecha.getMonth(), 1);
        while (actual <= hoy) {
          meses.push(new Date(actual));
          actual.setMonth(actual.getMonth() + 1);
        }

        // Comparar mes y año (sin importar día ni hora)
        const mismoMes = (a: Date, b: Date) =>
          a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

        const datosPorMes = meses.map((mes) => {
          const nombreMes = mes.toLocaleDateString("es-ES", {
            month: "short",
            year: "2-digit",
          });
          const viajesDelMes = viajesUsuario.filter((viaje) => {
            const fechaViaje = new Date(viaje.fechaFin!);
            return mismoMes(fechaViaje, mes);
          });

          return {
            name: nombreMes,
            viajesCompletados: viajesDelMes.length,
            objetivo: OBJETIVO_MENSUAL,
          };
        });

        const datosOrdenados = datosPorMes.reverse();

        // Logs para verificar
        console.log("📅 Meses generados:", meses.map((m) => m.toISOString()));
        console.log("📊 Datos mensuales procesados:", datosOrdenados);

        setDatosMensuales(datosOrdenados);
      } catch (err) {
        console.error("❌ Error al obtener viajes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchViajes();
    }
  }, [userId]);

  const noData = datosMensuales.every((d) => d.viajesCompletados === 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🚗 Rendimiento Mensual</h2>
      <p className={styles.subtitle}>
        Comparación de viajes completados vs objetivo mensual
      </p>

      {loading ? (
        <p className={styles.loading}>Cargando datos de viajes...</p>
      ) : noData ? (
        <p className={styles.noData}>No hay datos disponibles para mostrar.</p>
      ) : (
        <div className={styles.graphCard}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={datosMensuales}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorViajes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2196f3" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
              <YAxis
                tick={{ fill: "#ccc" }}
                domain={[
                  0,
                  Math.max(
                    OBJETIVO_MENSUAL * 1.2,
                    ...datosMensuales.map((d) => d.viajesCompletados)
                  ),
                ]}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <Tooltip
                contentStyle={{ backgroundColor: "#2a2a2a", border: "none" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: number, name: string) => {
                  return [`${value} viajes`, name === "viajesCompletados" ? "Completados" : "Objetivo"];
                }}
              />
              <Legend wrapperStyle={{ color: "#fff" }} />

              <ReferenceLine
                y={OBJETIVO_MENSUAL}
                stroke="#ff4444"
                strokeDasharray="3 3"
                label={{
                  value: "Meta",
                  position: "right",
                  fill: "#ff4444",
                  fontSize: 12,
                }}
              />

              <Area
                type="monotone"
                dataKey="viajesCompletados"
                stroke="#2196f3"
                fillOpacity={1}
                fill="url(#colorViajes)"
                name="Viajes Completados"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PedidosEntregados;

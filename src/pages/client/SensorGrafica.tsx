import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import styles from '../../styles/SensorGrafica.module.css';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SensorData {
  temperatura: number;
  humedad: number;
  apertura: boolean;
  timestamp: string;
}

const SensorGrafica: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://localhost:3000/sensor');
      if (!response.ok) {
        throw new Error('Error al obtener datos del sensor');
      }
      const data = await response.json();
      setSensorData(prevData => {
        const newData = [...prevData, data];
        // Mantener solo los últimos 20 datos para la gráfica
        return newData.slice(-20);
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: sensorData.map(data => {
      const date = new Date(data.timestamp);
      return date.toLocaleTimeString();
    }),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: sensorData.map(data => data.temperatura),
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Humedad (%)',
        data: sensorData.map(data => data.humedad),
        borderColor: '#4facfe',
        backgroundColor: 'rgba(79, 172, 254, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#00f2fe',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Cargando datos del sensor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
          <button className={styles.retryButton} onClick={fetchSensorData}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const lastData = sensorData[sensorData.length - 1];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Datos del Sensor en Tiempo Real</h2>
        <p className={styles.lastUpdate}>
          Última actualización: {new Date(lastData?.timestamp).toLocaleString()}
        </p>
      </div>

      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className={styles.dataCards}>
        <div className={styles.dataCard}>
          <h3>Temperatura</h3>
          <p className={styles.dataValue}>{lastData?.temperatura}°C</p>
        </div>
        <div className={styles.dataCard}>
          <h3>Humedad</h3>
          <p className={styles.dataValue}>{lastData?.humedad}%</p>
        </div>
        <div className={styles.dataCard}>
          <h3>Estado</h3>
          <p className={styles.dataValue}>
            {lastData?.apertura ? 'Abierto' : 'Cerrado'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SensorGrafica; 
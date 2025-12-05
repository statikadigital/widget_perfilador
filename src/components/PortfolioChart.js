import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Intentar registrar el plugin de datalabels si está disponible
try {
  const ChartDataLabels = require('chartjs-plugin-datalabels');
  if (ChartDataLabels && ChartDataLabels.default) {
    Chart.register(ChartDataLabels.default);
  } else if (ChartDataLabels) {
    Chart.register(ChartDataLabels);
  }
} catch (e) {
  // El plugin no está instalado, continuar sin él
  console.log('chartjs-plugin-datalabels no está instalado, continuando sin datalabels');
}

const PortfolioChart = ({ labels = [], values = [] }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !labels.length || !values.length) return;

    const ctx = chartRef.current.getContext('2d');

    // Destruir gráfico anterior si existe
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const colors = [
      '#43729c',
      '#4e85b6',
      '#5795cc',
      '#95bee4',
      '#bad5ed',
      '#d3e4f4',
      '#bad5ed',
      '#d0dbf0'
    ];

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        cutout: '55%'
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [labels, values]);

  if (!labels.length || !values.length) {
    return (
      <div className="col-md-6 rueda">
        <canvas id="myChart"></canvas>
      </div>
    );
  }

  return (
    <div className="col-md-6 rueda">
      <canvas ref={chartRef} id="myChart"></canvas>
    </div>
  );
};

export default PortfolioChart;


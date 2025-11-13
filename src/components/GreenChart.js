'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const safeFormatDate = (maybe) => {
  // maybe can be: Date object, ISO 'YYYY-MM-DD', '2025-11-13T...', or string label '13/11'
  if (!maybe && maybe !== 0) return '-';
  // if already a label like '13/11', return as-is (heuristic: contains '/')
  if (typeof maybe === 'string' && maybe.includes('/')) return maybe;
  // Date object
  if (maybe instanceof Date && !isNaN(maybe)) {
    const dd = String(maybe.getDate()).padStart(2, '0');
    const mm = String(maybe.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
  }
  // ISO-ish string yyyy-mm-dd or full ISO -> try parse as Date then use local parts
  if (typeof maybe === 'string') {
    // if already in YYYY-MM-DD format -> just convert parts (avoid timezone shift)
    if (/^\d{4}-\d{2}-\d{2}$/.test(maybe)) {
      const [yyyy, mm, dd] = maybe.split('-');
      return `${dd}/${mm}`;
    }
    // else try Date parse
    const d = new Date(maybe);
    if (!isNaN(d)) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}`;
    }
    // fallback: return original string
    return maybe;
  }
  // number (timestamp)
  if (typeof maybe === 'number') {
    const d = new Date(maybe);
    if (!isNaN(d)) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}`;
    }
  }
  return '-';
};

export default function GreenChart({ data = [] }) {
  // Normalize data into labels[] and values[] in a robust way
  const labels = data.map((item) => {
    // prefer an explicit label if provided
    if (item?.label) return item.label;
    // prefer iso (YYYY-MM-DD) or iso-like string
    if (item?.iso) return safeFormatDate(item.iso);
    // prefer x (Date object)
    if (item?.x) return safeFormatDate(item.x);
    // legacy: date field
    if (item?.date) return safeFormatDate(item.date);
    return '-';
  });

  const values = data.map((item) => {
    const v = item?.y ?? item?.value ?? item?.points ?? 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  });

  // compute sensible max for y axis
  const maxVal = Math.max(...values, 5);
  const suggestedMax = Math.ceil(maxVal < 5 ? 5 : maxVal);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Điểm xanh',
        data: values,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y ?? ctx.parsed ?? 0;
            return ` ${val}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: suggestedMax,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        // category axis: show every tick
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

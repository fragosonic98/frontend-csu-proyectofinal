/* AdminDashboard.jsx — Dashboard del Administrador
   Las gráficas usan Recharts — una librería de React para charts.
*/

import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { mockData } from '../../services/api'

// COLORES — definidos en un solo lugar
const COLORS = {
  blue:   '#3b82f6',
  green:  '#10b981',
  red:    '#ef4444',
  amber:  '#f59e0b',
  purple: '#8b5cf6',
  teal:   '#14b8a6',
  muted:  '#374151',
  grid:   '#1f2937',
  text:   '#9ca3af',
}

// COMPONENTES REUTILIZABLES

// Tarjeta de métrica KPI
function KpiCard({ label, value, sublabel, color = COLORS.blue, icon }) {
  return (
    <div className="card flex items-center gap-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}30` }}
      >
        <span style={{ color }} className="text-lg">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        {sublabel && <p className="text-xs text-gray-600 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}

// Tooltip personalizado para gráficas
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[var(--c-border)] bg-[var(--c-dark)] px-3 py-2 shadow-xl">
      {label && <p className="text-xs text-gray-500 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color || 'white' }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}
        </p>
      ))}
    </div>
  )
}

// Datos para las gráficas
const dash = mockData.admin.dashboard
const mensual = mockData.admin.reporteMensual

const dataAlumnos = [
  { name: 'Activos',   value: dash.alumnosActivos,   color: COLORS.green },
  { name: 'Inactivos', value: dash.alumnosInactivos, color: COLORS.red   },
]

const dataPagos = [
  { name: 'Realizados', value: dash.pagosRealizados,  color: COLORS.blue  },
  { name: 'Pendientes', value: dash.pagosPendientes,  color: COLORS.amber },
]

const dataRadar = [
  { metric: 'Retención',  value: 76 },
  { metric: 'Pagos',      value: 84 },
  { metric: 'Actividad',  value: 68 },
  { metric: 'Satisfacc.', value: 90 },
  { metric: 'Avance',     value: 72 },
]


/**  Ejecutivo — Ingreso destacado + tabla de alumnos */
function Dashboard5() {
  const alumnos = mockData.admin.alumnos

  return (
    <div className="space-y-6">

      {/* Hero: ingreso anual */}
      <div className="card overflow-hidden relative">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-600/5 to-transparent" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Ingreso proyectado anual</p>
            <p className="text-4xl font-bold text-white">
              ${(dash.ingresoAnual / 1000).toFixed(0)}k
              <span className="text-base font-normal text-gray-400 ml-2">USD</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Basado en alumnos activos × $1,500/mes</p>
          </div>
          <div className="flex gap-6 sm:ml-auto">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: COLORS.green }}>{dash.alumnosActivos}</p>
              <p className="text-xs text-gray-500">Activos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: COLORS.red }}>{dash.alumnosInactivos}</p>
              <p className="text-xs text-gray-500">Inactivos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: COLORS.amber }}>{dash.pagosPendientes}</p>
              <p className="text-xs text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tabla de alumnos recientes */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Alumnos recientes</h3>
            <Link to="/admin/alumnos" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-2">
            {alumnos.map(alumno => (
              <div key={alumno.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--c-gray)] transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--c-border)] text-xs font-semibold text-gray-300">
                  {alumno.nombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{alumno.nombre}</p>
                  <p className="text-xs text-gray-500 truncate">{alumno.correo}</p>
                </div>
                <span className={alumno.status === 'activo' ? 'badge-active' : 'badge-inactive'}>
                  {alumno.status === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dos pasteles apilados */}
        <div className="space-y-4">
          {[
            { title: 'Alumnos', data: dataAlumnos },
            { title: 'Pagos del mes', data: dataPagos },
          ].map((chart, i) => (
            <div key={i} className="card">
              <h3 className="text-sm font-medium text-white mb-2">{chart.title}</h3>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={chart.data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                    {chart.data.map((d, j) => <Cell key={j} fill={d.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-400">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  
  return (
    <div className="min-h-screen bg-[var(--c-black)]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado. */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">Dashboard Administrativo</h1>
            <p className="text-sm text-gray-500 mt-0.5">Cidium Security University — Reportería</p>
          </div>
        </div>

        <Dashboard5 />

      </main>
    </div>
  )
}

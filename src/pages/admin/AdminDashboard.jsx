import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { adminAPI } from '../../services/api' // <-- Usamos la API real

const COLORS = { blue: '#3b82f6', green: '#10b981', red: '#ef4444', amber: '#f59e0b' }

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

function Dashboard5({ dash, alumnos }) {
  const dataAlumnos = [
    { name: 'Activos',   value: dash.alumnosActivos,   color: COLORS.green },
    { name: 'Inactivos', value: dash.alumnosInactivos, color: COLORS.red   },
  ]

  const dataPagos = [
    { name: 'Realizados ($)', value: dash.pagosRealizados,  color: COLORS.blue  },
    { name: 'Pendientes ($)', value: dash.pagosPendientes,  color: COLORS.amber },
  ]

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden relative">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-600/5 to-transparent" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Ingreso proyectado (Base activa)</p>
            <p className="text-4xl font-bold text-white">
              ${(dash.ingresoAnual / 1000).toFixed(0)}k <span className="text-base text-gray-400 ml-2">MXN</span>
            </p>
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Directorio (Últimos registrados)</h3>
            <Link to="/admin/alumnos" className="text-xs text-blue-400 hover:text-blue-300">Ver todos →</Link>
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
                <span className={alumno.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                  {alumno.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {[
            { title: 'Distribución de Alumnos', data: dataAlumnos },
            { title: 'Estado de Pagos (MXN)', data: dataPagos },
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
  const [data, setData] = useState({ dash: null, alumnos: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pedimos las 3 cosas al mismo tiempo a la API
    Promise.all([
      adminAPI.getReporteActivos(),
      adminAPI.getReportePagos(),
      adminAPI.getAlumnos()
    ])
    .then(([activosRes, pagosRes, alumnosRes]) => {
      setData({
        dash: {
          alumnosActivos: activosRes.numero_de_alumnos_activos,
          alumnosInactivos: activosRes.numero_de_alumnos_inactivos,
          pagosRealizados: pagosRes.sumatoria_pagos_realizados,
          pagosPendientes: pagosRes.sumatoria_pagos_pendientes,
          ingresoAnual: activosRes.numero_de_alumnos_activos * 1200 * 12 // Cálculo dinámico
        },
        // Solo mostramos los últimos 5 para la vista principal
        alumnos: alumnosRes.alumnos.slice(0, 5).map(a => ({
          id: a.id, nombre: a.name, correo: a.email, status: a.enrollment_status
        }))
      })
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[var(--c-black)]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">Dashboard Administrativo</h1>
            <p className="text-sm text-gray-500 mt-0.5">EduCore — En vivo desde Azure</p>
          </div>
        </div>
        
        {/* PARACAÍDAS DE SEGURIDAD */}
        {loading ? (
          <p className="text-white text-center py-10">Conectando con la base de datos...</p>
        ) : data.dash ? (
          <Dashboard5 dash={data.dash} alumnos={data.alumnos} />
        ) : (
          <div className="text-center py-10 bg-[var(--c-gray)] rounded-xl border border-red-900/50">
            <p className="text-red-400 font-medium mb-2">Error al procesar los datos del servidor.</p>
            <p className="text-sm text-gray-500">Abre la consola (F12) para ver qué endpoint está fallando.</p>
          </div>
        )}
      </main>
    </div>
  )
}
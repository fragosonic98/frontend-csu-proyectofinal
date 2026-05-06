/* AdminAlumnos.jsx — Lista de alumnos para el administrador */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { mockData } from '../../services/api'

export default function AdminAlumnos() {
  const [filtro, setFiltro] = useState('todos') // 'todos' | 'activo' | 'inactivo'
  const [busqueda, setBusqueda] = useState('')

  const alumnos = mockData.admin.alumnos

  // Filtrar alumnos según estado y búsqueda
  const alumnosFiltrados = alumnos.filter(a => {
    const coincideFiltro = filtro === 'todos' || a.status === filtro
    const coincideBusqueda = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                             a.correo.toLowerCase().includes(busqueda.toLowerCase())
    return coincideFiltro && coincideBusqueda
  })

  return (
    <div className="min-h-screen bg-[var(--c-black)]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-6 flex items-center gap-3">
          <Link to="/admin" className="text-gray-500 hover:text-white transition-colors text-sm">
            ← Dashboard
          </Link>
          <span className="text-gray-700">/</span>
          <h1 className="text-xl font-semibold text-white">Alumnos</h1>
        </div>

        {/* Barra de filtros + búsqueda */}
        <div className="card mb-6 flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          {/* Filtros de estado */}
          <div className="flex gap-1 rounded-lg border border-[var(--c-border)] p-1">
            {[
              { val: 'todos',    label: 'Todos' },
              { val: 'activo',   label: 'Activos' },
              { val: 'inactivo', label: 'Inactivos' },
            ].map(f => (
              <button
                key={f.val}
                onClick={() => setFiltro(f.val)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  filtro === f.val ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de alumnos */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[var(--c-border)]">
                <tr>
                  {['Alumno', 'Estado', 'Último pago', 'Acciones'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alumnosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-sm text-gray-500">
                      No se encontraron alumnos con esos criterios
                    </td>
                  </tr>
                ) : alumnosFiltrados.map(alumno => (
                  <tr key={alumno.id} className="border-b border-[var(--c-border)] hover:bg-[var(--c-gray)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--c-border)] text-xs font-semibold text-gray-300">
                          {alumno.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{alumno.nombre}</p>
                          <p className="text-xs text-gray-500">{alumno.correo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={alumno.status === 'activo' ? 'badge-active' : 'badge-inactive'}>
                        {alumno.status === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(alumno.ultimoPago).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer de la tabla */}
          <div className="border-t border-[var(--c-border)] px-4 py-3">
            <p className="text-xs text-gray-500">
              Mostrando {alumnosFiltrados.length} de {alumnos.length} alumnos
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

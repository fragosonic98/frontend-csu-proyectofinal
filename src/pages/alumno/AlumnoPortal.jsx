/* AlumnoPortal.jsx — Portal del Alumno
   Muestra: perfil, estado, historial de pagos, botón de pago */

import { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import PagoModal from './PagoModal'
import { mockData } from '../../services/api'

// Componente de fila de pago en la tabla
function FilaPago({ pago }) {
  const estadoBadge = {
    pagado:   <span className="badge-active">Pagado</span>,
    pendiente:<span className="badge-pending">Pendiente</span>,
    vencido:  <span className="badge-inactive">Vencido</span>,
  }

  return (
    <tr className="border-b border-[var(--c-border)] hover:bg-[var(--c-gray)]/50 transition-colors">
      <td className="py-3 px-4 text-sm text-gray-300">
        {new Date(pago.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-3 px-4 text-sm text-gray-300">{pago.descripcion}</td>
      <td className="py-3 px-4 text-sm font-medium text-white text-right">
        ${pago.monto.toLocaleString()} {pago.moneda}
      </td>
      <td className="py-3 px-4 text-right">
        {estadoBadge[pago.status] || estadoBadge.pagado}
      </td>
    </tr>
  )
}

export default function AlumnoPortal() {
  const [showPagoModal, setShowPagoModal] = useState(false)
  const [pagoExitoso, setPagoExitoso] = useState(false)

  // En producción esto vendría de: useApi(alumnoAPI.getPerfil)
  const perfil = mockData.alumno.perfil
  const pagos  = mockData.alumno.pagos
  const pagoPendiente = mockData.alumno.pagoPendiente

  const handlePagoCompletado = () => {
    setShowPagoModal(false)
    setPagoExitoso(true)
    // En producción, aquí refrescarías los datos del alumno
  }

  return (
    <div className="min-h-screen bg-[var(--c-black)]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Alerta de pago exitoso */}
        {pagoExitoso && (
          <div className="flex items-center gap-3 rounded-xl border border-green-800/50 bg-green-900/20 px-4 py-3">
            <svg width="16" height="16" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-sm text-green-400">
              ¡Pago realizado exitosamente! Tu estado ha sido actualizado a <strong>Activo</strong>.
            </p>
            <button onClick={() => setPagoExitoso(false)} className="ml-auto text-green-600 hover:text-green-400">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Tarjeta de perfil del alumno */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-2xl font-bold text-white">
              {perfil.nombre.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">{perfil.nombre}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{perfil.correo}</p>
              <div className="mt-3 flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-gray-500">Curso</p>
                  <p className="text-sm text-gray-200">{perfil.curso}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estado</p>
                  <div className="mt-0.5">
                    {perfil.status === 'activo'
                      ? <span className="badge-active">Activo</span>
                      : <span className="badge-inactive">Inactivo</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de pago si hay uno pendiente */}
            {pagoPendiente && !pagoExitoso && (
              <div className="shrink-0">
                <div className="text-right mb-2">
                  <p className="text-xs text-gray-500">Saldo pendiente</p>
                  <p className="text-2xl font-bold text-white">
                    ${pagoPendiente.monto.toLocaleString()}
                    <span className="text-sm text-gray-400 font-normal ml-1">{pagoPendiente.moneda}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowPagoModal(true)}
                  className="btn-primary w-full"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Realizar pago
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Historial de pagos */}
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">Historial de pagos</h2>

          {pagos.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">No hay pagos registrados</p>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--c-border)]">
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map(pago => <FilaPago key={pago.id} pago={pago} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de pago */}
      {showPagoModal && (
        <PagoModal
          pago={pagoPendiente}
          onClose={() => setShowPagoModal(false)}
          onSuccess={handlePagoCompletado}
        />
      )}
    </div>
  )
}

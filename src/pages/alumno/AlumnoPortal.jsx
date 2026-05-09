import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import PagoModal from './PagoModal'
import { alumnoAPI } from '../../services/api' 

function FilaPago({ pago }) {
  const estadoBadge = {
    paid:     <span className="badge-active">Pagado</span>,
    pending:  <span className="badge-pending">Pendiente</span>,
    partial:  <span className="badge-inactive">Parcial</span>,
  }

  return (
    <tr className="border-b border-[var(--c-border)] hover:bg-[var(--c-gray)]/50 transition-colors">
      <td className="py-3 px-4 text-sm text-gray-300">
        {new Date(pago.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-3 px-4 text-sm text-gray-300">{pago.descripcion}</td>
      <td className="py-3 px-4 text-sm font-medium text-white text-right">
        ${pago.monto_total?.toLocaleString() || '0'} MXN
      </td>
      <td className="py-3 px-4 text-right">
        {estadoBadge[pago.estatus] || <span className="text-gray-500">{pago.estatus}</span>}
      </td>
    </tr>
  )
}

export default function AlumnoPortal() {
  const [showPagoModal, setShowPagoModal] = useState(false)
  const [pagoExitoso, setPagoExitoso] = useState(false)
  
  const [perfil, setPerfil] = useState(null)
  const [pagos, setPagos] = useState([])
  const [pagoPendiente, setPagoPendiente] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      alumnoAPI.getPerfil(),
      alumnoAPI.getPagos()
    ])
    .then(([resPerfil, resPagos]) => {
      setPerfil(resPerfil)
      // Aseguramos que siempre sea un array aunque la API falle
      const listaPagos = resPagos?.pagos || []
      setPagos(listaPagos)
      
      const pendiente = listaPagos.find(p => p.estatus === 'pending')
      setPagoPendiente(pendiente)
    })
    .catch(err => console.error("Error cargando portal:", err))
    .finally(() => setLoading(false))
  }, [])

  const handlePagoCompletado = () => {
    setShowPagoModal(false)
    setPagoExitoso(true)
    setPagoPendiente(null) 
  }

  if (loading) return <div className="min-h-screen bg-[var(--c-black)] text-white p-10 text-center">Cargando tu portal...</div>

  if (!perfil) return (
    <div className="min-h-screen bg-[var(--c-black)] flex flex-col items-center justify-center p-4">
      <div className="card text-center max-w-md">
        <h2 className="text-red-400 font-bold mb-2">Acceso Denegado / Perfil no encontrado</h2>
        <p className="text-gray-300 text-sm mb-4">No se pudo encontrar información de estudiante asociada a esta cuenta.</p>
        <p className="text-gray-500 text-xs">Tip: Asegúrate de iniciar sesión con un correo de Alumno. Si entraste como superadmin, tu lugar es el Dashboard Administrativo, no el portal de alumnos.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--c-black)]">
      {<Navbar />}

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {pagoExitoso && (
          <div className="flex items-center gap-3 rounded-xl border border-green-800/50 bg-green-900/20 px-4 py-3">
            <svg width="16" height="16" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
            <p className="text-sm text-green-400">¡Pago simulado exitosamente!</p>
            <button onClick={() => setPagoExitoso(false)} className="ml-auto text-green-600"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
          </div>
        )}

        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-2xl font-bold text-white">
              {/* Aquí agregamos el signo de interrogación que faltaba para que no crashee */}
              {perfil?.nombre?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-white">{perfil?.nombre || 'Estudiante'}</h1>
              <div className="mt-3 flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-gray-500">Curso</p>
                  <p className="text-sm text-gray-200">{perfil?.curso || 'No asignado'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estado</p>
                  <div className="mt-0.5">
                    {perfil?.status === 'active'
                      ? <span className="badge-active">Activo</span>
                      : <span className="badge-inactive">Inactivo</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            {pagoPendiente && !pagoExitoso && (
              <div className="shrink-0">
                <div className="text-right mb-2">
                  <p className="text-xs text-gray-500">Saldo pendiente</p>
                  <p className="text-2xl font-bold text-white">
                    ${pagoPendiente.monto_total?.toLocaleString()}
                    <span className="text-sm text-gray-400 font-normal ml-1">MXN</span>
                  </p>
                </div>
                <button onClick={() => setShowPagoModal(true)} className="btn-primary w-full">
                  Realizar pago
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">Historial de cargos y pagos</h2>
          {pagos.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">No tienes cargos asignados en este momento.</p>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--c-border)]">
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Límite de pago</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago, idx) => <FilaPago key={idx} pago={pago} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showPagoModal && pagoPendiente && (
        <PagoModal
          pago={{ ...pagoPendiente, monto: pagoPendiente.monto_total, moneda: 'MXN' }}
          onClose={() => setShowPagoModal(false)}
          onSuccess={handlePagoCompletado}
        />
      )}
    </div>
  )
}
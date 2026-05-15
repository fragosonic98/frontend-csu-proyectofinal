/* PagoModal.jsx — Modal de pago con integración MercadoPago
   
   Flujo:
   1. El alumno da clic en "Pagar"
   2. Se llama a la API para generar el link de MercadoPago
   3. El alumno es redirigido al checkout oficial de MercadoPago
   4. MercadoPago redirige de vuelta a /success, /failure o /pending
*/

import { useState } from 'react'

export default function PagoModal({ pago, onClose, onSuccess }) {
  const [step, setStep]   = useState('form') // 'form' | 'processing'
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStep('processing')

    try {
      // Obtener token JWT del alumno logueado
      const token = localStorage.getItem('educore_token')

      // Llamar a la API para generar el link de MercadoPago
      const response = await fetch(
        'https://bitgames456-proyecto-cidium.hf.space/api/pagos/crear',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      // Si hubo error en MercadoPago, mostrarlo al alumno
      if (data.error_de_mp) {
        setError('Error al generar el pago. Intenta de nuevo.')
        setStep('form')
        return
      }

      // Redirigir al checkout de MercadoPago
      window.location.href = data.init_point   // pruebas
      // window.location.href = data.init_point        // produccion

    } catch (error) {
      setError('Error de conexión. Verifica tu internet.')
      setStep('form')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && step === 'form' && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[var(--c-dark)] border border-[var(--c-border)] overflow-hidden shadow-2xl">

        {/* ─── STEP: Confirmar pago ─── */}
        {step === 'form' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--c-border)]">
              <div>
                <h2 className="text-base font-semibold text-white">Confirmar pago</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Procesado de forma segura por MercadoPago
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[var(--c-gray)] text-gray-400 hover:text-white transition-colors"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Monto a pagar */}
              <div className="flex items-center justify-between rounded-xl bg-[var(--c-gray)] px-4 py-3">
                <span className="text-sm text-gray-400">Colegiatura</span>
                <span className="text-lg font-bold text-white">
                  ${pago?.monto?.toLocaleString()}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    {pago?.moneda}
                  </span>
                </span>
              </div>

              {/* Informacion de MercadoPago */}
              <div className="rounded-xl border border-blue-800/40 bg-blue-900/20 px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="14" height="14" fill="none" stroke="#60a5fa" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-xs font-medium text-blue-400">¿Cómo funciona?</p>
                </div>
                <p className="text-xs text-gray-400">
                  Al dar clic en Pagar serás redirigido al checkout oficial de MercadoPago
                  donde podrás pagar con tarjeta, saldo o cualquier método disponible.
                </p>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Boton de pago */}
              <button type="submit" className="btn-primary w-full text-base py-3">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Pagar ${pago?.monto?.toLocaleString()} {pago?.moneda}
              </button>

              <p className="text-center text-xs text-gray-600">
                Tus datos están encriptados y seguros en MercadoPago
              </p>
            </form>
          </>
        )}

        {/* ─── STEP: Procesando ─── */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-16 px-8 gap-4">
            <div className="h-14 w-14 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-white font-medium">Generando link de pago...</p>
            <p className="text-xs text-gray-500">
              Serás redirigido a MercadoPago en un momento
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

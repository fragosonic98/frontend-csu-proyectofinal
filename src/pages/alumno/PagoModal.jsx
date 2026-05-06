/* PagoModal.jsx — Modal de pago con integración Stripe
   
   En producción con Stripe real necesitas:
   1. npm install @stripe/react-stripe-js @stripe/stripe-js
   2. Crear un PaymentIntent en tu backend
   3. Usar Elements + CardElement de Stripe
   
   Este mock simula el flujo completo visualmente */

import { useState } from 'react'

// Íconos de tarjetas de crédito (SVG inline)
const CardIcons = () => (
  <div className="flex gap-1 items-center">
    {/* Visa */}
    <div className="h-5 w-8 rounded bg-[#1A1F71] flex items-center justify-center">
      <span className="text-[7px] font-black text-white tracking-tight">VISA</span>
    </div>
    {/* Mastercard */}
    <div className="h-5 w-8 rounded bg-gray-800 flex items-center justify-center relative overflow-hidden">
      <div className="absolute left-0.5 w-4 h-4 rounded-full bg-[#EB001B]" />
      <div className="absolute right-0.5 w-4 h-4 rounded-full bg-[#F79E1B] opacity-80" />
    </div>
    {/* AMEX simplificado */}
    <div className="h-5 w-8 rounded bg-[#007BC1] flex items-center justify-center">
      <span className="text-[6px] font-bold text-white">AMEX</span>
    </div>
  </div>
)

export default function PagoModal({ pago, onClose, onSuccess }) {
  const [step, setStep] = useState('form') // 'form' | 'processing' | 'success'
  const [form, setForm] = useState({
    numero: '',
    expiry: '',
    cvc: '',
    nombre: '',
  })
  const [error, setError] = useState('')

  // Formatear número de tarjeta: 1234 5678 9012 3456
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16)
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
  }

  // Formatear fecha: MM/YY
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4)
    if (cleaned.length > 2) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
    return cleaned
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let formatted = value
    if (name === 'numero') formatted = formatCardNumber(value)
    if (name === 'expiry') formatted = formatExpiry(value)
    if (name === 'cvc')    formatted = value.replace(/\D/g, '').slice(0, 4)
    setForm(prev => ({ ...prev, [name]: formatted }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación básica
    if (form.numero.replace(/\s/g, '').length < 16) {
      setError('Número de tarjeta inválido')
      return
    }

    setStep('processing')

    /* ---- CON STRIPE REAL ----
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY)
    const { error } = await stripe.confirmPayment({ ... })
    */

    // Simular proceso de pago
    await new Promise(r => setTimeout(r, 2000))
    setStep('success')
    setTimeout(() => onSuccess(), 1500)
  }

  return (
    // Overlay oscuro (backdrop)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && step === 'form' && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[var(--c-dark)] border border-[var(--c-border)] overflow-hidden shadow-2xl">

        {/* ─── STEP: Formulario de pago ─── */}
        {step === 'form' && (
          <>
            {/* Header del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--c-border)]">
              <div>
                <h2 className="text-base font-semibold text-white">Agregar información de pago</h2>
                <p className="text-xs text-gray-500 mt-0.5">Procesado de forma segura por Stripe</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[var(--c-gray)] text-gray-400 hover:text-white transition-colors"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Monto a pagar */}
              <div className="flex items-center justify-between rounded-xl bg-[var(--c-gray)] px-4 py-3">
                <span className="text-sm text-gray-400">Colegiatura Mayo 2026</span>
                <span className="text-lg font-bold text-white">
                  ${pago?.monto?.toLocaleString()} <span className="text-sm font-normal text-gray-400">{pago?.moneda}</span>
                </span>
              </div>

              {/* Número de tarjeta */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label mb-0">Número de tarjeta</label>
                  <CardIcons />
                </div>
                <div className="relative">
                  <input
                    name="numero"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={form.numero}
                    onChange={handleChange}
                    className="input-field font-mono tracking-wider"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    required
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
              </div>

              {/* Expiración + CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">MM / AA</label>
                  <input
                    name="expiry"
                    type="text"
                    placeholder="MM / AA"
                    value={form.expiry}
                    onChange={handleChange}
                    className="input-field font-mono"
                    autoComplete="cc-exp"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">CVC</label>
                  <div className="relative">
                    <input
                      name="cvc"
                      type="text"
                      placeholder="123"
                      value={form.cvc}
                      onChange={handleChange}
                      className="input-field font-mono"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      required
                    />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* País */}
              <div>
                <label className="form-label">País</label>
                <select className="input-field" defaultValue="MX">
                  <option value="MX">México</option>
                  <option value="US">Estados Unidos</option>
                  <option value="ES">España</option>
                </select>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Botón de pago */}
              <button type="submit" className="btn-primary w-full text-base py-3">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Pagar ${pago?.monto?.toLocaleString()} {pago?.moneda}
              </button>

              <p className="text-center text-xs text-gray-600">
                Tus datos están encriptados y seguros
              </p>
            </form>
          </>
        )}

        {/* ─── STEP: Procesando ─── */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-16 px-8 gap-4">
            <div className="h-14 w-14 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-white font-medium">Procesando pago...</p>
            <p className="text-xs text-gray-500">Por favor no cierres esta ventana</p>
          </div>
        )}

        {/* ─── STEP: Éxito ─── */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-16 px-8 gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 border border-green-800/50">
              <svg width="32" height="32" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">¡Pago exitoso!</h3>
              <p className="text-sm text-gray-400 mt-1">
                Se ha procesado tu pago de ${pago?.monto?.toLocaleString()} {pago?.moneda}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

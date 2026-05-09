/* Login: para ambos roles: admin y alumno
   El backend decide el rol según las credenciales */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import CidiumLogo from '../../components/ui/CidiumLogo'
import { authAPI } from '../../services/api'  // <-- IMPORTANTE: Ya está descomentado

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Estado local del formulario
  const [form, setForm]         = useState({ usuario: '', contraseña: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  // Actualiza el campo del formulario que cambió
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('') // limpia el error al escribir
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Evitar que la página se recargue
    setLoading(true)
    setError('')

    try {
      // 1. LLAMADA AL BACKEND REAL (Hugging Face -> Azure)
      // Esto usará la función que configuramos en api.js
      const response = await authAPI.login(form.usuario, form.contraseña)

      // 2. Extraemos la información de la sesión que nos mandó FastAPI
      const userData = response.data.session

      // 3. Le pasamos el usuario al Contexto de React para que sepa que estamos logueados
      // (Le agregamos 'rol' por si otros componentes del frontend usan esa palabra en español)
      login({ ...userData, rol: userData.role })

      // 4. Redireccionamos dependiendo del rol real que viene de la base de datos
      if (userData.role === 'superadmin') {
        navigate('/admin', { replace: true })
      } else if (userData.role === 'student') {
        navigate('/alumno', { replace: true })
      } else {
        throw new Error("Rol desconocido")
      }

    } catch (err) {
      // Si FastAPI devuelve un error (ej. "Credenciales incorrectas"), se muestra aquí
      setError(err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--c-black)] px-4">
      {/* Fondo con gradiente sutil */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-blue-800/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <CidiumLogo size="lg" showText={false} className="mb-4" />
          <h1 className="text-xl font-semibold text-white">Cidium Security University</h1>
          <p className="mt-1 text-sm text-gray-500">Portal académico</p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="card">
          <h2 className="mb-6 text-base font-medium text-white">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo usuario */}
            <div>
              <label className="form-label" htmlFor="usuario">Usuario o Correo</label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                required
                placeholder="ej. superadmin1@demo.com"
                value={form.usuario}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Campo contraseña con toggle de visibilidad */}
            <div>
              <label className="form-label" htmlFor="contraseña">Contraseña</label>
              <div className="relative">
                <input
                  id="contraseña"
                  name="contraseña"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={form.contraseña}
                  onChange={handleChange}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            {/* Botón submit */}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                  </svg>
                  Verificando...
                </>
              ) : 'Ingresar'}
            </button>
          </form>

        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          © 2026 Cidium Security & Technology S.A. de C.V.
        </p>
      </div>
    </div>
  )
}
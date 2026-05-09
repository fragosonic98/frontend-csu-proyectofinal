/* Navbar.jsx — Barra de navegación superior */

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import CidiumLogo from '../ui/CidiumLogo'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--c-border)] bg-[var(--c-dark)]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <CidiumLogo size="sm" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {/* Cambiamos 'nombre' por 'username' que es lo que viene de Azure */}
                {usuario?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white leading-none">
                  {usuario?.username || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 leading-none mt-0.5 capitalize">
                  {/* Si es superadmin en BD, mostramos 'Administrador' */}
                  {usuario?.rol === 'superadmin' ? 'Administrador' : 'Alumno'}
                </p>
              </div>
            </div>

            <div className="h-5 w-px bg-[var(--c-border)]" />

            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-white transition-colors duration-150 flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
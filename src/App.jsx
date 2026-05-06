import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Páginas
import Login         from './pages/login/Login'
import AlumnoPortal  from './pages/alumno/AlumnoPortal'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAlumnos  from './pages/admin/AdminAlumnos'

// Componentes de ruta
import ProtectedRoute from './components/layout/ProtectedRoute'

// Ruta raíz: redirige según si hay sesión y qué rol tiene
function RootRedirect() {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  return <Navigate to={usuario.rol === 'admin' ? '/admin' : '/alumno'} replace />
}

// Página 404
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--c-black)] text-center px-4">
      <p className="text-6xl font-bold text-[var(--c-border)]">404</p>
      <p className="text-xl font-medium text-white mt-4">Página no encontrada</p>
      <p className="text-sm text-gray-500 mt-2">La ruta que buscas no existe</p>
      <a href="/" className="btn-primary mt-6">Volver al inicio</a>
    </div>
  )
}

export default function App() {
  return (
    // AuthProvider envuelve TODO — así cualquier componente puede usar useAuth()
    <AuthProvider>
      {/* BrowserRouter habilita la navegación con React Router */}
      <BrowserRouter>
        <Routes>
          {/* Raíz — redirige según autenticación */}
          <Route path="/" element={<RootRedirect />} />

          {/* Login — pública */}
          <Route path="/login" element={<Login />} />

          {/* Portal del alumno — solo rol: alumno */}
          <Route path="/alumno" element={
            <ProtectedRoute rol="alumno">
              <AlumnoPortal />
            </ProtectedRoute>
          } />

          {/* Panel de administrador — solo rol: admin */}
          <Route path="/admin" element={
            <ProtectedRoute rol="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/alumnos" element={
            <ProtectedRoute rol="admin">
              <AdminAlumnos />
            </ProtectedRoute>
          } />

          {/* 404 — cualquier otra ruta */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

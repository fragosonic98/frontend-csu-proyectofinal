/* ProtectedRoute.jsx — Guarda de rutas privadas
   
   ANALOGÍA: Es como el guardia de seguridad de un edificio.
   Antes de dejarte pasar a una página, verifica:
   1. ¿Estás autenticado? Si no, te manda al login
   2. ¿Tienes el rol correcto? Si no, te manda a tu área
   
   Uso en App.jsx:
   <ProtectedRoute rol="admin">
     <AdminDashboard />
   </ProtectedRoute>
*/

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, rol }) {
  const { usuario } = useAuth()

  // No autenticado → al login
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  // Rol incorrecto → a su dashboard correspondiente
  if (rol && usuario.rol !== rol) {
    return <Navigate to={usuario.rol === 'admin' ? '/admin' : '/alumno'} replace />
  }

  // Todo bien → mostrar la página
  return children
}

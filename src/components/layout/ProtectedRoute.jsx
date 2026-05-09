/* ProtectedRoute.jsx — Guarda de rutas privadas */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, rol }) {
  const { usuario } = useAuth()

  // 1. No autenticado → al login
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  // 2. Normalizamos los roles (Base de Datos Azure vs Frontend React)
  const rolDelUsuario = usuario.rol; 
  
  const esRutaAdmin = rol === 'admin';
  const esRutaAlumno = rol === 'alumno';

  const esUsuarioAdmin = rolDelUsuario === 'superadmin' || rolDelUsuario === 'admin';
  const esUsuarioAlumno = rolDelUsuario === 'student' || rolDelUsuario === 'alumno';

  // 3. Verificamos permisos
  if (esRutaAdmin && !esUsuarioAdmin) {
    return <Navigate to="/alumno" replace /> // Si no es admin, lo mandamos a alumno
  }

  if (esRutaAlumno && !esUsuarioAlumno) {
    return <Navigate to="/admin" replace /> // Si no es alumno, lo mandamos a admin
  }

  // 4. Todo bien → mostrar la página
  return children
}
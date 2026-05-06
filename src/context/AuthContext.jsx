/* AuthContext.jsx — Contexto de Autenticación
   
   ANALOGÍA: Imagina que el contexto es como una "mochila" que
   llevas en toda la escuela. Cualquier salón (componente) puede
   meter la mano a esa mochila y sacar el carnet del alumno
   (el usuario) sin que tengas que pasárselo a cada maestro.
   
   Sin Context: Login → App → Layout → Header → Avatar (pasas usuario 5 veces)
   Con Context: Login → mochila, Avatar → saca de mochila directamente
*/

import { createContext, useContext, useState } from 'react'

// 1. Creamos la "mochila" vacía
const AuthContext = createContext(null)

// 2. AuthProvider es la "mochila" con contenido — envuelve toda la app
export function AuthProvider({ children }) {
  // usuario puede ser null (no autenticado) o { id, nombre, rol, ... }
  const [usuario, setUsuario] = useState(() => {
    // Recuperar sesión guardada en localStorage si existe
    const saved = localStorage.getItem('cidium_user')
    return saved ? JSON.parse(saved) : null
  })

  // Función de login — en producción aquí llamarías a tu API
  const login = (userData) => {
    setUsuario(userData)
    localStorage.setItem('cidium_user', JSON.stringify(userData))
  }

  // Función de logout — limpia todo
  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('cidium_user')
  }

  // "Metemos" en la mochila: el usuario actual + las funciones
  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Hook personalizado — forma fácil de "meter la mano a la mochila"
//    Uso: const { usuario, login, logout } = useAuth()
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

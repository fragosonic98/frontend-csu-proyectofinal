/* api.js — Capa de Servicios (todas las llamadas a la API)
   
   ANALOGÍA: Este archivo es como el "menú" de un restaurante.
   En lugar de que cada "mesero" (componente) vaya directo a la
   cocina (backend) a pedir lo que sea, todos los pedidos pasan
   por este menú. Si cambia la dirección del backend, solo
   cambias BASE_URL aquí, no en 50 archivos distintos.
   
   ESTRUCTURA:
   - BASE_URL: dirección de tu servidor
   - request(): función genérica que hace todos los fetch
   - authAPI, alumnoAPI, adminAPI: grupos de funciones por tema
*/

// ⚠️ Cambia esto por la URL de tu backend real
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/* ============================================================
   FUNCIÓN BASE — Todos los requests pasan por aquí
   Maneja automáticamente: headers, token JWT, errores
   ============================================================ */
async function request(endpoint, options = {}) {
  // Obtener token de la sesión guardada
  const saved = localStorage.getItem('cidium_user')
  const token = saved ? JSON.parse(saved).token : null

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Si hay token, lo incluye en cada request (autenticación JWT)
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  // Si el servidor dice 401 (no autorizado), limpiar sesión
  if (response.status === 401) {
    localStorage.removeItem('cidium_user')
    window.location.href = '/login'
    return
  }

  // Si hubo error del servidor, lanzar excepción con el mensaje
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error ${response.status}`)
  }

  return response.json()
}

/* ============================================================
   AUTH API — Login, logout, refresh token
   ============================================================ */
export const authAPI = {
  // POST /auth/login — Devuelve { token, user: { id, nombre, rol, ... } }
  login: (usuario, contraseña) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, contraseña }),
    }),

  // GET /auth/me — Verifica token y devuelve datos del usuario
  me: () => request('/auth/me'),
}

/* ============================================================
   ALUMNO API — Endpoints que usa el portal del alumno
   ============================================================ */
export const alumnoAPI = {
  // GET /alumno/perfil — Datos del alumno: nombre, curso, status
  getPerfil: () => request('/alumno/perfil'),

  // GET /alumno/pagos — Historial de pagos del alumno
  getPagos: () => request('/alumno/pagos'),

  // GET /alumno/pago-pendiente — El pago que debe realizar
  getPagoPendiente: () => request('/alumno/pago-pendiente'),
}

/* ============================================================
   ADMIN API — Endpoints del panel de administrador
   ============================================================ */
export const adminAPI = {
  // GET /admin/dashboard — Métricas generales
  // Devuelve: { alumnosActivos, alumnosInactivos, pagosPendientes, pagosRealizados }
  getDashboard: () => request('/admin/dashboard'),

  // GET /admin/alumnos — Lista de todos los alumnos
  getAlumnos: (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString()
    return request(`/admin/alumnos${params ? '?' + params : ''}`)
  },

  // GET /admin/alumnos/:id — Detalle de un alumno
  getAlumno: (id) => request(`/admin/alumnos/${id}`),

  // PATCH /admin/alumnos/:id — Actualizar status de alumno
  updateAlumno: (id, datos) =>
    request(`/admin/alumnos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    }),

  // GET /admin/pagos — Lista de pagos (todos los alumnos)
  getPagos: (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString()
    return request(`/admin/pagos${params ? '?' + params : ''}`)
  },

  // GET /admin/reportes/mensual — Datos para gráficas mensuales
  getReporteMensual: (year = new Date().getFullYear()) =>
    request(`/admin/reportes/mensual?year=${year}`),

  // GET /admin/reportes/alumnos — Stats detalladas de alumnos
  getReporteAlumnos: () => request('/admin/reportes/alumnos'),
}

/* ============================================================
   MOCK DATA — Datos de ejemplo para desarrollo sin backend
   Borra esto cuando tengas tu API real lista
   ============================================================ */
export const mockData = {
  alumno: {
    perfil: {
      id: 1,
      nombre: 'Ana García López',
      curso: 'Ciberseguridad Avanzada',
      status: 'activo',
      avatar: null,
      correo: 'ana.garcia@email.com',
    },
    pagos: [
      { id: 1, fecha: '2026-04-17', descripcion: 'Pago de colegiatura - Abril', monto: 1500, moneda: 'USD', status: 'pagado' },
      { id: 2, fecha: '2026-03-17', descripcion: 'Pago de colegiatura - Marzo', monto: 1500, moneda: 'USD', status: 'pagado' },
      { id: 3, fecha: '2026-02-17', descripcion: 'Pago de colegiatura - Febrero', monto: 1500, moneda: 'USD', status: 'pagado' },
    ],
    pagoPendiente: {
      id: 4,
      descripcion: 'Pago de colegiatura - Mayo',
      monto: 1500,
      moneda: 'USD',
      fechaVencimiento: '2026-05-17',
    },
  },
  admin: {
    dashboard: {
      alumnosActivos: 38,
      alumnosInactivos: 12,
      pagosPendientes: 8,
      pagosRealizados: 42,
      ingresoMes: 57000,
      ingresoAnual: 684000,
    },
    alumnos: [
      { id: 1, nombre: 'Ana García', correo: 'ana@email.com', status: 'activo', curso: 'Ciberseguridad Avanzada', ultimoPago: '2026-04-17' },
      { id: 2, nombre: 'Carlos Rodríguez', correo: 'carlos@email.com', status: 'activo', curso: 'Ciberseguridad Avanzada', ultimoPago: '2026-04-15' },
      { id: 3, nombre: 'María López', correo: 'maria@email.com', status: 'inactivo', curso: 'Ciberseguridad Avanzada', ultimoPago: '2026-02-10' },
      { id: 4, nombre: 'José Martínez', correo: 'jose@email.com', status: 'activo', curso: 'Ciberseguridad Avanzada', ultimoPago: '2026-04-20' },
      { id: 5, nombre: 'Laura Sánchez', correo: 'laura@email.com', status: 'inactivo', curso: 'Ciberseguridad Avanzada', ultimoPago: '2026-01-05' },
    ],
    reporteMensual: [
      { mes: 'Ene', ingresos: 48000, pagos: 32 },
      { mes: 'Feb', ingresos: 52500, pagos: 35 },
      { mes: 'Mar', ingresos: 55500, pagos: 37 },
      { mes: 'Abr', ingresos: 57000, pagos: 38 },
      { mes: 'May', ingresos: 0, pagos: 0 },
    ],
  },
}

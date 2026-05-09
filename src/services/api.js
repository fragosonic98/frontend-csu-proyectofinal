/* api.js — Capa de Servicios (todas las llamadas a la API)
   Conectado al backend en FastAPI (Hugging Face)
*/

// CAMBIAR ESTE A UN VARIABLE DE ENTORNO
const BASE_URL ='https://bitgames456-proyecto-cidium.hf.space/api'

/* ============================================================
   FUNCIÓN BASE — Todos los requests (excepto login) pasan por aquí
   Maneja automáticamente: headers, token JWT, errores
   ============================================================ */
async function request(endpoint, options = {}) {
  // Obtener el token guardado localmente
  const token = localStorage.getItem('educore_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Inyecta el JWT para pasar la barrera de seguridad de FastAPI
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  // Si el token expiró o es inválido (FastAPI devuelve 401)
  if (response.status === 401) {
    localStorage.removeItem('educore_token');
    localStorage.removeItem('educore_username');
    localStorage.removeItem('educore_role');
    window.location.href = '/login'; 
    return;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error del servidor: ${response.status}`);
  }

  return response.json();
}

/* ============================================================
   AUTH API — Login y Logout
   ============================================================ */
export const authAPI = {
  // POST /api/auth/login 
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Credenciales incorrectas");
    }

    const data = await response.json();
    
    // Guardamos la sesión en el navegador automáticamente
    if (data.success && data.data) {
        localStorage.setItem('educore_token', data.data.access_token);
        localStorage.setItem('educore_username', data.data.session.username);
        localStorage.setItem('educore_role', data.data.session.role);
    }
    
    return data;
  },

  // POST /api/auth/logout 
  logout: () => {
    localStorage.removeItem('educore_token');
    localStorage.removeItem('educore_username');
    localStorage.removeItem('educore_role');
    return request('/auth/logout', { method: 'POST' });
  }
}

/* ============================================================
   ALUMNO API — Portal del Estudiante
   ============================================================ */
export const alumnoAPI = {
  // GET /api/estudiantes/me — Perfil del estudiante
  getPerfil: () => request('/estudiantes/me'),

  // GET /api/estudiantes/me/pagos — Historial de cargos y estatus
  getPagos: () => request('/estudiantes/me/pagos'),
}

/* ============================================================
   ADMIN API — Panel de Administrador y Reportes
   ============================================================ */
export const adminAPI = {
  // GET /api/admin/reportes/estudiantes-activos — Stats de activos/inactivos
  getReporteActivos: () => request('/admin/reportes/estudiantes-activos'),

  // GET /api/admin/reportes/pagos — Stats financieras
  getReportePagos: () => request('/admin/reportes/pagos'),

  // GET /api/admin/estudiantes — Lista completa
  getAlumnos: () => request('/admin/estudiantes'),

  // POST /api/admin/estudiantes — Registro de nuevo alumno
  crearAlumno: (datosAlumno) => request('/admin/estudiantes', {
    method: 'POST',
    body: JSON.stringify(datosAlumno) 
  }),

  // POST /api/admin/cargos — Generación de deudas
  crearCargo: (datosCargo) => request('/admin/cargos', {
    method: 'POST',
    body: JSON.stringify(datosCargo)
  })
}

/* ============================================================
   PAGOS API — Integración con MercadoPago
   ============================================================ */
export const pagosAPI = {
  // POST /api/pagos/crear — Genera la preferencia y devuelve el link de pago
  crearPagoMP: () => request('/pagos/crear', {
    method: 'POST'
  }),

  // GET /api/pagos/historial — Historial directo desde MercadoPago/BD
  getHistorialMP: () => request('/pagos/historial'),
}
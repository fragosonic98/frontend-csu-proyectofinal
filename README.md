# Cidium Security University — Frontend

Portal académico para alumnos y administradores.

---

## 🧱 Tecnologías y la analogía del edificio

Imagina que estás construyendo un **edificio de oficinas**:

| Tecnología | Analogía | ¿Para qué sirve? |
|---|---|---|
| **React** | Los cuartos del edificio | Construyes la interfaz con piezas reutilizables (componentes) |
| **Vite** | La constructora | Compila y sirve tu código rápido en desarrollo y producción |
| **Tailwind** | El catálogo de acabados | Clases de CSS listas para usar: `p-4 text-white rounded-lg` |
| **React Router** | El directorio del edificio | Cada URL muestra una "sala" diferente sin recargar la página |
| **Recharts** | El proveedor de muebles de gráficas | Le das los datos y él dibuja la gráfica automáticamente |

### ¿Cómo se relacionan?
```
Vite (compila todo) 
  └─ React (la app)
       ├─ React Router (qué página mostrar)
       ├─ Tailwind (estilos via clases CSS)
       ├─ Recharts (gráficas en dashboards)
       └─ AuthContext (quién está logueado)
```

---

## 📁 Estructura del proyecto

```
src/
├── context/
│   └── AuthContext.jsx   ← "Mochila" global con el usuario logueado
├── services/
│   └── api.js            ← Todas las llamadas a tu backend en un lugar
├── hooks/
│   └── useApi.js         ← Asistente para manejar loading/error/data
├── components/
│   ├── ui/
│   │   └── CidiumLogo.jsx
│   └── layout/
│       ├── Navbar.jsx        ← Barra superior con logo y logout
│       └── ProtectedRoute.jsx ← Guardia de rutas privadas
├── pages/
│   ├── Login.jsx             ← /login
│   ├── alumno/
│   │   ├── AlumnoPortal.jsx  ← /alumno
│   │   └── PagoModal.jsx     ← Modal de pago Stripe
│   └── admin/
│       ├── AdminDashboard.jsx ← /admin (con 5 propuestas)
│       └── AdminAlumnos.jsx  ← /admin/alumnos
├── App.jsx       ← Rutas principales
├── main.jsx      ← Punto de entrada
└── index.css     ← Estilos globales + Tailwind
```

---

## 🚀 Cómo correrlo

```bash
# 1. Instalar dependencias
npm install

# 2. Correr en desarrollo (http://localhost:5173)
npm run dev

# 3. Construir para producción
npm run build
```

### Credenciales de prueba
| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | Administrador |
| `alumno` | `alumno123` | Alumno |

---



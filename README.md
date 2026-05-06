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

## 🔌 Conectar con tu backend

### 1. Configura la URL base
Crea un archivo `.env` en la raíz:
```env
VITE_API_URL=http://tu-backend.com/api
VITE_STRIPE_KEY=pk_live_xxxxx
```

### 2. Activa las llamadas reales en Login.jsx
```js
// Busca este comentario y descomenta:
const data = await authAPI.login(form.usuario, form.contraseña)
login(data.user)
```

### 3. Respuesta esperada del endpoint `/auth/login`
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "nombre": "Carlos Admin",
    "rol": "admin",
    "correo": "admin@cidium.com"
  }
}
```

El token se guarda en `localStorage` y se envía automáticamente en cada request como:
```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

## 💳 Integrar Stripe real

```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

En `PagoModal.jsx`, reemplaza el mock con:
```js
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY)
// Tu backend debe crear un PaymentIntent y devolver el client_secret
const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: { card: elements.getElement(CardElement) }
})
```

---

## 📊 Las 5 propuestas de dashboard

Puedes cambiar entre ellas con los botones en la parte superior de `/admin`:

1. **Clásico** — KPIs + pastel + barras. El más familiar.
2. **Compacto** — Todo en cuadrícula densa con barras de progreso.
3. **Analítico** — Radar de salud + líneas de tendencia.
4. **Minimalista** — Solo barras horizontales de proporción.
5. **Ejecutivo** — Hero metric del ingreso + tabla + pasteles compactos.

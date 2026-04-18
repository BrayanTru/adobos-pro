# AdobosPro — Gestión de Ventas y Gastos

Sistema de gestión comercial para empresas de adobos. Registro de transacciones, clientes, reportes financieros y notificaciones de recompra.

## Inicio rápido (demo offline)

Abre `index.html` directamente en el navegador — funciona sin configuración usando localStorage.

## Producción con Supabase

### 1. Crear proyecto en Supabase
- Ve a [supabase.com](https://supabase.com) → New Project (plan gratuito)
- Copia la **URL** y **anon key** desde Settings → API

### 2. Crear las tablas
- En el dashboard de Supabase → SQL Editor
- Pega y ejecuta el contenido de `schema.sql`

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
# Edita .env.local con tu URL y clave
```

### 4. Instalar y ejecutar
```bash
npm install
npm run dev
```

### 5. Deploy
```bash
npm run build
# Sube la carpeta dist/ a Vercel, Netlify o cualquier hosting estático
```

## Estructura del proyecto

```
src/
├── pages/
│   ├── Dashboard.jsx        # KPIs, gráficas, últimas transacciones
│   ├── Transacciones.jsx    # CRUD de movimientos
│   ├── Clientes.jsx         # Gestión de clientes + Maps
│   ├── Reportes.jsx         # Análisis mensual/anual
│   └── Notificaciones.jsx   # Alertas de recompra
│
├── components/
│   ├── FormTransaccion.jsx  # Modal de registro de transacción
│   ├── FormCliente.jsx      # Modal de cliente
│   ├── TablaTransacciones.jsx
│   └── Notificaciones.jsx
│
├── services/
│   ├── supabaseClient.js    # ← Configura aquí tus credenciales
│   ├── transaccionesService.js
│   └── clientesService.js
│
└── store/
    └── atoms.js             # Estado global con Jotai
```

## Categorías de transacciones

**Ingresos:** Venta de productos · Venta de servicios · Otras ventas

**Egresos:** Materia prima · Comisiones · Transporte/envío · Salarios/pagos · Marketing/publicidad · Gasolina

## Sistema de notificaciones

Cada cliente tiene un ciclo de recompra configurable (default: 25 días).

- `días_restantes = ciclo - (hoy - última_venta)`
- 🔴 ≤ 0 días → **¡Listo para nueva venta!**
- 🟡 1–5 días → Alerta de proximidad
- ✅ > 5 días → Al día

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS |
| Estado | Jotai |
| Routing | React Router v6 |
| Backend | Supabase (PostgreSQL) |
| API | Auto-generada por Supabase REST |
| Mapas | Google Maps (links dinámicos, sin API key) |

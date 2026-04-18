# AdobosPro — Gestión de Ventas y Gastos

Sistema de gestión comercial para empresas de adobos. Permite registrar transacciones con detalle de productos por tamaño, gestionar clientes con ubicación geográfica, visualizar reportes financieros y recibir alertas de recompra automáticas.

---

## Funcionalidades

### Transacciones

- Registro de ingresos y egresos
- En ventas (ingresos): selección de múltiples tamaños de adobo por transacción con cálculo automático del total
- En gastos (egresos): categorización manual y valor libre
- Detalle expandible por transacción mostrando cada línea de producto
- Filtros por tipo de movimiento y búsqueda por descripción

### Clientes

- Creación, edición y eliminación de clientes
- Ubicación detallada: departamento, municipio y dirección exacta
- Enlace directo a Google Maps por cliente
- Configuración de ciclo de recompra individual

### Notificaciones de recompra

Cada cliente tiene un ciclo de recompra configurable (default: 25 días).

```
días_restantes = ciclo - (hoy - última_venta)
```

- 🔴 ≤ 0 días → Listo para nueva venta
- 🟡 1–5 días → Alerta de proximidad
- ✅ > 5 días → Al día
- Opción de eliminar el recordatorio por cliente desde el módulo de notificaciones

### Reportes financieros

- KPIs anuales: ingresos, egresos, utilidad y margen
- Gráfica de ingresos vs egresos por mes
- Gráfica de unidades vendidas por mes
- Ventas desglosadas por tamaño de adobo
- Detalle de utilidad mes a mes
- Egresos agrupados por categoría
- Selector de año

### Dashboard

- KPIs del mes en curso
- Gráfica comparativa de los últimos 6 meses
- Últimas transacciones registradas
- Unidades vendidas por tamaño con barra de progreso relativa
- Contador de alertas de recompra activas

### Configuración de productos

- Precios editables por tamaño directamente desde la interfaz
- Los precios actualizados se aplican automáticamente a nuevas ventas

---

## Tamaños y precios iniciales

| Tamaño        | Gramaje | Precio  |
| ------------- | ------- | ------- |
| Personal      | 80g     | $2.000  |
| Familiar      | 240g    | $3.900  |
| Grande        | 500g    | $8.000  |
| Institucional | 1000g   | $13.000 |

---

## Categorías de transacciones

**Ingresos:** Venta de productos · Venta de servicios · Otras ventas

**Egresos:** Materia prima · Comisiones · Transporte/envío · Salarios/pagos · Marketing/publicidad · Gasolina

---

## Stack tecnológico

| Capa          | Tecnología                                   |
| ------------- | -------------------------------------------- |
| Frontend      | React 18 + Vite                              |
| Estilos       | CSS propio con variables (sin Tailwind)      |
| Estado global | Jotai                                        |
| Routing       | React Router v6                              |
| Base de datos | Supabase (PostgreSQL)                        |
| API           | REST autogenerada por Supabase               |
| Mapas         | Google Maps (enlaces dinámicos, sin API key) |
| Deploy        | Vercel                                       |

---

## Estructura del proyecto

```
src/
├── constants/
│   ├── categorias.js          # Categorías de ingresos y egresos
│   ├── meses.js               # Nombres de meses en español
│   └── ubicaciones.js         # Lista de departamentos de Colombia
│
├── utils/
│   └── format.js              # fmt, fmtDate, initials, daysDiff
│
├── hooks/
│   ├── useClientes.js         # CRUD clientes
│   ├── useTransacciones.js    # CRUD transacciones
│   ├── useRecordatorios.js    # Lógica de recordatorios y alertas
│   ├── usePrecios.js          # Lectura y edición de precios
│   ├── useDashboard.js        # Cálculos y datos del dashboard
│   └── useReportes.js         # Cálculos de reportes por año
│
├── context/
│   └── ToastContext.js        # Contexto global de notificaciones toast
│
├── services/
│   ├── supabaseClient.js      # Inicialización del cliente Supabase
│   ├── clientesService.js     # Queries de clientes y recordatorios
│   ├── transaccionesService.js# Queries de transacciones + items
│   ├── itemsService.js        # Queries de transaccion_items
│   └── preciosService.js      # Queries de precios
│
├── store/
│   └── atoms.js               # Átomos Jotai + derivados (KPIs, métricas, alertas)
│
├── components/
│   ├── ui/
│   │   ├── KPICard.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── BarChart.jsx
│   │   ├── Toast.jsx
│   │   └── ConfirmModal.jsx
│   ├── transacciones/
│   │   ├── FormTransaccion.jsx    # Orquesta ingreso/egreso
│   │   ├── SelectorTipo.jsx       # Botones ingreso/egreso
│   │   ├── FormIngreso.jsx        # Formulario de venta multi-producto
│   │   ├── FormEgreso.jsx         # Formulario de gasto
│   │   ├── LineaProducto.jsx      # Fila editable de tamaño + cantidad
│   │   ├── ResumenVenta.jsx       # Totales calculados de la venta
│   │   ├── TablaTransacciones.jsx # Orquesta la tabla
│   │   ├── FilaTransaccion.jsx    # Fila principal de la tabla
│   │   └── FilaDetalle.jsx        # Fila expandida con detalle de items
│   ├── clientes/
│   │   ├── FormCliente.jsx
│   │   └── TablaClientes.jsx
│   ├── dashboard/
│   │   ├── UltimasTransacciones.jsx
│   │   └── TarjetasUnidades.jsx
│   ├── reportes/
│   │   ├── GraficaUnidades.jsx
│   │   ├── VentasPorTamano.jsx
│   │   ├── DetalleMensual.jsx
│   │   └── EgresosPorCategoria.jsx
│   ├── configuracion/
│   │   └── TablaPrecios.jsx
│   └── notificaciones/
│       └── NotifItem.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Transacciones.jsx
│   ├── Clientes.jsx
│   ├── Reportes.jsx
│   ├── Notificaciones.jsx
│   └── Configuracion.jsx
│
├── App.jsx                    # Shell, sidebar, rutas, carga inicial de datos
├── main.jsx
└── index.css                  # Sistema de diseño completo con variables CSS
```

---

## Base de datos

El schema completo está en `schema.sql`. Las tablas son:

| Tabla               | Descripción                          |
| ------------------- | ------------------------------------ |
| `clientes`          | Datos de clientes con ubicación      |
| `transacciones`     | Cabecera de cada movimiento          |
| `transaccion_items` | Detalle de productos por transacción |
| `recordatorios`     | Ciclo de recompra por cliente        |
| `precios`           | Precios configurables por tamaño     |

---

## Instalación y desarrollo local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/adobos-pro.git
cd adobos-pro
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear proyecto en Supabase

- Ve a [supabase.com](https://supabase.com) → New Project (plan gratuito)
- En el SQL Editor ejecuta el contenido de `schema.sql`
- Copia la **Project URL** y **anon key** desde Settings → API

### 4. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 5. Correr en desarrollo

```bash
npm run dev
# http://localhost:5173
```

---

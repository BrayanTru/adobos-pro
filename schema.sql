-- ============================================================
-- AdobosPro — Schema PostgreSQL para Supabase
-- Versión: 2.0
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABLA: clientes
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre        TEXT NOT NULL,
  departamento  TEXT,
  municipio     TEXT,
  direccion     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLA: transacciones
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transacciones (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha            DATE NOT NULL,
  tipo_movimiento  TEXT NOT NULL CHECK (tipo_movimiento IN ('ingreso', 'egreso')),
  categoria        TEXT NOT NULL,
  cliente_id       UUID REFERENCES clientes(id) ON DELETE SET NULL,
  forma_pago       TEXT NOT NULL CHECK (forma_pago IN ('efectivo', 'transferencia')),
  valor            NUMERIC(15,2) NOT NULL CHECK (valor >= 0),
  descripcion      TEXT,
  -- Campos de resumen para ingresos (el detalle real vive en transaccion_items)
  tamano           TEXT,
  cantidad         INTEGER,
  precio_unitario  NUMERIC(15,2),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLA: transaccion_items
-- Detalle de productos por transacción (multi-tamaño)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transaccion_items (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaccion_id   UUID NOT NULL REFERENCES transacciones(id) ON DELETE CASCADE,
  tamano           TEXT NOT NULL,
  gramos           INTEGER NOT NULL,
  cantidad         INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario  NUMERIC(15,2) NOT NULL,
  subtotal         NUMERIC(15,2) NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLA: recordatorios
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recordatorios (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id          UUID UNIQUE REFERENCES clientes(id) ON DELETE CASCADE,
  fecha_ultima_venta  DATE NOT NULL,
  dias_recordatorio   INTEGER NOT NULL DEFAULT 25 CHECK (dias_recordatorio > 0),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLA: precios
-- Precios configurables por tamaño de producto
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS precios (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tamano      TEXT NOT NULL UNIQUE,
  gramos      INTEGER NOT NULL,
  precio      NUMERIC(15,2) NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- ÍNDICES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha      ON transacciones(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_transacciones_cliente    ON transacciones(cliente_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo       ON transacciones(tipo_movimiento);
CREATE INDEX IF NOT EXISTS idx_items_transaccion        ON transaccion_items(transaccion_id);
CREATE INDEX IF NOT EXISTS idx_recordatorios_cliente    ON recordatorios(cliente_id);

-- ─────────────────────────────────────────────────────────────
-- DATOS INICIALES
-- ─────────────────────────────────────────────────────────────
INSERT INTO precios (tamano, gramos, precio) VALUES
  ('Personal',      80,   2000),
  ('Familiar',      240,  3900),
  ('Grande',        500,  8000),
  ('Institucional', 1000, 13000)
ON CONFLICT (tamano) DO NOTHING;
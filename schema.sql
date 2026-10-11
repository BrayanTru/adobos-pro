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
  telefono      TEXT,
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
  ('Personal',      110,   2000),
  ('Familiar',      240,  3900),
  ('Grande',        500,  8000),
  ('Institucional', 1000, 13000)
ON CONFLICT (tamano) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- FUNCIONES (RPC)
-- Crean / actualizan una transacción junto con sus productos en una
-- sola operación: si algo falla, no se guarda nada a medias.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.actualizar_transaccion(
  p_id          UUID,
  p_transaccion JSONB,
  p_items       JSONB DEFAULT '[]'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_resultado JSONB;
BEGIN
  -- 1. Cabecera (el tipo de movimiento no se modifica)
  UPDATE transacciones SET
    fecha           = (p_transaccion->>'fecha')::DATE,
    categoria       = p_transaccion->>'categoria',
    cliente_id      = NULLIF(p_transaccion->>'cliente_id', '')::UUID,
    forma_pago      = p_transaccion->>'forma_pago',
    valor           = (p_transaccion->>'valor')::NUMERIC,
    descripcion     = p_transaccion->>'descripcion',
    tamano          = p_transaccion->>'tamano',
    cantidad        = (p_transaccion->>'cantidad')::INTEGER,
    precio_unitario = (p_transaccion->>'precio_unitario')::NUMERIC
  WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'La transacción % no existe', p_id;
  END IF;

  -- 2. Reemplazar productos
  DELETE FROM transaccion_items WHERE transaccion_id = p_id;

  INSERT INTO transaccion_items
    (transaccion_id, tamano, gramos, cantidad, precio_unitario, subtotal)
  SELECT p_id, i.tamano, i.gramos, i.cantidad, i.precio_unitario, i.subtotal
  FROM jsonb_to_recordset(COALESCE(p_items, '[]'::JSONB)) AS i(
    tamano TEXT, gramos INTEGER, cantidad INTEGER,
    precio_unitario NUMERIC, subtotal NUMERIC
  );

  -- 3. Devolver la transacción con sus productos (mismo formato que usa la app)
  SELECT to_jsonb(t) || jsonb_build_object(
           'transaccion_items',
           COALESCE((SELECT jsonb_agg(to_jsonb(ti))
                     FROM transaccion_items ti
                     WHERE ti.transaccion_id = t.id), '[]'::JSONB))
  INTO v_resultado
  FROM transacciones t
  WHERE t.id = p_id;

  RETURN v_resultado;
END;
$$;

CREATE OR REPLACE FUNCTION public.crear_transaccion(
  p_transaccion JSONB,
  p_items       JSONB DEFAULT '[]'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_id        UUID;
  v_resultado JSONB;
BEGIN
  INSERT INTO transacciones
    (fecha, tipo_movimiento, categoria, cliente_id, forma_pago, valor,
     descripcion, tamano, cantidad, precio_unitario)
  VALUES (
    (p_transaccion->>'fecha')::DATE,
    p_transaccion->>'tipo_movimiento',
    p_transaccion->>'categoria',
    NULLIF(p_transaccion->>'cliente_id', '')::UUID,
    p_transaccion->>'forma_pago',
    (p_transaccion->>'valor')::NUMERIC,
    p_transaccion->>'descripcion',
    p_transaccion->>'tamano',
    (p_transaccion->>'cantidad')::INTEGER,
    (p_transaccion->>'precio_unitario')::NUMERIC
  )
  RETURNING id INTO v_id;

  INSERT INTO transaccion_items
    (transaccion_id, tamano, gramos, cantidad, precio_unitario, subtotal)
  SELECT v_id, i.tamano, i.gramos, i.cantidad, i.precio_unitario, i.subtotal
  FROM jsonb_to_recordset(COALESCE(p_items, '[]'::JSONB)) AS i(
    tamano TEXT, gramos INTEGER, cantidad INTEGER,
    precio_unitario NUMERIC, subtotal NUMERIC
  );

  SELECT to_jsonb(t) || jsonb_build_object(
           'transaccion_items',
           COALESCE((SELECT jsonb_agg(to_jsonb(ti))
                     FROM transaccion_items ti
                     WHERE ti.transaccion_id = t.id), '[]'::JSONB))
  INTO v_resultado
  FROM transacciones t
  WHERE t.id = v_id;

  RETURN v_resultado;
END;
$$;

GRANT EXECUTE ON FUNCTION public.actualizar_transaccion(UUID, JSONB, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crear_transaccion(JSONB, JSONB) TO anon, authenticated;

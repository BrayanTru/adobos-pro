const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(v);

export default function LineaProducto({
  linea,
  index,
  precios,
  onChange,
  onRemove,
  canRemove,
}) {
  const precioSeleccionado = precios.find((p) => p.tamano === linea.tamano);
  const subtotal =
    (Number(linea.cantidad) || 0) * (precioSeleccionado?.precio || 0);

  const handleTamano = (tamano) => {
    onChange(index, { ...linea, tamano });
  };

  const handleCantidad = (cantidad) => {
    onChange(index, { ...linea, cantidad });
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 120px 140px 36px",
        gap: 8,
        alignItems: "center",
        padding: "10px 14px",
        background: index % 2 === 0 ? "var(--bg3)" : "#fff",
        borderRadius: 8,
        border: "1px solid var(--border)",
      }}>
      {/* Tamaño */}
      <div>
        <select
          className="form-select"
          value={linea.tamano}
          onChange={(e) => handleTamano(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            padding: "4px 0",
            fontWeight: 500,
          }}>
          <option value="">— Tamaño —</option>
          {precios.map((p) => (
            <option key={p.id} value={p.tamano}>
              {p.tamano} ({p.gramos}g) — {fmt(p.precio)}
            </option>
          ))}
        </select>
      </div>

      {/* Cantidad */}
      <div>
        <input
          type="number"
          className="form-input"
          placeholder="Cant."
          min="1"
          value={linea.cantidad}
          onChange={(e) => handleCantidad(e.target.value)}
          style={{ textAlign: "center" }}
        />
      </div>

      {/* Subtotal */}
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          fontSize: 15,
          color: subtotal > 0 ? "#2d6a4f" : "var(--muted)",
          textAlign: "right",
          paddingRight: 4,
        }}>
        {subtotal > 0 ? fmt(subtotal) : "—"}
      </div>

      {/* Eliminar línea */}
      <button
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          border: "1px solid var(--border)",
          background: canRemove ? "#fcecea" : "var(--bg3)",
          color: canRemove ? "#9b2315" : "var(--muted)",
          cursor: canRemove ? "pointer" : "not-allowed",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        ✕
      </button>
    </div>
  );
}

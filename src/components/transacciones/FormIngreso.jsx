import LineaProducto from "./LineaProducto";
import ResumenVenta from "./ResumenVenta";

const LINEA_VACIA = { tamano: "", cantidad: "" };

export default function FormIngreso({
  clientes,
  precios,
  fecha,
  setFecha,
  formaPago,
  setFormaPago,
  clienteId,
  setClienteId,
  descripcion,
  setDescripcion,
  lineas,
  setLineas,
}) {
  const handleLineaChange = (index, nuevaLinea) =>
    setLineas((prev) => prev.map((l, i) => (i === index ? nuevaLinea : l)));

  const handleAgregar = () =>
    setLineas((prev) => [...prev, { ...LINEA_VACIA }]);

  const handleRemove = (index) =>
    setLineas((prev) => prev.filter((_, i) => i !== index));

  return (
    <>
      {/* Fecha + Pago */}
      <div className="form-grid" style={{ marginBottom: 20 }}>
        <div className="form-group">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-input"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Forma de pago</label>
          <select
            className="form-select"
            value={formaPago}
            onChange={(e) => setFormaPago(e.target.value)}>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
      </div>

      {/* Cliente */}
      <div className="form-group" style={{ marginBottom: 20 }}>
        <label className="form-label">Cliente</label>
        <select
          className="form-select"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}>
          <option value="">— Sin cliente —</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Encabezado columnas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 120px 140px 36px",
          gap: 8,
          padding: "6px 14px",
          marginBottom: 6,
        }}>
        {["Tamaño", "Cantidad", "Subtotal", ""].map((h) => (
          <span
            key={h}
            style={{
              fontSize: 11,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              textAlign: h === "Subtotal" ? "right" : "left",
            }}>
            {h}
          </span>
        ))}
      </div>

      {/* Líneas */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginBottom: 12,
        }}>
        {lineas.map((linea, i) => (
          <LineaProducto
            key={i}
            index={i}
            linea={linea}
            precios={precios}
            onChange={handleLineaChange}
            onRemove={handleRemove}
            canRemove={lineas.length > 1}
          />
        ))}
      </div>

      {/* Agregar línea */}
      <button
        onClick={handleAgregar}
        style={{
          width: "100%",
          padding: "9px",
          borderRadius: 8,
          border: "1.5px dashed var(--border)",
          background: "transparent",
          color: "var(--muted)",
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          transition: "all 0.15s",
          marginBottom: 16,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#2d6a4f";
          e.currentTarget.style.color = "#2d6a4f";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color = "var(--muted)";
        }}>
        + Agregar otro tamaño
      </button>

      {/* Resumen */}
      <ResumenVenta lineas={lineas} precios={precios} />

      {/* Descripción */}
      <div className="form-group" style={{ marginTop: 16 }}>
        <label className="form-label">Descripción (opcional)</label>
        <textarea
          className="form-textarea"
          placeholder="Notas adicionales..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
    </>
  );
}

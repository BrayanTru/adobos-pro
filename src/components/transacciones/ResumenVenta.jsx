const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(v);

export default function ResumenVenta({ lineas, precios }) {
  const calcularLinea = (linea) => {
    const precio = precios.find((p) => p.tamano === linea.tamano)?.precio || 0;
    return {
      subtotal: (Number(linea.cantidad) || 0) * precio,
      unidades: Number(linea.cantidad) || 0,
    };
  };

  const items = lineas
    .filter((l) => l.tamano && Number(l.cantidad) > 0)
    .map((l) => ({ ...l, ...calcularLinea(l) }));

  if (items.length === 0) return null;

  const totalUnidades = items.reduce((s, i) => s + i.unidades, 0);
  const totalValor = items.reduce((s, i) => s + i.subtotal, 0);

  return (
    <div
      style={{
        background: "#edf7f1",
        border: "1px solid #b8ddc8",
        borderRadius: 10,
        padding: "16px 20px",
        marginTop: 4,
      }}>
      {/* Detalle por línea */}
      <div style={{ marginBottom: 12 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
              fontSize: 13,
              color: "#1a5c38",
            }}>
            <span>
              {item.tamano} × {item.unidades} und
            </span>
            <span style={{ fontWeight: 600 }}>{fmt(item.subtotal)}</span>
          </div>
        ))}
      </div>

      {/* Divisor */}
      <div style={{ borderTop: "1px solid #b8ddc8", paddingTop: 12 }} />

      {/* Totales */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 8,
        }}>
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#7a9e88",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}>
            Total unidades
          </div>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 24,
              color: "#1a5c38",
            }}>
            {totalUnidades}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 11,
              color: "#7a9e88",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}>
            Total a registrar
          </div>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 24,
              color: "#2d6a4f",
            }}>
            {fmt(totalValor)}
          </div>
        </div>
      </div>
    </div>
  );
}

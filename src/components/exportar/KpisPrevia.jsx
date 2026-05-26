const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(v);

export default function KpisPrevia({ preview }) {
  const items = [
    { label: "Ingresos", value: fmt(preview.ingresos), color: "#2d6a4f" },
    { label: "Egresos", value: fmt(preview.totalEg), color: "#c0392b" },
    {
      label: "Utilidad",
      value: fmt(preview.utilidad),
      color: preview.utilidad >= 0 ? "#b5621e" : "#c0392b",
    },
    { label: "Unidades vendidas", value: preview.unidades, color: "#2563a8" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
        marginBottom: 20,
      }}>
      {items.map((k) => (
        <div
          key={k.label}
          style={{
            background: "var(--bg3)",
            borderRadius: 8,
            padding: "12px 14px",
            textAlign: "center",
          }}>
          <div
            style={{
              fontSize: 10,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}>
            {k.label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 16,
              color: k.color,
            }}>
            {k.value}
          </div>
        </div>
      ))}
    </div>
  );
}

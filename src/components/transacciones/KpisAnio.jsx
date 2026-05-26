const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(v);

export default function KpisAnio({ kpis, anio }) {
  const items = [
    { label: `Ingresos ${anio}`, value: fmt(kpis.ingresos), color: "#2d6a4f" },
    { label: `Egresos ${anio}`, value: fmt(kpis.egresos), color: "#c0392b" },
    {
      label: "Utilidad",
      value: fmt(kpis.utilidad),
      color: kpis.utilidad >= 0 ? "#b5621e" : "#c0392b",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        marginTop: 16,
        paddingTop: 16,
        borderTop: "1px solid var(--border)",
      }}>
      {items.map((k) => (
        <div key={k.label} style={{ textAlign: "center", padding: "8px 0" }}>
          <div
            style={{
              fontSize: 11,
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
              fontSize: 18,
              color: k.color,
            }}>
            {k.value}
          </div>
        </div>
      ))}
    </div>
  );
}

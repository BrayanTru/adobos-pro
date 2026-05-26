export default function ConteoPrevia({ preview }) {
  const items = [
    `📋 ${preview.totalTx} transacciones`,
    `↑ ${preview.numVentas} ventas`,
    `↓ ${preview.numEgresos} egresos`,
    `👥 ${preview.clientesUnicos} clientes`,
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 20,
        fontSize: 13,
        color: "var(--muted)",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: i < items.length - 1 ? 0 : 0,
          }}>
          {item}
          {i < items.length - 1 && (
            <span style={{ marginLeft: 12, color: "var(--border)" }}>·</span>
          )}
        </span>
      ))}
    </div>
  );
}

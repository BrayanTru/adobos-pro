export default function GraficaUnidades({ mesesData }) {
  const maxUnd = Math.max(...mesesData.map((m) => m.und), 1);

  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
      {mesesData.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            height: "100%",
          }}>
          <div
            style={{
              flex: 1,
              width: "100%",
              background: "var(--bg3)",
              borderRadius: 4,
              position: "relative",
            }}>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: (d.und / maxUnd) * 100 + "%",
                background: "#2563a8",
                borderRadius: 4,
                transition: "height 0.4s ease",
              }}
              title={`${d.und} unidades`}
            />
          </div>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>{d.mes}</div>
          {d.und > 0 && (
            <div style={{ fontSize: 10, fontWeight: 600, color: "#2563a8" }}>
              {d.und}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

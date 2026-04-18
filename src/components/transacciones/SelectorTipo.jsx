export default function SelectorTipo({ tipo, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      {["ingreso", "egreso"].map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: 8,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 500,
            transition: "all 0.15s",
            background:
              tipo === t
                ? t === "ingreso"
                  ? "#e8f5ee"
                  : "#fcecea"
                : "var(--bg3)",
            color:
              tipo === t
                ? t === "ingreso"
                  ? "#1a5c38"
                  : "#9b2315"
                : "var(--muted)",
            border: `1.5px solid ${tipo === t ? (t === "ingreso" ? "#b8ddc8" : "#f5c6c3") : "var(--border)"}`,
          }}>
          {t === "ingreso" ? "↑ Ingreso" : "↓ Egreso"}
        </button>
      ))}
    </div>
  );
}

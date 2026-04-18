import { fmt } from "../../utils/format";

const ICONOS = {
  Personal: "🧂",
  Familiar: "🫙",
  Grande: "🪣",
  Institucional: "🏭",
};

export default function VentasPorTamano({ porTamano }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 12,
      }}>
      {porTamano.map((p) => (
        <div
          key={p.tamano}
          style={{
            background: "var(--bg3)",
            borderRadius: 10,
            padding: "14px 16px",
            textAlign: "center",
          }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>
            {ICONOS[p.tamano]}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
            {p.tamano}
          </div>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 24,
              color: "#2d6a4f",
            }}>
            {p.cantidad}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>
            unidades
          </div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{fmt(p.valor)}</div>
        </div>
      ))}
    </div>
  );
}

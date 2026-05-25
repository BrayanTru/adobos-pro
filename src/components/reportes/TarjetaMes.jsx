import { fmt } from "../../utils/format";

export default function TarjetaMes({ d, activo, tieneData, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card card-sm"
      style={{
        borderLeft: `3px solid ${d.util >= 0 ? "#2d6a4f" : "#c0392b"}`,
        cursor: tieneData ? "pointer" : "default",
        transition: "all 0.15s",
        background: activo ? (d.util >= 0 ? "#edf7f1" : "#fcecea") : "#fff",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        if (tieneData)
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}>
        <span style={{ fontFamily: "var(--font-head)", fontWeight: 700 }}>
          {d.mes}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {d.und > 0 && <span className="badge badge-blue">{d.und} und</span>}
          {tieneData && (
            <span style={{ fontSize: 10, color: "var(--muted)" }}>
              {activo ? "▲" : "▼"}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 800,
          fontSize: 17,
          color: d.util >= 0 ? "#2d6a4f" : "#c0392b",
        }}>
        {fmt(d.util)}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 6,
          fontSize: 11,
          color: "var(--muted)",
        }}>
        <span>↑ {fmt(d.ing)}</span>
        <span>↓ {fmt(d.eg)}</span>
      </div>
    </div>
  );
}

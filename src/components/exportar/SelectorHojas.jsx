import { HOJAS_DISPONIBLES } from "../../constants/exportar";

export default function SelectorHojas({ hojasActivas, onToggle }) {
  const toggleTodas = () =>
    HOJAS_DISPONIBLES.forEach(
      (h) => !hojasActivas.includes(h.id) && onToggle(h.id),
    );
  const toggleNinguna = () =>
    HOJAS_DISPONIBLES.forEach(
      (h) => hojasActivas.includes(h.id) && onToggle(h.id),
    );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}>
        <div
          style={{
            fontSize: 12,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: 1,
            fontWeight: 600,
          }}>
          Hojas a incluir ({hojasActivas.length} de {HOJAS_DISPONIBLES.length})
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={toggleTodas}
            style={{
              fontSize: 11,
              color: "#2d6a4f",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}>
            Todas
          </button>
          <span style={{ color: "var(--border)" }}>·</span>
          <button
            onClick={toggleNinguna}
            style={{
              fontSize: 11,
              color: "var(--muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}>
            Ninguna
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {HOJAS_DISPONIBLES.map((h, i) => {
          const activa = hojasActivas.includes(h.id);
          return (
            <div
              key={h.id}
              onClick={() => onToggle(h.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                background: activa ? "#edf7f1" : "var(--bg3)",
                border: `1px solid ${activa ? "#b8ddc8" : "var(--border)"}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.15s",
                userSelect: "none",
                opacity: activa ? 1 : 0.5,
              }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  flexShrink: 0,
                  border: `2px solid ${activa ? "#2d6a4f" : "var(--border)"}`,
                  background: activa ? "#2d6a4f" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                {activa && (
                  <span style={{ color: "#fff", fontSize: 11, lineHeight: 1 }}>
                    ✓
                  </span>
                )}
              </div>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{h.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: activa ? 500 : 400 }}>
                  {h.nombre}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  {h.desc}
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: activa ? "#2d6a4f" : "var(--muted)",
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                {activa ? `Hoja ${hojasActivas.indexOf(h.id) + 1}` : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

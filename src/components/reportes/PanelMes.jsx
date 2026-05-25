import { fmt } from "../../utils/format";

const ICONOS = {
  Personal: "🧂",
  Familiar: "🫙",
  Grande: "🪣",
  Institucional: "🏭",
};
const ORDEN = ["Personal", "Familiar", "Grande", "Institucional"];

function AdobosPorTamano({ d }) {
  const totalUnd = d.porTamanoMes.reduce((s, t) => s + t.cantidad, 0);
  const maxCantidad = Math.max(...d.porTamanoMes.map((t) => t.cantidad), 1);

  if (totalUnd === 0)
    return (
      <p style={{ fontSize: 13, color: "var(--muted)" }}>Sin ventas este mes</p>
    );

  return (
    <>
      {ORDEN.map((tamano) => {
        const item = d.porTamanoMes.find((t) => t.tamano === tamano);
        const pct = Math.round(((item?.cantidad || 0) / maxCantidad) * 100);
        return (
          <div key={tamano} style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}>
              <span
                style={{
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                {ICONOS[tamano]} {tamano}
              </span>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#2d6a4f",
                  }}>
                  {item?.cantidad || 0} und
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    marginLeft: 8,
                  }}>
                  {fmt(item?.valor || 0)}
                </span>
              </div>
            </div>
            <div
              style={{
                background: "var(--border)",
                borderRadius: 4,
                height: 5,
              }}>
              <div
                style={{
                  width: pct + "%",
                  height: "100%",
                  background: "#2d6a4f",
                  borderRadius: 4,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
        }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Total</span>
        <div>
          <span
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 16,
              color: "#2d6a4f",
            }}>
            {totalUnd} unidades
          </span>
          <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>
            {fmt(d.ing)}
          </span>
        </div>
      </div>
    </>
  );
}

function EgresosMes({ d }) {
  const entradas = Object.entries(d.egresosMes).sort((a, b) => b[1] - a[1]);

  return (
    <>
      {entradas.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--muted)" }}>
          Sin egresos este mes
        </p>
      ) : (
        entradas.map(([cat, val]) => (
          <div
            key={cat}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              padding: "8px 12px",
              background: "#fff",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}>
            <span style={{ fontSize: 13 }}>{cat}</span>
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                color: "#c0392b",
                fontSize: 13,
              }}>
              {fmt(val)}
            </span>
          </div>
        ))
      )}
      <div
        style={{
          marginTop: 8,
          paddingTop: 12,
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
        }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Total egresos</span>
        <span
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 800,
            fontSize: 16,
            color: "#c0392b",
          }}>
          {fmt(d.eg)}
        </span>
      </div>
      <div
        style={{
          marginTop: 12,
          padding: "12px 14px",
          background: d.util >= 0 ? "#edf7f1" : "#fcecea",
          border: `1px solid ${d.util >= 0 ? "#b8ddc8" : "#f5c6c3"}`,
          borderRadius: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: d.util >= 0 ? "#1a5c38" : "#9b2315",
          }}>
          Utilidad neta
        </span>
        <span
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 800,
            fontSize: 18,
            color: d.util >= 0 ? "#2d6a4f" : "#c0392b",
          }}>
          {fmt(d.util)}
        </span>
      </div>
    </>
  );
}

export default function PanelMes({ d }) {
  return (
    <div
      style={{
        background: "#f9f8f5",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "20px 24px",
        animation: "panelIn 0.2s ease",
      }}>
      <style>{`@keyframes panelIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 14,
              fontWeight: 600,
            }}>
            🧂 Adobos vendidos — {d.mes}
          </div>
          <AdobosPorTamano d={d} />
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 14,
              fontWeight: 600,
            }}>
            📉 Egresos — {d.mes}
          </div>
          <EgresosMes d={d} />
        </div>
      </div>
    </div>
  );
}

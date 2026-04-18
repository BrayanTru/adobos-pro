import { fmt } from "../../utils/format";

const ORDEN = ["Personal", "Familiar", "Grande", "Institucional"];
const ICONOS = {
  Personal: "🧂",
  Familiar: "🫙",
  Grande: "🪣",
  Institucional: "🏭",
};
const GRAMOS = {
  Personal: "80g",
  Familiar: "240g",
  Grande: "500g",
  Institucional: "1000g",
};

export default function TarjetasUnidades({ porTamano, totalUnidades }) {
  const maxUnidades = Math.max(
    ...ORDEN.map((t) => porTamano[t]?.cantidad || 0),
    1,
  );

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}>
        {ORDEN.map((tamano) => {
          const data = porTamano[tamano] || { cantidad: 0, valor: 0 };
          const pct = Math.round((data.cantidad / maxUnidades) * 100);
          return (
            <div
              key={tamano}
              style={{
                background: "var(--bg3)",
                borderRadius: 10,
                padding: "16px 18px",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}>
                <span style={{ fontSize: 20 }}>{ICONOS[tamano]}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{tamano}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {GRAMOS[tamano]}
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "#ddd9d0",
                  borderRadius: 4,
                  height: 6,
                  marginBottom: 10,
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 800,
                      fontSize: 22,
                      color: "#2d6a4f",
                      lineHeight: 1,
                    }}>
                    {data.cantidad}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      marginTop: 2,
                    }}>
                    unidades
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 13,
                    }}>
                    {fmt(data.valor)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    en ventas
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>
          Total acumulado
        </span>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 20,
              color: "#2d6a4f",
            }}>
            {totalUnidades}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            unidades totales
          </div>
        </div>
      </div>
    </>
  );
}

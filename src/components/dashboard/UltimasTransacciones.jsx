import { fmt, fmtDate } from "../../utils/format";

export default function UltimasTransacciones({ transacciones, getCliente }) {
  if (transacciones.length === 0) {
    return <div className="empty-state">Sin transacciones aún</div>;
  }

  return (
    <>
      {transacciones.map((t) => {
        const c = getCliente(t.cliente_id);
        const esIngreso = t.tipo_movimiento === "ingreso";
        const items = t.transaccion_items || [];
        return (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: esIngreso ? "#e8f5ee" : "#fcecea",
                fontSize: 16,
              }}>
              {esIngreso ? "↑" : "↓"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                {esIngreso && items.length > 0
                  ? items.map((i) => `${i.tamano}×${i.cantidad}`).join(", ")
                  : t.descripcion || t.categoria}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                {c ? c.nombre : "Sin cliente"} · {fmtDate(t.fecha)}
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                color: esIngreso ? "#2d6a4f" : "#c0392b",
                flexShrink: 0,
              }}>
              {esIngreso ? "+" : "-"}
              {fmt(t.valor)}
            </div>
          </div>
        );
      })}
    </>
  );
}

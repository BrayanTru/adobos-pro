import Badge from "../ui/Badge";
import { fmt, fmtDate } from "../../utils/format";

export default function FilaTransaccion({
  t,
  cliente,
  isOpen,
  tieneItems,
  onToggle,
  onDelete,
}) {
  const esIngreso = t.tipo_movimiento === "ingreso";
  const items = t.transaccion_items || [];

  return (
    <tr style={{ borderBottom: isOpen ? "none" : "1px solid var(--bg3)" }}>
      <td>
        {tieneItems && (
          <button
            onClick={onToggle}
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              border: "1px solid var(--border)",
              background: "var(--bg3)",
              cursor: "pointer",
              fontSize: 10,
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {isOpen ? "▲" : "▼"}
          </button>
        )}
      </td>
      <td style={{ color: "var(--muted)", whiteSpace: "nowrap", fontSize: 12 }}>
        {fmtDate(t.fecha)}
      </td>
      <td>
        <Badge variant={esIngreso ? "green" : "red"}>
          {esIngreso ? "↑ Ingreso" : "↓ Egreso"}
        </Badge>
      </td>
      <td>
        {esIngreso && tieneItems ? (
          <span style={{ fontSize: 13 }}>
            {items.length} producto{items.length !== 1 ? "s" : ""} ·{" "}
            <span style={{ color: "var(--muted)", fontSize: 12 }}>
              {items.map((i) => `${i.tamano}×${i.cantidad}`).join(", ")}
            </span>
          </span>
        ) : (
          <span style={{ fontSize: 13 }}>
            {t.descripcion || t.categoria || "—"}
          </span>
        )}
      </td>
      <td style={{ fontSize: 12 }}>
        {cliente ? (
          cliente.nombre
        ) : (
          <span style={{ color: "var(--muted)" }}>—</span>
        )}
      </td>
      <td>
        <Badge variant={t.forma_pago === "efectivo" ? "yellow" : "blue"}>
          {t.forma_pago}
        </Badge>
      </td>
      <td
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 700,
          color: esIngreso ? "#2d6a4f" : "#c0392b",
        }}>
        {esIngreso ? "+" : "-"}
        {fmt(t.valor)}
      </td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          ✕
        </button>
      </td>
    </tr>
  );
}

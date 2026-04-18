import { fmt } from "../../utils/format";

const ICONOS = {
  Personal: "🧂",
  Familiar: "🫙",
  Grande: "🪣",
  Institucional: "🏭",
};

export default function FilaDetalle({ items }) {
  return (
    <tr>
      <td
        colSpan={8}
        style={{ padding: "0 14px 12px 48px", background: "#f9f8f5" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 12px",
                background: "#fff",
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}>
              <span style={{ fontSize: 16 }}>
                {ICONOS[item.tamano] || "📦"}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>
                {item.tamano} ({item.gramos}g)
              </span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                {item.cantidad} und × {fmt(item.precio_unitario)}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#2d6a4f",
                }}>
                {fmt(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}

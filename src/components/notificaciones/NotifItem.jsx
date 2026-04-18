import { initials, fmtDate } from "../../utils/format";

const CONFIG = {
  urgent: { cardClass: "urgent", avatarClass: "urgent", daysClass: "urgent" },
  warning: {
    cardClass: "warning",
    avatarClass: "warning",
    daysClass: "warning",
  },
  ok: { cardClass: "", avatarClass: "ok", daysClass: "ok" },
};

export default function NotifItem({ item, onEliminar }) {
  const tipo =
    item.restantes <= 0 ? "urgent" : item.restantes <= 5 ? "warning" : "ok";
  const cfg = CONFIG[tipo];

  const daysLabel =
    item.restantes <= 0
      ? `Vencido hace ${Math.abs(item.restantes)}d`
      : `Faltan ${item.restantes} día${item.restantes !== 1 ? "s" : ""}`;

  return (
    <div className={`notif-card ${cfg.cardClass}`}>
      <div className={`notif-avatar ${cfg.avatarClass}`}>
        {initials(item.cliente?.nombre || "?")}
      </div>
      <div style={{ flex: 1 }}>
        <div className="notif-name">
          {item.cliente?.nombre || "Cliente eliminado"}
        </div>
        <div className="notif-detail">
          {item.cliente
            ? `${item.cliente.municipio}, ${item.cliente.departamento} · `
            : ""}
          Última venta: {fmtDate(item.fecha_ultima_venta)}
        </div>
      </div>
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
        }}>
        <div className={`notif-days ${cfg.daysClass}`}>
          {item.restantes <= 0 ? "¡Ya!" : `${item.restantes}d`}
        </div>
        <div className="notif-days-label">{daysLabel}</div>
        <button
          onClick={() => onEliminar(item.cliente_id)}
          title="Quitar recordatorio"
          style={{
            marginTop: 4,
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "3px 8px",
            fontSize: 11,
            color: "var(--muted)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#c0392b";
            e.currentTarget.style.color = "#c0392b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--muted)";
          }}>
          ✕ Quitar recordatorio
        </button>
      </div>
    </div>
  );
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Eliminar",
  onConfirm,
  onCancel,
  danger = true,
}) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal modal-sm">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              margin: "0 auto 16px",
              background: danger ? "#fcecea" : "#e8f0fb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}>
            {danger ? "🗑" : "❓"}
          </div>
          <h2 className="modal-title" style={{ textAlign: "center" }}>
            {title}
          </h2>
          {message && (
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                marginTop: 8,
                lineHeight: 1.5,
              }}>
              {message}
            </p>
          )}
        </div>

        <div className="modal-actions" style={{ justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
            style={
              danger
                ? { background: "#c0392b", color: "#fff", border: "none" }
                : {}
            }
            onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";

const ICONS = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };

const STYLES = {
  success: {
    bg: "#e8f5ee",
    border: "#b8ddc8",
    color: "#1a5c38",
    dot: "#2d6a4f",
  },
  error: { bg: "#fcecea", border: "#f5c6c3", color: "#9b2315", dot: "#c0392b" },
  warning: {
    bg: "#fdf0e6",
    border: "#f5dfc0",
    color: "#8a4710",
    dot: "#b5621e",
  },
  info: { bg: "#e8f0fb", border: "#b8cef0", color: "#1a4b8c", dot: "#2563a8" },
};

function ToastItem({ toast, onRemove }) {
  const s = STYLES[toast.type] || STYLES.info;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast.id]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 10,
        padding: "14px 16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        minWidth: 280,
        maxWidth: 380,
        animation: "toastIn 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}>
      {/* barra de progreso */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          background: s.dot,
          borderRadius: "0 0 0 10px",
          animation: `toastProgress ${toast.duration || 3500}ms linear forwards`,
        }}
      />

      {/* ícono */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: s.dot,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}>
        {ICONS[toast.type]}
      </div>

      {/* texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 13,
              fontWeight: 700,
              color: s.color,
              marginBottom: toast.message ? 2 : 0,
            }}>
            {toast.title}
          </div>
        )}
        {toast.message && (
          <div
            style={{
              fontSize: 13,
              color: s.color,
              opacity: 0.85,
              lineHeight: 1.4,
            }}>
            {toast.message}
          </div>
        )}
      </div>

      {/* cerrar */}
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: s.color,
          opacity: 0.5,
          fontSize: 16,
          lineHeight: 1,
          padding: "0 0 0 4px",
          flexShrink: 0,
        }}>
        ✕
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(24px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 999,
          pointerEvents: "none",
        }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem toast={t} onRemove={onRemove} />
          </div>
        ))}
      </div>
    </>
  );
}

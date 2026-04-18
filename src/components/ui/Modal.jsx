export default function Modal({
  title,
  subtitle,
  onClose,
  children,
  size = "md",
}) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${size === "sm" ? "modal-sm" : ""}`}>
        <h2 className="modal-title">{title}</h2>
        {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

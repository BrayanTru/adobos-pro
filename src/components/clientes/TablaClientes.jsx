import { fmtDate, initials } from "../../utils/format";
import { clientesService } from "../../services/clientesService";

export default function TablaClientes({
  clientes,
  recordatorios,
  getLastSale,
  onEdit,
  onDelete,
  onRecordatorio,
}) {
  const getRec = (id) => recordatorios.find((r) => r.cliente_id === id);

  if (clientes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">◎</div>Sin clientes registrados
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {[
              "Cliente",
              "Departamento",
              "Municipio",
              "Dirección",
              "Última venta",
              "Recordatorio",
              "Mapa",
              "",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => {
            const lastSale = getLastSale(c.id);
            const rec = getRec(c.id);
            return (
              <tr key={c.id}>
                <td>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "#e8f5ee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 12,
                        color: "#1a5c38",
                        flexShrink: 0,
                      }}>
                      {initials(c.nombre)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{c.nombre}</span>
                  </div>
                </td>
                <td style={{ color: "var(--muted)" }}>{c.departamento}</td>
                <td>{c.municipio}</td>
                <td
                  style={{
                    maxWidth: 160,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                  {c.direccion || "—"}
                </td>
                <td style={{ color: "var(--muted)" }}>
                  {lastSale ? (
                    fmtDate(lastSale)
                  ) : (
                    <span style={{ color: "var(--border)" }}>Sin ventas</span>
                  )}
                </td>
                <td>
                  {rec ? (
                    <span className="badge badge-gray">
                      c/{rec.dias_recordatorio}d
                    </span>
                  ) : (
                    <span style={{ color: "var(--border)" }}>—</span>
                  )}
                </td>
                <td>
                  <a
                    href={clientesService.getMapsUrl(c)}
                    target="_blank"
                    rel="noreferrer"
                    className="maps-link">
                    📍 Maps
                  </a>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-icon btn-sm"
                      onClick={() => onRecordatorio(c)}
                      title="Recordatorio">
                      🔔
                    </button>
                    <button
                      className="btn btn-icon btn-sm"
                      onClick={() => onEdit(c)}>
                      ✎
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(c.id)}>
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

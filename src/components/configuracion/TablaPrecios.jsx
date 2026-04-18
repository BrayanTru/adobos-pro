import { useState } from "react";
import { usePrecios } from "../../hooks/usePrecios";

const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(v);

export default function TablaPrecios() {
  const { precios, actualizar } = usePrecios();
  const [editando, setEditando] = useState(null); // { id, valor }
  const [saving, setSaving] = useState(false);

  const handleEdit = (p) => setEditando({ id: p.id, valor: p.precio });

  const handleSave = async () => {
    if (!editando || Number(editando.valor) <= 0) return;
    setSaving(true);
    await actualizar(editando.id, Number(editando.valor));
    setSaving(false);
    setEditando(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditando(null);
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tamaño</th>
            <th>Gramaje</th>
            <th>Precio actual</th>
            <th>Última actualización</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {precios.map((p) => {
            const isEditing = editando?.id === p.id;
            return (
              <tr key={p.id}>
                <td>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: "#edf7f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                      }}>
                      {p.tamano === "Personal"
                        ? "🧂"
                        : p.tamano === "Familiar"
                          ? "🫙"
                          : p.tamano === "Grande"
                            ? "🪣"
                            : "🏭"}
                    </div>
                    <span style={{ fontWeight: 500 }}>{p.tamano}</span>
                  </div>
                </td>
                <td>
                  <span className="badge badge-gray">{p.gramos}g</span>
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: 140 }}
                      value={editando.valor}
                      autoFocus
                      onChange={(e) =>
                        setEditando((prev) => ({
                          ...prev,
                          valor: e.target.value,
                        }))
                      }
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#2d6a4f",
                      }}>
                      {fmt(p.precio)}
                    </span>
                  )}
                </td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>
                  {new Date(p.updated_at).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  {isEditing ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSave}
                        disabled={saving}>
                        {saving ? "..." : "✓"}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setEditando(null)}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-icon btn-sm"
                      onClick={() => handleEdit(p)}>
                      ✎ Editar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

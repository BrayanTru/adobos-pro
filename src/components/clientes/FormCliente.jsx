import { useState } from "react";
import Modal from "../ui/Modal";
import { DEPARTAMENTOS } from "../../constants/ubicaciones";

export default function FormCliente({ onSave, onClose, initial = null }) {
  const [form, setForm] = useState(
    initial || {
      nombre: "",
      departamento: "Huila",
      municipio: "",
      direccion: "",
    },
  );
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <Modal
      title={initial ? "Editar Cliente" : "Nuevo Cliente"}
      subtitle="Registra la información y ubicación del cliente"
      onClose={onClose}
      size="sm">
      <div className="form-grid">
        <div className="form-group form-full">
          <label className="form-label">Nombre / Razón social</label>
          <input
            className="form-input"
            placeholder="Ej: Restaurante El Fogón"
            value={form.nombre}
            onChange={(e) => set("nombre", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Departamento</label>
          <select
            className="form-select"
            value={form.departamento}
            onChange={(e) => set("departamento", e.target.value)}>
            {DEPARTAMENTOS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Municipio</label>
          <input
            className="form-input"
            placeholder="Ej: Neiva"
            value={form.municipio}
            onChange={(e) => set("municipio", e.target.value)}
          />
        </div>

        <div className="form-group form-full">
          <label className="form-label">Dirección exacta</label>
          <input
            className="form-input"
            placeholder="Ej: Cra 5 #12-34, barrio centro"
            value={form.direccion}
            onChange={(e) => set("direccion", e.target.value)}
          />
        </div>
      </div>

      <div className="form-hint">
        📍 La dirección se usará para generar un enlace directo a Google Maps
      </div>

      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={saving}>
          {saving ? "Guardando..." : "✓ Guardar"}
        </button>
      </div>
    </Modal>
  );
}

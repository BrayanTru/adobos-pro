import { CATEGORIAS } from "../../constants/categorias";

export default function FormEgreso({ form, onChange, clientes }) {
  const set = (k, v) => onChange({ ...form, [k]: v });

  return (
    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">Fecha</label>
        <input
          type="date"
          className="form-input"
          value={form.fecha}
          onChange={(e) => set("fecha", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Forma de pago</label>
        <select
          className="form-select"
          value={form.forma_pago}
          onChange={(e) => set("forma_pago", e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          value={form.categoria}
          onChange={(e) => set("categoria", e.target.value)}>
          {CATEGORIAS.egreso.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Valor (COP)</label>
        <input
          type="number"
          className="form-input"
          placeholder="0"
          min="0"
          value={form.valor}
          onChange={(e) => set("valor", e.target.value)}
        />
      </div>

      <div className="form-group form-full">
        <label className="form-label">Cliente (opcional)</label>
        <select
          className="form-select"
          value={form.cliente_id}
          onChange={(e) => set("cliente_id", e.target.value)}>
          <option value="">— Sin cliente —</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group form-full">
        <label className="form-label">Descripción (opcional)</label>
        <textarea
          className="form-textarea"
          placeholder="Notas adicionales..."
          value={form.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
        />
      </div>
    </div>
  );
}

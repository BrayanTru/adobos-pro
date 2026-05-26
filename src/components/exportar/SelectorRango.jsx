import { MESES_COMPLETOS } from "../../constants/meses";

export default function SelectorRango({ anios, rango, onChange }) {
  const { anio, mesInicio, mesFin } = rango;

  const setAnio = (v) =>
    onChange({ ...rango, anio: Number(v), mesInicio: 0, mesFin: 11 });
  const setMesInicio = (v) =>
    onChange({
      ...rango,
      mesInicio: Number(v),
      mesFin: Math.max(Number(v), mesFin),
    });
  const setMesFin = (v) =>
    onChange({
      ...rango,
      mesFin: Number(v),
      mesInicio: Math.min(mesInicio, Number(v)),
    });
  const setTodoElAnio = () => onChange({ ...rango, mesInicio: 0, mesFin: 11 });
  const setMesActual = () => {
    const m = new Date().getMonth();
    onChange({ ...rango, mesInicio: m, mesFin: m });
  };

  const selectStyle = { width: "100%" };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={setMesActual}>
          Este mes
        </button>
        <button className="btn btn-ghost btn-sm" onClick={setTodoElAnio}>
          Todo el año
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
        }}>
        <div className="form-group">
          <label className="form-label">Año</label>
          <select
            className="form-select"
            style={selectStyle}
            value={anio}
            onChange={(e) => setAnio(e.target.value)}>
            {anios.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Mes inicio</label>
          <select
            className="form-select"
            style={selectStyle}
            value={mesInicio}
            onChange={(e) => setMesInicio(e.target.value)}>
            {MESES_COMPLETOS.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Mes fin</label>
          <select
            className="form-select"
            style={selectStyle}
            value={mesFin}
            onChange={(e) => setMesFin(e.target.value)}>
            {MESES_COMPLETOS.map((m, i) => (
              <option key={i} value={i} disabled={i < mesInicio}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

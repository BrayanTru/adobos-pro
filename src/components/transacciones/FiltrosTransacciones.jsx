export default function FiltrosTransacciones({
  anios,
  anio,
  setAnio,
  search,
  setSearch,
  filtro,
  setFiltro,
  total,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}>
      <select
        className="form-select"
        style={{ width: "auto" }}
        value={anio}
        onChange={(e) => setAnio(Number(e.target.value))}>
        {anios.length ? (
          anios.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))
        ) : (
          <option value={anio}>{anio}</option>
        )}
      </select>

      <input
        className="form-input"
        style={{ maxWidth: 280 }}
        placeholder="Buscar cliente, descripción, categoría..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-tabs">
        {[
          ["todos", "Todos"],
          ["ingreso", "↑ Ingresos"],
          ["egreso", "↓ Egresos"],
        ].map(([val, label]) => (
          <button
            key={val}
            className={`filter-tab ${filtro === val ? "active" : ""}`}
            onClick={() => setFiltro(val)}>
            {label}
          </button>
        ))}
      </div>

      <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: "auto" }}>
        {total} transacción{total !== 1 ? "es" : ""}
      </span>
    </div>
  );
}

import { fmt } from "../../utils/format";

export default function EgresosPorCategoria({ catEg }) {
  const entradas = Object.entries(catEg).sort((a, b) => b[1] - a[1]);

  if (entradas.length === 0) {
    return <p style={{ color: "var(--muted)", fontSize: 13 }}>Sin datos</p>;
  }

  return (
    <>
      {entradas.map(([cat, val]) => (
        <div
          key={cat}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}>
          <span style={{ fontSize: 13 }}>{cat}</span>
          <span
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              color: "#c0392b",
              fontSize: 14,
            }}>
            {fmt(val)}
          </span>
        </div>
      ))}
    </>
  );
}

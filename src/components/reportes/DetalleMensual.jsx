import { fmt } from "../../utils/format";

export default function DetalleMensual({ mesesData }) {
  return (
    <div className="three-col mb-6">
      {mesesData.map((d, i) => (
        <div
          key={i}
          className="card card-sm"
          style={{
            borderLeft: `3px solid ${d.util >= 0 ? "#2d6a4f" : "#c0392b"}`,
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 700 }}>
              {d.mes}
            </span>
            <span className="badge badge-blue">{d.und} und</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: 17,
              color: d.util >= 0 ? "#2d6a4f" : "#c0392b",
            }}>
            {fmt(d.util)}
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 6,
              fontSize: 11,
              color: "var(--muted)",
            }}>
            <span>↑ {fmt(d.ing)}</span>
            <span>↓ {fmt(d.eg)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

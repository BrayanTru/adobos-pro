import { fmt } from "../../utils/format";

export default function BarChart({ data, height = 120 }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.ing, d.eg]), 1);

  return (
    <>
      <div className="chart-wrap" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="chart-col">
            <div className="chart-bars">
              <div className="chart-track">
                <div
                  className="chart-fill income"
                  style={{ height: (d.ing / maxVal) * 100 + "%" }}
                  title={fmt(d.ing)}
                />
              </div>
              <div className="chart-track">
                <div
                  className="chart-fill expense"
                  style={{ height: (d.eg / maxVal) * 100 + "%" }}
                  title={fmt(d.eg)}
                />
              </div>
            </div>
            <div className="chart-label">{d.label}</div>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <span
          style={{
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
          <span
            className="chart-legend-dot"
            style={{ background: "#2d6a4f" }}
          />{" "}
          Ingresos
        </span>
        <span
          style={{
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
          <span
            className="chart-legend-dot"
            style={{ background: "#c0392b" }}
          />{" "}
          Egresos
        </span>
      </div>
    </>
  );
}

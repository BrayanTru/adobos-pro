import { useState } from "react";
import TarjetaMes from "./TarjetaMes";
import PanelMes from "./PanelMes";

const COLS = 3;

export default function DetalleMensual({ mesesData }) {
  const [mesActivo, setMesActivo] = useState(null);

  const rows = Array.from(
    { length: Math.ceil(mesesData.length / COLS) },
    (_, i) => mesesData.slice(i * COLS, i * COLS + COLS),
  );
  const filaActiva = mesActivo !== null ? Math.floor(mesActivo / COLS) : null;

  const handleClick = (idx, tieneData) => {
    if (tieneData) setMesActivo((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="mb-6">
      {rows.map((fila, rowIdx) => (
        <div key={rowIdx}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 12,
            }}>
            {fila.map((d, colIdx) => {
              const idx = rowIdx * COLS + colIdx;
              const tieneData = d.und > 0 || d.eg > 0;
              return (
                <TarjetaMes
                  key={d.mes}
                  d={d}
                  activo={mesActivo === idx}
                  tieneData={tieneData}
                  onClick={() => handleClick(idx, tieneData)}
                />
              );
            })}
          </div>

          {filaActiva === rowIdx && mesActivo !== null && (
            <div style={{ marginBottom: 12 }}>
              <PanelMes d={mesesData[mesActivo]} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

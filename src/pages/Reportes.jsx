import { useState } from "react";
import { useReportes } from "../hooks/useReportes";
import KPICard from "../components/ui/KPICard";
import BarChart from "../components/ui/BarChart";
import GraficaUnidades from "../components/reportes/GraficaUnidades";
import VentasPorTamano from "../components/reportes/VentasPorTamano";
import DetalleMensual from "../components/reportes/DetalleMensual";
import EgresosPorCategoria from "../components/reportes/EgresosPorCategoria";
import { fmt } from "../utils/format";

export default function Reportes() {
  const { anios } = useReportes(new Date().getFullYear());
  const [anio, setAnio] = useState(anios[0] || new Date().getFullYear());
  const {
    mesesData,
    totalIng,
    totalEg,
    totalUtil,
    totalUnd,
    porTamano,
    catEg,
  } = useReportes(anio);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes Financieros</h1>
          <p className="page-subtitle">Análisis anual y mensual del negocio</p>
        </div>
        <select
          className="form-select ml-auto"
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
      </div>

      <div className="kpi-grid mb-6">
        <KPICard
          label={`Ingresos ${anio}`}
          value={fmt(totalIng)}
          color="green"
        />
        <KPICard label={`Egresos ${anio}`} value={fmt(totalEg)} color="red" />
        <KPICard
          label="Utilidad anual"
          value={fmt(totalUtil)}
          sub={totalUtil >= 0 ? "Rentable" : "Pérdida"}
          color={totalUtil >= 0 ? "yellow" : "red"}
        />
        <KPICard
          label="Unidades vendidas"
          value={totalUnd}
          sub={`en ${anio}`}
          color="blue"
        />
      </div>

      <div className="card mb-6">
        <h2 className="section-title">Ingresos vs Egresos por mes — {anio}</h2>
        <BarChart data={mesesData} height={160} />
      </div>

      <div className="card mb-6">
        <h2 className="section-title">Unidades vendidas por mes — {anio}</h2>
        <GraficaUnidades mesesData={mesesData} />
      </div>

      <div className="card mb-6">
        <h2 className="section-title">Ventas por tamaño de adobo — {anio}</h2>
        <VentasPorTamano porTamano={porTamano} />
      </div>

      <DetalleMensual mesesData={mesesData} />

      <div className="card">
        <h2 className="section-title">Egresos por categoría</h2>
        <EgresosPorCategoria catEg={catEg} />
      </div>
    </div>
  );
}

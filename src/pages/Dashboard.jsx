import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import KPICard from "../components/ui/KPICard";
import BarChart from "../components/ui/BarChart";
import UltimasTransacciones from "../components/dashboard/UltimasTransacciones";
import TarjetasUnidades from "../components/dashboard/TarjetasUnidades";
import { fmt } from "../utils/format";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    clientes,
    transacciones,
    kpis,
    metricas,
    mesLabel,
    alertas,
    recientes,
    chartData,
    getCliente,
  } = useDashboard();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen del mes · {mesLabel}</p>
        </div>
        {alertas > 0 && (
          <button
            className="alert-banner ml-auto"
            onClick={() => navigate("/notificaciones")}>
            🔔 {alertas} alerta{alertas !== 1 ? "s" : ""} pendiente
            {alertas !== 1 ? "s" : ""}
          </button>
        )}
      </div>

      <div className="kpi-grid mb-6">
        <KPICard
          label="Ingresos del mes"
          value={fmt(kpis.ingresos)}
          sub={`${transacciones.filter((t) => t.tipo_movimiento === "ingreso").length} ventas`}
          color="green"
        />
        <KPICard
          label="Egresos del mes"
          value={fmt(kpis.egresos)}
          sub={`${transacciones.filter((t) => t.tipo_movimiento === "egreso").length} gastos`}
          color="red"
        />
        <KPICard
          label="Utilidad neta"
          value={fmt(kpis.utilidad)}
          sub={kpis.utilidad >= 0 ? "Positivo ↑" : "Negativo ↓"}
          color={kpis.utilidad >= 0 ? "yellow" : "red"}
        />
        <KPICard
          label="Unidades vendidas"
          value={kpis.unidadesMes}
          sub="este mes"
          color="blue"
        />
      </div>

      <div className="two-col mb-6">
        <div className="card">
          <h2 className="section-title">
            Ingresos vs Egresos — últimos 6 meses
          </h2>
          <BarChart data={chartData} height={130} />
        </div>
        <div className="card">
          <h2 className="section-title">Últimas transacciones</h2>
          <UltimasTransacciones
            transacciones={recientes}
            getCliente={getCliente}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">
          Unidades vendidas por tamaño — acumulado
        </h2>
        <TarjetasUnidades
          porTamano={metricas.porTamano}
          totalUnidades={metricas.totalUnidades}
        />
      </div>
    </div>
  );
}

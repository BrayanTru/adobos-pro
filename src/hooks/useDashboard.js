import { useAtom } from "jotai";
import {
  clientesAtom,
  transaccionesAtom,
  recordatoriosAtom,
  kpisMesAtom,
  metricasProductosAtom,
} from "../store/atoms";
import { daysDiff } from "../utils/format";
import { MESES } from "../constants/meses";

export function useDashboard() {
  const [clientes] = useAtom(clientesAtom);
  const [transacciones] = useAtom(transaccionesAtom);
  const [recordatorios] = useAtom(recordatoriosAtom);
  const [kpis] = useAtom(kpisMesAtom);
  const [metricas] = useAtom(metricasProductosAtom);

  const now = new Date();
  const mesLabel = now.toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });
  const alertas = recordatorios.filter(
    (r) => r.dias_recordatorio - daysDiff(r.fecha_ultima_venta) <= 5,
  ).length;
  const recientes = transacciones.slice(0, 6);

  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const tx = transacciones.filter((t) => {
      const td = new Date(t.fecha + "T00:00:00");
      return td.getMonth() === m && td.getFullYear() === y;
    });
    const ing = tx
      .filter((t) => t.tipo_movimiento === "ingreso")
      .reduce((s, t) => s + Number(t.valor), 0);
    const eg = tx
      .filter((t) => t.tipo_movimiento === "egreso")
      .reduce((s, t) => s + Number(t.valor), 0);
    return { label: MESES[m], ing, eg };
  });

  const getCliente = (id) => clientes.find((c) => c.id === id);

  return {
    clientes,
    transacciones,
    kpis,
    metricas,
    mesLabel,
    alertas,
    recientes,
    chartData,
    getCliente,
  };
}

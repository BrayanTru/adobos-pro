import { useAtom } from "jotai";
import { transaccionesAtom, clientesAtom } from "../store/atoms";
import { MESES_COMPLETOS } from "../constants/meses";
import { HOJAS_DISPONIBLES } from "../constants/exportar";
import { estilizarHoja, calcularAnchos } from "../utils/excelStyles";
import {
  buildResumenMensual,
  buildDetalleVentas,
  buildDetalleEgresos,
  buildVentasPorCliente,
  buildAdobosPorTamano,
} from "../utils/excelBuilders";
import XLSXStyle from "xlsx-js-style";

export function useExportExcel() {
  const [transacciones] = useAtom(transaccionesAtom);
  const [clientes] = useAtom(clientesAtom);

  const getCliente = (id) => clientes.find((c) => c.id === id);

  const filtrarPorRango = ({ anio, mesInicio, mesFin }) =>
    transacciones.filter((t) => {
      const d = new Date(t.fecha + "T00:00:00");
      return (
        d.getFullYear() === anio &&
        d.getMonth() >= mesInicio &&
        d.getMonth() <= mesFin
      );
    });

  const BUILDERS = {
    resumen: (txs, rango) => buildResumenMensual(txs, rango),
    ventas: (txs) => buildDetalleVentas(txs, getCliente),
    egresos: (txs) => buildDetalleEgresos(txs, getCliente),
    clientes: (txs) => buildVentasPorCliente(txs, getCliente),
    tamanos: (txs, rango) => buildAdobosPorTamano(txs, rango),
  };

  const exportar = ({
    anio,
    mesInicio,
    mesFin,
    nombreArchivo,
    hojasActivas,
  }) => {
    const txs = filtrarPorRango({ anio, mesInicio, mesFin });
    if (!txs.length) return false;

    const wb = XLSXStyle.utils.book_new();
    const rango = { anio, mesInicio, mesFin };

    HOJAS_DISPONIBLES.filter((h) => hojasActivas.includes(h.id)).forEach(
      ({ id, nombre }) => {
        const datos = BUILDERS[id](txs, rango);
        if (!datos.length) return;
        const ws = XLSXStyle.utils.json_to_sheet(datos);
        ws["!cols"] = calcularAnchos(datos);
        estilizarHoja(ws, datos, id);
        XLSXStyle.utils.book_append_sheet(wb, ws, nombre);
      },
    );

    const rangoLabel =
      mesInicio === mesFin
        ? MESES_COMPLETOS[mesInicio]
        : `${MESES_COMPLETOS[mesInicio]}-${MESES_COMPLETOS[mesFin]}`;

    XLSXStyle.writeFile(
      wb,
      `${nombreArchivo || "AdobosPro"}_${rangoLabel}_${anio}.xlsx`,
    );
    return true;
  };

  const calcularPreview = ({ anio, mesInicio, mesFin }) => {
    const txs = filtrarPorRango({ anio, mesInicio, mesFin });
    const ventas = txs.filter((t) => t.tipo_movimiento === "ingreso");
    const egresos = txs.filter((t) => t.tipo_movimiento === "egreso");
    const ingresos = ventas.reduce((s, t) => s + Number(t.valor), 0);
    const totalEg = egresos.reduce((s, t) => s + Number(t.valor), 0);
    const unidades = ventas.reduce(
      (s, t) =>
        s +
        (t.transaccion_items || []).reduce(
          (si, i) => si + Number(i.cantidad),
          0,
        ),
      0,
    );
    return {
      totalTx: txs.length,
      numVentas: ventas.length,
      numEgresos: egresos.length,
      ingresos,
      totalEg,
      utilidad: ingresos - totalEg,
      unidades,
      clientesUnicos: new Set(ventas.map((t) => t.cliente_id).filter(Boolean))
        .size,
      sinDatos: txs.length === 0,
    };
  };

  return { exportar, calcularPreview };
}

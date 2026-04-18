import { useAtom } from "jotai";
import { transaccionesAtom } from "../store/atoms";
import { MESES } from "../constants/meses";

const ORDEN_TAMANOS = ["Personal", "Familiar", "Grande", "Institucional"];

export function useReportes(anio) {
  const [transacciones] = useAtom(transaccionesAtom);

  const txAnio = transacciones.filter(
    (t) => new Date(t.fecha + "T00:00:00").getFullYear() === anio,
  );

  const mesesData = Array.from({ length: 12 }, (_, m) => {
    const tx = txAnio.filter(
      (t) => new Date(t.fecha + "T00:00:00").getMonth() === m,
    );
    const ing = tx
      .filter((t) => t.tipo_movimiento === "ingreso")
      .reduce((s, t) => s + Number(t.valor), 0);
    const eg = tx
      .filter((t) => t.tipo_movimiento === "egreso")
      .reduce((s, t) => s + Number(t.valor), 0);
    const und = tx
      .filter((t) => t.tipo_movimiento === "ingreso")
      .reduce(
        (s, t) =>
          s +
          (t.transaccion_items || []).reduce(
            (si, i) => si + Number(i.cantidad),
            0,
          ),
        0,
      );
    return { mes: MESES[m], label: MESES[m], ing, eg, util: ing - eg, und };
  });

  const totalIng = mesesData.reduce((s, m) => s + m.ing, 0);
  const totalEg = mesesData.reduce((s, m) => s + m.eg, 0);
  const totalUtil = totalIng - totalEg;
  const totalUnd = mesesData.reduce((s, m) => s + m.und, 0);

  const porTamano = ORDEN_TAMANOS.map((tamano) => {
    let cantidad = 0,
      valor = 0;
    txAnio
      .filter((t) => t.tipo_movimiento === "ingreso")
      .forEach((t) => {
        (t.transaccion_items || [])
          .filter((i) => i.tamano === tamano)
          .forEach((i) => {
            cantidad += Number(i.cantidad);
            valor += Number(i.subtotal);
          });
      });
    return { tamano, cantidad, valor };
  });

  const catEg = {};
  txAnio
    .filter((t) => t.tipo_movimiento === "egreso")
    .forEach((t) => {
      catEg[t.categoria] = (catEg[t.categoria] || 0) + Number(t.valor);
    });

  const anios = [
    ...new Set(
      transacciones.map((t) => new Date(t.fecha + "T00:00:00").getFullYear()),
    ),
  ].sort((a, b) => b - a);

  return {
    mesesData,
    totalIng,
    totalEg,
    totalUtil,
    totalUnd,
    porTamano,
    catEg,
    anios,
  };
}

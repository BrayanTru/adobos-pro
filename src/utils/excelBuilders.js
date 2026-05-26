import { MESES_COMPLETOS } from "../constants/meses";

const toLocalDate = (fecha) =>
  new Date(fecha + "T00:00:00").toLocaleDateString("es-CO");

const sumItems = (txs, tipo) =>
  txs
    .filter((t) => t.tipo_movimiento === tipo)
    .reduce((s, t) => s + Number(t.valor), 0);

const unidadesDe = (txs) =>
  txs
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

export const buildResumenMensual = (txs, { anio, mesInicio, mesFin }) => {
  const filas = [];

  for (let m = mesInicio; m <= mesFin; m++) {
    const del = txs.filter(
      (t) => new Date(t.fecha + "T00:00:00").getMonth() === m,
    );
    const ing = sumItems(del, "ingreso");
    const eg = sumItems(del, "egreso");
    const und = unidadesDe(del);
    filas.push({
      Mes: MESES_COMPLETOS[m],
      Año: anio,
      Ingresos: ing,
      Egresos: eg,
      "Utilidad neta": ing - eg,
      "Unidades vendidas": und,
      "Margen %": ing > 0 ? `${Math.round(((ing - eg) / ing) * 100)}%` : "—",
    });
  }

  const ti = filas.reduce((s, f) => s + f.Ingresos, 0);
  const te = filas.reduce((s, f) => s + f.Egresos, 0);
  filas.push({
    Mes: "TOTAL",
    Año: "",
    Ingresos: ti,
    Egresos: te,
    "Utilidad neta": ti - te,
    "Unidades vendidas": filas.reduce((s, f) => s + f["Unidades vendidas"], 0),
    "Margen %": ti > 0 ? `${Math.round(((ti - te) / ti) * 100)}%` : "—",
  });

  return filas;
};

export const buildDetalleVentas = (txs, getCliente) => {
  const filas = [];
  txs
    .filter((t) => t.tipo_movimiento === "ingreso")
    .forEach((t) => {
      const c = getCliente(t.cliente_id);
      const fecha = toLocalDate(t.fecha);
      const base = {
        Fecha: fecha,
        Cliente: c?.nombre || "—",
        Municipio: c?.municipio || "—",
        Departamento: c?.departamento || "—",
        "Forma de pago": t.forma_pago,
      };
      const items = t.transaccion_items || [];
      if (items.length > 0) {
        items.forEach((item) =>
          filas.push({
            ...base,
            Tamaño: item.tamano,
            Gramaje: `${item.gramos}g`,
            Cantidad: item.cantidad,
            "Precio unitario": item.precio_unitario,
            Subtotal: item.subtotal,
            "Total transacción": t.valor,
            Descripción: t.descripcion || "—",
          }),
        );
      } else {
        filas.push({
          ...base,
          Tamaño: t.tamano || "—",
          Gramaje: "—",
          Cantidad: t.cantidad || "—",
          "Precio unitario": "—",
          Subtotal: t.valor,
          "Total transacción": t.valor,
          Descripción: t.descripcion || "—",
        });
      }
    });
  return filas;
};

export const buildDetalleEgresos = (txs, getCliente) => {
  const filas = txs
    .filter((t) => t.tipo_movimiento === "egreso")
    .map((t) => ({
      Fecha: toLocalDate(t.fecha),
      Categoría: t.categoria,
      "Forma de pago": t.forma_pago,
      Cliente: getCliente(t.cliente_id)?.nombre || "—",
      Valor: Number(t.valor),
      Descripción: t.descripcion || "—",
    }));

  if (filas.length > 0)
    filas.push({
      Fecha: "TOTAL",
      Categoría: "",
      "Forma de pago": "",
      Cliente: "",
      Valor: filas.reduce((s, f) => s + f.Valor, 0),
      Descripción: "",
    });

  return filas;
};

export const buildVentasPorCliente = (txs, getCliente) => {
  const mapa = {};
  txs
    .filter((t) => t.tipo_movimiento === "ingreso")
    .forEach((t) => {
      const c = getCliente(t.cliente_id);
      const nombre = c?.nombre || "Sin cliente";
      if (!mapa[nombre])
        mapa[nombre] = {
          Cliente: nombre,
          Municipio: c?.municipio || "—",
          Departamento: c?.departamento || "—",
          Teléfono: c?.telefono || "—",
          Transacciones: 0,
          "Unidades vendidas": 0,
          "Total ventas": 0,
          Personal: 0,
          Familiar: 0,
          Grande: 0,
          Institucional: 0,
        };
      mapa[nombre].Transacciones++;
      mapa[nombre]["Total ventas"] += Number(t.valor);
      (t.transaccion_items || []).forEach((item) => {
        mapa[nombre]["Unidades vendidas"] += Number(item.cantidad);
        if (mapa[nombre][item.tamano] !== undefined)
          mapa[nombre][item.tamano] += Number(item.cantidad);
      });
    });
  return Object.values(mapa).sort(
    (a, b) => b["Total ventas"] - a["Total ventas"],
  );
};

export const buildAdobosPorTamano = (txs, { mesInicio, mesFin, anio }) => {
  const TAMANOS = ["Personal", "Familiar", "Grande", "Institucional"];
  const filas = [];

  for (let m = mesInicio; m <= mesFin; m++) {
    const del = txs.filter(
      (t) =>
        new Date(t.fecha + "T00:00:00").getMonth() === m &&
        t.tipo_movimiento === "ingreso",
    );
    const fila = { Mes: MESES_COMPLETOS[m], Año: anio };
    let total = 0;
    TAMANOS.forEach((tam) => {
      const cant = del.reduce(
        (s, t) =>
          s +
          (t.transaccion_items || [])
            .filter((i) => i.tamano === tam)
            .reduce((si, i) => si + Number(i.cantidad), 0),
        0,
      );
      fila[`${tam} (und)`] = cant;
      total += cant;
    });
    fila["Total unidades"] = total;
    filas.push(fila);
  }

  const totales = { Mes: "TOTAL", Año: "" };
  TAMANOS.forEach((t) => {
    totales[`${t} (und)`] = filas.reduce(
      (s, f) => s + (f[`${t} (und)`] || 0),
      0,
    );
  });
  totales["Total unidades"] = filas.reduce(
    (s, f) => s + f["Total unidades"],
    0,
  );
  filas.push(totales);

  return filas;
};

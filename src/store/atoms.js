import { atom } from "jotai";

export const clientesAtom = atom([]);
export const transaccionesAtom = atom([]);
export const recordatoriosAtom = atom([]);
export const preciosAtom = atom([]);

// ── KPIs del mes ────────────────────────────────────────
export const kpisMesAtom = atom((get) => {
  const txs = get(transaccionesAtom);
  const now = new Date();
  const m = now.getMonth();
  const y = now.getFullYear();

  const delMes = txs.filter((t) => {
    const d = new Date(t.fecha + "T00:00:00");
    return d.getMonth() === m && d.getFullYear() === y;
  });

  const ingresos = delMes
    .filter((t) => t.tipo_movimiento === "ingreso")
    .reduce((s, t) => s + Number(t.valor), 0);

  const egresos = delMes
    .filter((t) => t.tipo_movimiento === "egreso")
    .reduce((s, t) => s + Number(t.valor), 0);

  // Unidades del mes sumando todos los items de cada transacción
  const unidadesMes = delMes
    .filter((t) => t.tipo_movimiento === "ingreso")
    .reduce((s, t) => {
      const itemsUnidades = (t.transaccion_items || []).reduce(
        (si, item) => si + Number(item.cantidad),
        0,
      );
      return s + itemsUnidades;
    }, 0);

  return {
    ingresos,
    egresos,
    utilidad: ingresos - egresos,
    total: delMes.length,
    unidadesMes,
  };
});

// ── Métricas de productos (acumulado total) ──────────────
export const metricasProductosAtom = atom((get) => {
  const txs = get(transaccionesAtom);

  const ventas = txs.filter((t) => t.tipo_movimiento === "ingreso");

  // Agrupar por tamaño sumando desde los items
  const porTamano = {};
  ventas.forEach((t) => {
    (t.transaccion_items || []).forEach((item) => {
      if (!porTamano[item.tamano])
        porTamano[item.tamano] = { cantidad: 0, valor: 0 };
      porTamano[item.tamano].cantidad += Number(item.cantidad);
      porTamano[item.tamano].valor += Number(item.subtotal);
    });
  });

  const totalUnidades = Object.values(porTamano).reduce(
    (s, v) => s + v.cantidad,
    0,
  );

  return { porTamano, totalUnidades };
});

// ── Alertas ──────────────────────────────────────────────
export const alertasAtom = atom((get) => {
  const recordatorios = get(recordatoriosAtom);
  const clientes = get(clientesAtom);

  return recordatorios
    .map((r) => {
      const cliente = clientes.find((c) => c.id === r.cliente_id);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const last = new Date(r.fecha_ultima_venta + "T00:00:00");
      const pasados = Math.floor((today - last) / 86400000);
      return { ...r, cliente, restantes: r.dias_recordatorio - pasados };
    })
    .filter((r) => r.restantes <= 5)
    .sort((a, b) => a.restantes - b.restantes);
});

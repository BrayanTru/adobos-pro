import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { clientesAtom, transaccionesAtom } from "../store/atoms";

export function useTransaccionesFiltradas() {
  const [transacciones] = useAtom(transaccionesAtom);
  const [clientes] = useAtom(clientesAtom);

  const anios = useMemo(() => {
    const set = new Set(
      transacciones.map((t) => new Date(t.fecha + "T00:00:00").getFullYear()),
    );
    return [...set].sort((a, b) => b - a);
  }, [transacciones]);

  const [anio, setAnio] = useState(() => anios[0] || new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const filtradas = useMemo(() => {
    const q = search.toLowerCase();
    return transacciones.filter((t) => {
      const año = new Date(t.fecha + "T00:00:00").getFullYear();
      const cliente = clientes.find((c) => c.id === t.cliente_id);
      return (
        año === anio &&
        (filtro === "todos" || t.tipo_movimiento === filtro) &&
        (!search ||
          t.descripcion?.toLowerCase().includes(q) ||
          t.categoria?.toLowerCase().includes(q) ||
          t.tamano?.toLowerCase().includes(q) ||
          cliente?.nombre?.toLowerCase().includes(q))
      );
    });
  }, [transacciones, clientes, anio, filtro, search]);

  const gruposPorMes = useMemo(() => {
    const grupos = {};
    filtradas.forEach((t) => {
      const mes = new Date(t.fecha + "T00:00:00").getMonth();
      if (!grupos[mes]) grupos[mes] = [];
      grupos[mes].push(t);
    });
    return Object.entries(grupos)
      .sort((a, b) => b[0] - a[0])
      .map(([mes, txs]) => ({ mes: Number(mes), txs }));
  }, [filtradas]);

  const kpisAnio = useMemo(() => {
    const ingresos = filtradas
      .filter((t) => t.tipo_movimiento === "ingreso")
      .reduce((s, t) => s + Number(t.valor), 0);
    const egresos = filtradas
      .filter((t) => t.tipo_movimiento === "egreso")
      .reduce((s, t) => s + Number(t.valor), 0);
    return {
      ingresos,
      egresos,
      utilidad: ingresos - egresos,
      total: filtradas.length,
    };
  }, [filtradas]);

  return {
    anios,
    anio,
    setAnio,
    search,
    setSearch,
    filtro,
    setFiltro,
    filtradas,
    gruposPorMes,
    kpisAnio,
    clientes,
  };
}

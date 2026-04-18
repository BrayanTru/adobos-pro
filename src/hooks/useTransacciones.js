import { useAtom } from "jotai";
import { transaccionesAtom } from "../store/atoms";
import { transaccionesService } from "../services/transaccionesService";
import { useToastContext } from "../context/ToastContext";
import { fmt } from "../utils/format";

export function useTransacciones() {
  const [transacciones, setTransacciones] = useAtom(transaccionesAtom);
  const toast = useToastContext();

  // Ahora recibe { transaccion, items }
  const crear = async ({ transaccion, items }) => {
    try {
      const nueva = await transaccionesService.create({ transaccion, items });
      setTransacciones((prev) => [nueva, ...prev]);

      if (transaccion.tipo_movimiento === "ingreso") {
        const totalUnd = items.reduce((s, i) => s + i.cantidad, 0);
        toast.success(
          "Venta registrada",
          `${totalUnd} unidades por ${fmt(transaccion.valor)}`,
        );
      } else {
        toast.success(
          "Egreso registrado",
          `${transaccion.categoria} por ${fmt(transaccion.valor)}`,
        );
      }

      return nueva;
    } catch {
      toast.error("Error", "No se pudo registrar la transacción");
    }
  };

  const eliminar = async (id) => {
    try {
      await transaccionesService.delete(id);
      setTransacciones((prev) => prev.filter((t) => t.id !== id));
      toast.success(
        "Transacción eliminada",
        "El registro fue eliminado correctamente",
      );
    } catch {
      toast.error("Error", "No se pudo eliminar la transacción");
    }
  };

  const getByCliente = (clienteId) =>
    transacciones.filter(
      (t) => t.cliente_id === clienteId && t.tipo_movimiento === "ingreso",
    );

  const getUltimaVenta = (clienteId) => {
    const tx = getByCliente(clienteId);
    return tx.length ? tx[0].fecha : null;
  };

  return { transacciones, crear, eliminar, getByCliente, getUltimaVenta };
}

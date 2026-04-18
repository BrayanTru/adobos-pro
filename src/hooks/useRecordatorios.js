import { useAtom } from "jotai";
import { recordatoriosAtom } from "../store/atoms";
import { recordatoriosService } from "../services/clientesService";
import { daysDiff } from "../utils/format";
import { useToastContext } from "../context/ToastContext";

export function useRecordatorios() {
  const [recordatorios, setRecordatorios] = useAtom(recordatoriosAtom);
  const toast = useToastContext();

  const upsert = async ({ clienteId, fechaUltimaVenta, diasRecordatorio }) => {
    const rec = await recordatoriosService.upsert({
      cliente_id: clienteId,
      fecha_ultima_venta: fechaUltimaVenta,
      dias_recordatorio: diasRecordatorio,
    });
    setRecordatorios((prev) => {
      const existe = prev.find((r) => r.cliente_id === clienteId);
      return existe
        ? prev.map((r) => (r.cliente_id === clienteId ? rec : r))
        : [...prev, rec];
    });
    return rec;
  };

  const getByCliente = (clienteId) =>
    recordatorios.find((r) => r.cliente_id === clienteId);

  const getDiasRestantes = (rec) => {
    if (!rec) return null;
    return rec.dias_recordatorio - daysDiff(rec.fecha_ultima_venta);
  };

  const alertas = recordatorios.filter((r) => getDiasRestantes(r) <= 5);

  const eliminar = async (clienteId) => {
    try {
      await recordatoriosService.delete(clienteId);
      setRecordatorios((prev) =>
        prev.filter((r) => r.cliente_id !== clienteId),
      );
      toast.success(
        "Recordatorio eliminado",
        "El cliente fue removido de las notificaciones",
      );
    } catch {
      toast.error("Error", "No se pudo eliminar el recordatorio");
    }
  };

  return {
    recordatorios,
    upsert,
    getByCliente,
    getDiasRestantes,
    alertas,
    eliminar,
  };
}

import { useAtom } from "jotai";
import { clientesAtom } from "../store/atoms";
import { clientesService } from "../services/clientesService";
import { useToastContext } from "../context/ToastContext";

export function useClientes() {
  const [clientes, setClientes] = useAtom(clientesAtom);
  const toast = useToastContext();

  const crear = async (form) => {
    try {
      const nuevo = await clientesService.create(form);
      setClientes((prev) => [...prev, nuevo]);
      toast.success(
        "Cliente creado",
        `${form.nombre} fue agregado correctamente`,
      );
      return nuevo;
    } catch {
      toast.error("Error", "No se pudo crear el cliente");
    }
  };

  const actualizar = async (id, form) => {
    try {
      const updated = await clientesService.update(id, form);
      setClientes((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success(
        "Cliente actualizado",
        `${form.nombre} fue editado correctamente`,
      );
      return updated;
    } catch {
      toast.error("Error", "No se pudo actualizar el cliente");
    }
  };

  const eliminar = async (id) => {
    try {
      await clientesService.delete(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
      toast.success(
        "Cliente eliminado",
        "El cliente fue eliminado correctamente",
      );
    } catch {
      toast.error("Error", "No se pudo eliminar el cliente");
    }
  };

  return { clientes, crear, actualizar, eliminar };
}

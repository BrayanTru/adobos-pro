import { useAtom } from "jotai";
import { preciosAtom } from "../store/atoms";
import { preciosService } from "../services/preciosService";
import { useToastContext } from "../context/ToastContext";

export function usePrecios() {
  const [precios, setPrecios] = useAtom(preciosAtom);
  const toast = useToastContext();

  const actualizar = async (id, nuevoPrecio) => {
    try {
      const updated = await preciosService.update(id, nuevoPrecio);
      setPrecios((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success(
        "Precio actualizado",
        "El precio fue guardado correctamente",
      );
      return updated;
    } catch {
      toast.error("Error", "No se pudo actualizar el precio");
    }
  };

  const getPrecioPorTamano = (tamano) => {
    const found = precios.find((p) => p.tamano === tamano);
    return found?.precio ?? 0;
  };

  return { precios, actualizar, getPrecioPorTamano };
}

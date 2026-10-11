import { useState } from "react";
import Modal from "../ui/Modal";
import SelectorTipo from "./SelectorTipo";
import FormIngreso from "./FormIngreso";
import FormEgreso from "./FormEgreso";
import { usePrecios } from "../../hooks/usePrecios";

const LINEA_VACIA = { tamano: "", cantidad: "" };
const DEFAULT_EGRESO = {
  fecha: new Date().toISOString().split("T")[0],
  categoria: "Materia prima",
  cliente_id: "",
  forma_pago: "efectivo",
  valor: "",
  descripcion: "",
};

const resumirItems = (items) =>
  items.map((i) => `${i.tamano}×${i.cantidad}`).join(", ");

// `inicial`: transacción existente a editar (si no viene, se crea una nueva)
export default function FormTransaccion({
  clientes,
  inicial,
  onSave,
  onClose,
}) {
  const { precios: preciosActuales } = usePrecios();
  const editando = Boolean(inicial);
  const esIngresoInicial = inicial?.tipo_movimiento === "ingreso";
  const itemsIniciales = inicial?.transaccion_items || [];

  // Al editar una venta se conservan los precios con los que se registró,
  // para que un cambio posterior de precios no altere ventas pasadas
  const precios = preciosActuales.map((p) => {
    const original = itemsIniciales.find((i) => i.tamano === p.tamano);
    return original
      ? {
          ...p,
          precio: Number(original.precio_unitario),
          gramos: original.gramos,
        }
      : p;
  });

  const [tipo, setTipo] = useState(inicial?.tipo_movimiento || "ingreso");
  const [fecha, setFecha] = useState(
    esIngresoInicial ? inicial.fecha : new Date().toISOString().split("T")[0],
  );
  const [clienteId, setClienteId] = useState(
    esIngresoInicial ? inicial.cliente_id || "" : "",
  );
  const [formaPago, setFormaPago] = useState(
    esIngresoInicial ? inicial.forma_pago : "efectivo",
  );
  // Si la descripción era la generada automáticamente, se deja vacía
  // para que se regenere con los productos editados
  const [descripcion, setDescripcion] = useState(
    esIngresoInicial && inicial.descripcion !== resumirItems(itemsIniciales)
      ? inicial.descripcion || ""
      : "",
  );
  const [lineas, setLineas] = useState(
    esIngresoInicial && itemsIniciales.length
      ? itemsIniciales.map((i) => ({
          tamano: i.tamano,
          cantidad: String(i.cantidad),
        }))
      : [{ ...LINEA_VACIA }],
  );
  const [egreso, setEgreso] = useState(
    editando && !esIngresoInicial
      ? {
          fecha: inicial.fecha,
          categoria: inicial.categoria,
          cliente_id: inicial.cliente_id || "",
          forma_pago: inicial.forma_pago,
          valor: String(inicial.valor),
          descripcion: inicial.descripcion || "",
        }
      : DEFAULT_EGRESO,
  );
  const [saving, setSaving] = useState(false);

  const handleTipo = (t) => {
    setTipo(t);
    setLineas([{ ...LINEA_VACIA }]);
    setEgreso(DEFAULT_EGRESO);
  };

  const calcularItems = () =>
    lineas
      .filter((l) => l.tamano && Number(l.cantidad) > 0)
      .map((l) => {
        const precio = precios.find((p) => p.tamano === l.tamano);
        return {
          tamano: l.tamano,
          gramos: precio?.gramos || 0,
          cantidad: Number(l.cantidad),
          precio_unitario: precio?.precio || 0,
          subtotal: Number(l.cantidad) * (precio?.precio || 0),
        };
      });

  const handleSubmit = async () => {
    setSaving(true);
    if (tipo === "ingreso") {
      const items = calcularItems();
      if (!items.length) {
        setSaving(false);
        return;
      }
      const totalValor = items.reduce((s, i) => s + i.subtotal, 0);
      const totalUnd = items.reduce((s, i) => s + i.cantidad, 0);
      const resumenTamanos = resumirItems(items);
      await onSave({
        transaccion: {
          fecha,
          tipo_movimiento: "ingreso",
          categoria: "Venta de productos",
          cliente_id: clienteId || null,
          forma_pago: formaPago,
          valor: totalValor,
          cantidad: totalUnd,
          tamano: resumenTamanos,
          precio_unitario: null,
          descripcion: descripcion || resumenTamanos,
        },
        items,
      });
    } else {
      if (!egreso.valor || Number(egreso.valor) <= 0) {
        setSaving(false);
        return;
      }
      await onSave({
        transaccion: {
          ...egreso,
          tipo_movimiento: "egreso",
          valor: Number(egreso.valor),
          cliente_id: egreso.cliente_id || null,
          tamano: null,
          cantidad: null,
          precio_unitario: null,
        },
        items: [],
      });
    }
    setSaving(false);
  };

  const itemsValidos = tipo === "ingreso" ? calcularItems() : [];

  return (
    <Modal
      title={editando ? "Editar Transacción" : "Nueva Transacción"}
      subtitle={
        editando
          ? `Modifica los datos de este ${tipo}`
          : "Registra un movimiento de ingreso o egreso"
      }
      onClose={onClose}>
      {!editando && <SelectorTipo tipo={tipo} onChange={handleTipo} />}

      {tipo === "ingreso" ? (
        <FormIngreso
          clientes={clientes}
          precios={precios}
          fecha={fecha}
          setFecha={setFecha}
          formaPago={formaPago}
          setFormaPago={setFormaPago}
          clienteId={clienteId}
          setClienteId={setClienteId}
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          lineas={lineas}
          setLineas={setLineas}
        />
      ) : (
        <FormEgreso form={egreso} onChange={setEgreso} clientes={clientes} />
      )}

      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={
            saving || (tipo === "ingreso" && itemsValidos.length === 0)
          }>
          {saving
            ? "Guardando..."
            : editando
              ? "✓ Guardar cambios"
              : tipo === "ingreso"
              ? "✓ Registrar venta"
              : "✓ Guardar egreso"}
        </button>
      </div>
    </Modal>
  );
}

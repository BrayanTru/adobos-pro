import { useState } from "react";
import { useAtom } from "jotai";
import { clientesAtom } from "../store/atoms";
import { useTransacciones } from "../hooks/useTransacciones";
import { useRecordatorios } from "../hooks/useRecordatorios";
import FormTransaccion from "../components/transacciones/FormTransaccion";
import TablaTransacciones from "../components/transacciones/TablaTransacciones";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Transacciones() {
  const [clientes] = useAtom(clientesAtom);
  const { transacciones, crear, eliminar } = useTransacciones();
  const { upsert, getByCliente } = useRecordatorios();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [confirm, setConfirm] = useState(null);

  const filtered = transacciones
    .filter((t) => filtro === "todos" || t.tipo_movimiento === filtro)
    .filter(
      (t) =>
        !search ||
        t.descripcion?.toLowerCase().includes(search.toLowerCase()) ||
        t.categoria?.toLowerCase().includes(search.toLowerCase()) ||
        t.tamano?.toLowerCase().includes(search.toLowerCase()),
    );

  // Ahora recibe { transaccion, items }
  const handleSave = async ({ transaccion, items }) => {
    const nueva = await crear({ transaccion, items });
    if (transaccion.tipo_movimiento === "ingreso" && transaccion.cliente_id) {
      const rec = getByCliente(transaccion.cliente_id);
      await upsert({
        clienteId: transaccion.cliente_id,
        fechaUltimaVenta: transaccion.fecha,
        diasRecordatorio: rec?.dias_recordatorio || 25,
      });
    }
    setShowForm(false);
  };

  const handleDelete = (id) => setConfirm({ id });
  const handleConfirmDelete = async () => {
    await eliminar(confirm.id);
    setConfirm(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transacciones</h1>
          <p className="page-subtitle">
            Registro completo de ingresos y egresos
          </p>
        </div>
        <button
          className="btn btn-primary ml-auto"
          onClick={() => setShowForm(true)}>
          + Nueva transacción
        </button>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}>
          <input
            className="form-input"
            style={{ maxWidth: 300 }}
            placeholder="Buscar descripción, categoría o tamaño..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-tabs">
            {[
              ["todos", "Todos"],
              ["ingreso", "↑ Ingresos"],
              ["egreso", "↓ Egresos"],
            ].map(([val, label]) => (
              <button
                key={val}
                className={`filter-tab ${filtro === val ? "active" : ""}`}
                onClick={() => setFiltro(val)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <TablaTransacciones
          transacciones={filtered}
          clientes={clientes}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <FormTransaccion
          clientes={clientes}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      {confirm && (
        <ConfirmModal
          title="¿Eliminar transacción?"
          message="Este registro será eliminado permanentemente."
          confirmLabel="Sí, eliminar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

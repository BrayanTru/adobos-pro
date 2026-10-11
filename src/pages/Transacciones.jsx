import { useState } from "react";
import { useTransacciones } from "../hooks/useTransacciones";
import { useRecordatorios } from "../hooks/useRecordatorios";
import { useTransaccionesFiltradas } from "../hooks/useTransaccionesFiltradas";
import FormTransaccion from "../components/transacciones/FormTransaccion";
import GrupoMes from "../components/transacciones/GrupoMes";
import FiltrosTransacciones from "../components/transacciones/FiltrosTransacciones";
import KpisAnio from "../components/transacciones/KpisAnio";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Transacciones() {
  const { transacciones, crear, actualizar, eliminar } = useTransacciones();
  const { upsert, getByCliente } = useRecordatorios();
  const {
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
  } = useTransaccionesFiltradas();

  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const mesActual = new Date().getMonth();

  const actualizarRecordatorio = async (clienteId, fechaUltimaVenta) => {
    const rec = getByCliente(clienteId);
    await upsert({
      clienteId,
      fechaUltimaVenta,
      diasRecordatorio: rec?.dias_recordatorio || 25,
    });
  };

  // Fecha de la venta más reciente del cliente, ignorando la transacción editada
  const ultimaVentaSin = (clienteId, excluirId) =>
    transacciones
      .filter(
        (t) =>
          t.id !== excluirId &&
          t.cliente_id === clienteId &&
          t.tipo_movimiento === "ingreso",
      )
      .reduce((max, t) => (!max || t.fecha > max ? t.fecha : max), null);

  const handleSave = async ({ transaccion, items }) => {
    await crear({ transaccion, items });
    if (transaccion.tipo_movimiento === "ingreso" && transaccion.cliente_id) {
      await actualizarRecordatorio(transaccion.cliente_id, transaccion.fecha);
    }
    setShowForm(false);
  };

  const handleUpdate = async ({ transaccion, items }) => {
    const original = editando;
    const actualizada = await actualizar(original.id, { transaccion, items });
    // Si falló, el formulario queda abierto para reintentar
    if (!actualizada) return;
    if (transaccion.tipo_movimiento === "ingreso") {
      // El recordatorio refleja la venta más reciente del cliente
      if (transaccion.cliente_id) {
        const otra = ultimaVentaSin(transaccion.cliente_id, original.id);
        await actualizarRecordatorio(
          transaccion.cliente_id,
          otra && otra > transaccion.fecha ? otra : transaccion.fecha,
        );
      }
      // Si la venta cambió de cliente, recalcula el recordatorio del anterior
      if (
        original.cliente_id &&
        original.cliente_id !== transaccion.cliente_id &&
        getByCliente(original.cliente_id)
      ) {
        const otra = ultimaVentaSin(original.cliente_id, original.id);
        if (otra) await actualizarRecordatorio(original.cliente_id, otra);
      }
    }
    setEditando(null);
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

      <div className="card mb-6">
        <FiltrosTransacciones
          anios={anios}
          anio={anio}
          setAnio={setAnio}
          search={search}
          setSearch={setSearch}
          filtro={filtro}
          setFiltro={setFiltro}
          total={filtradas.length}
        />
        {filtradas.length > 0 && <KpisAnio kpis={kpisAnio} anio={anio} />}
      </div>

      {gruposPorMes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">⇄</div>
            <div>
              {search || filtro !== "todos"
                ? "Sin resultados para esta búsqueda"
                : `Sin transacciones en ${anio}`}
            </div>
          </div>
        </div>
      ) : (
        gruposPorMes.map(({ mes, txs }) => (
          <GrupoMes
            key={mes}
            mes={mes}
            transacciones={txs}
            clientes={clientes}
            onEdit={setEditando}
            onDelete={handleDelete}
            defaultAbierto={mes === mesActual}
          />
        ))
      )}

      {showForm && (
        <FormTransaccion
          clientes={clientes}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      {editando && (
        <FormTransaccion
          key={editando.id}
          clientes={clientes}
          inicial={editando}
          onSave={handleUpdate}
          onClose={() => setEditando(null)}
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

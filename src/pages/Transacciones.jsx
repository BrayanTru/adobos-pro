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
  const { crear, eliminar } = useTransacciones();
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
  const [confirm, setConfirm] = useState(null);
  const mesActual = new Date().getMonth();

  const handleSave = async ({ transaccion, items }) => {
    await crear({ transaccion, items });
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

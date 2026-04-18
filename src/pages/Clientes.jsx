import { useState } from "react";
import { useAtom } from "jotai";
import { recordatoriosAtom } from "../store/atoms";
import { useClientes } from "../hooks/useClientes";
import { useTransacciones } from "../hooks/useTransacciones";
import { useRecordatorios } from "../hooks/useRecordatorios";
import FormCliente from "../components/clientes/FormCliente";
import TablaClientes from "../components/clientes/TablaClientes";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Clientes() {
  const { clientes, crear, actualizar, eliminar } = useClientes();
  const { getUltimaVenta } = useTransacciones();
  const { upsert, getByCliente } = useRecordatorios();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [modalRec, setModalRec] = useState(null);
  const [diasRec, setDiasRec] = useState(25);
  const [recordatorios] = useAtom(recordatoriosAtom);
  const [confirm, setConfirm] = useState(null);

  const filtered = clientes.filter(
    (c) =>
      !search ||
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.municipio?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async (form) => {
    editing ? await actualizar(editing.id, form) : await crear(form);
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    const cliente = clientes.find((c) => c.id === id);
    setConfirm({ id, nombre: cliente?.nombre });
  };

  const handleConfirmDelete = async () => {
    await eliminar(confirm.id);
    setConfirm(null);
  };

  const handleSaveRec = async () => {
    const lastSale =
      getUltimaVenta(modalRec.id) || new Date().toISOString().split("T")[0];
    await upsert({
      clienteId: modalRec.id,
      fechaUltimaVenta: lastSale,
      diasRecordatorio: Number(diasRec),
    });
    setModalRec(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Gestión de clientes y ubicaciones</p>
        </div>
        <button
          className="btn btn-primary ml-auto"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}>
          + Nuevo cliente
        </button>
      </div>

      <div className="card">
        <div className="mb-4">
          <input
            className="form-input"
            style={{ maxWidth: 300 }}
            placeholder="Buscar cliente o municipio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <TablaClientes
          clientes={filtered}
          recordatorios={recordatorios}
          getLastSale={getUltimaVenta}
          onEdit={(c) => {
            setEditing(c);
            setShowForm(true);
          }}
          onDelete={handleDelete}
          onRecordatorio={(c) => {
            setModalRec(c);
            setDiasRec(getByCliente(c.id)?.dias_recordatorio || 25);
          }}
        />
      </div>

      {showForm && (
        <FormCliente
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          initial={editing}
        />
      )}

      {modalRec && (
        <Modal
          title="Ciclo de Recordatorio"
          subtitle={`Cliente: ${modalRec.nombre}`}
          onClose={() => setModalRec(null)}
          size="sm">
          <div className="form-group">
            <label className="form-label">Cada cuántos días recordar</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="365"
              value={diasRec}
              onChange={(e) => setDiasRec(e.target.value)}
            />
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
            El sistema alertará cuando falten 5 días o menos para el próximo
            ciclo.
          </p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModalRec(null)}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSaveRec}>
              Guardar
            </button>
          </div>
        </Modal>
      )}
      {confirm && (
        <ConfirmModal
          title="¿Eliminar cliente?"
          message={`"${confirm.nombre}" será eliminado permanentemente junto con sus recordatorios.`}
          confirmLabel="Sí, eliminar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

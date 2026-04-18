import { useAtom } from "jotai";
import { useState } from "react";
import { clientesAtom, recordatoriosAtom } from "../store/atoms";
import { useRecordatorios } from "../hooks/useRecordatorios";
import NotifItem from "../components/notificaciones/NotifItem";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Notificaciones() {
  const [clientes] = useAtom(clientesAtom);
  const [recordatorios] = useAtom(recordatoriosAtom);
  const { getDiasRestantes, eliminar } = useRecordatorios();
  const [confirm, setConfirm] = useState(null);

  const items = recordatorios
    .map((r) => ({
      ...r,
      cliente: clientes.find((c) => c.id === r.cliente_id),
      restantes: getDiasRestantes(r),
    }))
    .sort((a, b) => a.restantes - b.restantes);

  const urgentes = items.filter((i) => i.restantes <= 0);
  const warning = items.filter((i) => i.restantes > 0 && i.restantes <= 5);
  const ok = items.filter((i) => i.restantes > 5);

  const handleEliminar = (clienteId) => {
    const item = items.find((i) => i.cliente_id === clienteId);
    setConfirm({ clienteId, nombre: item?.cliente?.nombre });
  };

  const handleConfirm = async () => {
    await eliminar(confirm.clienteId);
    setConfirm(null);
  };

  const Section = ({ title, color, items }) =>
    items.length === 0 ? null : (
      <div className="mb-6">
        <h2 className="section-title" style={{ color }}>
          {title} ({items.length})
        </h2>
        {items.map((i) => (
          <NotifItem key={i.id} item={i} onEliminar={handleEliminar} />
        ))}
      </div>
    );

  return (
    <div>
      <h1 className="page-title">Notificaciones</h1>
      <p className="page-subtitle mb-6">
        Clientes próximos a su ciclo de recompra
      </p>

      {items.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <div>No hay recordatorios configurados.</div>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Ve a <strong>Clientes</strong> y configura el ciclo de recompra
              con el botón 🔔
            </p>
          </div>
        </div>
      ) : (
        <>
          <Section
            title="🔴 Listos para nueva venta"
            color="#c0392b"
            items={urgentes}
          />
          <Section
            title="🟡 Próximos a vencer"
            color="#b5621e"
            items={warning}
          />
          <Section title="✅ Al día" color="#2d6a4f" items={ok} />
        </>
      )}

      {confirm && (
        <ConfirmModal
          title="¿Quitar recordatorio?"
          message={`Se eliminará el recordatorio de "${confirm.nombre}". Podrás volver a configurarlo desde la sección Clientes.`}
          confirmLabel="Sí, quitar"
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          danger={false}
        />
      )}
    </div>
  );
}

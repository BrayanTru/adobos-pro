import React, { useState } from "react";
import FilaTransaccion from "./FilaTransaccion";
import FilaDetalle from "./FilaDetalle";

export default function TablaTransacciones({
  transacciones,
  clientes,
  onDelete,
}) {
  const [expandido, setExpandido] = useState(null);
  const getCliente = (id) => clientes.find((c) => c.id === id);

  if (transacciones.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⇄</div>Sin transacciones
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {[
              "",
              "Fecha",
              "Tipo",
              "Detalle",
              "Cliente",
              "Pago",
              "Total",
              "",
            ].map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transacciones.map((t) => {
            const items = t.transaccion_items || [];
            const tieneItems = items.length > 0;
            const isOpen = expandido === t.id;
            return (
              <React.Fragment key={t.id}>
                <FilaTransaccion
                  t={t}
                  cliente={getCliente(t.cliente_id)}
                  isOpen={isOpen}
                  tieneItems={tieneItems}
                  onToggle={() => setExpandido(isOpen ? null : t.id)}
                  onDelete={() => onDelete(t.id)}
                />
                {isOpen && tieneItems && <FilaDetalle items={items} />}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

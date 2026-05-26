import { useState } from "react";
import TablaTransacciones from "./TablaTransacciones";
import { fmt } from "../../utils/format";
import { MESES_COMPLETOS } from "../../constants/meses";

export default function GrupoMes({
  mes,
  transacciones,
  clientes,
  onDelete,
  defaultAbierto,
}) {
  const [abierto, setAbierto] = useState(defaultAbierto);

  const ingresos = transacciones
    .filter((t) => t.tipo_movimiento === "ingreso")
    .reduce((s, t) => s + Number(t.valor), 0);

  const egresos = transacciones
    .filter((t) => t.tipo_movimiento === "egreso")
    .reduce((s, t) => s + Number(t.valor), 0);

  const utilidad = ingresos - egresos;
  const numIngresos = transacciones.filter(
    (t) => t.tipo_movimiento === "ingreso",
  ).length;
  const numEgresos = transacciones.filter(
    (t) => t.tipo_movimiento === "egreso",
  ).length;

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Cabecera del mes — clicable */}
      <div
        onClick={() => setAbierto((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 20px",
          background: abierto ? "#fff" : "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: abierto ? "10px 10px 0 0" : 10,
          cursor: "pointer",
          userSelect: "none",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!abierto) e.currentTarget.style.background = "#edeae3";
        }}
        onMouseLeave={(e) => {
          if (!abierto) e.currentTarget.style.background = "var(--bg3)";
        }}>
        {/* Mes + conteo */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 15,
              }}>
              {MESES_COMPLETOS[mes]}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--muted)",
                display: "flex",
                gap: 6,
              }}>
              {numIngresos > 0 && (
                <span className="badge badge-green">
                  {numIngresos} ingreso{numIngresos !== 1 ? "s" : ""}
                </span>
              )}
              {numEgresos > 0 && (
                <span className="badge badge-red">
                  {numEgresos} egreso{numEgresos !== 1 ? "s" : ""}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Resumen financiero */}
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Ingresos</div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                color: "#2d6a4f",
              }}>
              +{fmt(ingresos)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Egresos</div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 14,
                color: "#c0392b",
              }}>
              -{fmt(egresos)}
            </div>
          </div>
          <div
            style={{
              textAlign: "right",
              paddingLeft: 16,
              borderLeft: "1px solid var(--border)",
            }}>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Utilidad</div>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 800,
                fontSize: 15,
                color: utilidad >= 0 ? "#2d6a4f" : "#c0392b",
              }}>
              {fmt(utilidad)}
            </div>
          </div>
          <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 4 }}>
            {abierto ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Tabla colapsable */}
      {abierto && (
        <div
          style={{
            border: "1px solid var(--border)",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            overflow: "hidden",
            animation: "panelIn 0.15s ease",
          }}>
          <style>{`@keyframes panelIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }`}</style>
          <TablaTransacciones
            transacciones={transacciones}
            clientes={clientes}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
}

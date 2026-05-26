import { MESES_COMPLETOS } from "../../constants/meses";
import KpisPrevia from "./KpisPrevia";
import ConteoPrevia from "./ConteoPrevia";
import SelectorHojas from "./SelectorHojas";

export default function VistaPrevia({
  preview,
  rango,
  hojasActivas,
  onToggleHoja,
}) {
  const { anio, mesInicio, mesFin } = rango;
  const rangoLabel =
    mesInicio === mesFin
      ? MESES_COMPLETOS[mesInicio]
      : `${MESES_COMPLETOS[mesInicio]} — ${MESES_COMPLETOS[mesFin]}`;

  if (preview.sinDatos) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 0",
          color: "var(--muted)",
        }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
        <div style={{ fontSize: 14 }}>
          Sin transacciones en el período seleccionado
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          padding: "12px 16px",
          background: "#edf7f1",
          border: "1px solid #b8ddc8",
          borderRadius: 8,
        }}>
        <div style={{ fontSize: 12, color: "#7a9e88", marginBottom: 2 }}>
          Período seleccionado
        </div>
        <div
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: 16,
            color: "#1a5c38",
          }}>
          {rangoLabel} · {anio}
        </div>
      </div>

      <KpisPrevia preview={preview} />
      <ConteoPrevia preview={preview} />
      <SelectorHojas hojasActivas={hojasActivas} onToggle={onToggleHoja} />
    </div>
  );
}

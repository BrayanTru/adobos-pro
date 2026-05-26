import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { transaccionesAtom } from "../store/atoms";
import { useExportExcel } from "../hooks/useExportExcel";
import { useToastContext } from "../context/ToastContext";
import SelectorRango from "../components/exportar/SelectorRango";
import VistaPrevia from "../components/exportar/VistaPrevia";
import { HOJAS_DISPONIBLES } from "../constants/exportar";

export default function Exportar() {
  const [transacciones] = useAtom(transaccionesAtom);
  const { exportar, calcularPreview } = useExportExcel();
  const toast = useToastContext();

  const anios = useMemo(() => {
    const set = new Set(
      transacciones.map((t) => new Date(t.fecha + "T00:00:00").getFullYear()),
    );
    return [...set].sort((a, b) => b - a);
  }, [transacciones]);

  const mesActual = new Date().getMonth();
  const anioActual = new Date().getFullYear();

  const [rango, setRango] = useState({
    anio: anios[0] || anioActual,
    mesInicio: mesActual,
    mesFin: mesActual,
  });
  const [hojasActivas, setHojasActivas] = useState(
    HOJAS_DISPONIBLES.map((h) => h.id),
  );
  const [descargando, setDescargando] = useState(false);

  const preview = useMemo(() => calcularPreview(rango), [rango, transacciones]);

  const handleToggleHoja = (id) => {
    setHojasActivas((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
    );
  };

  const handleExportar = async () => {
    if (hojasActivas.length === 0) {
      toast.warning(
        "Sin hojas seleccionadas",
        "Selecciona al menos una hoja para exportar",
      );
      return;
    }
    setDescargando(true);
    try {
      const ok = exportar({
        ...rango,
        nombreArchivo: "AdobosPro",
        hojasActivas,
      });
      if (ok) {
        toast.success(
          "Reporte descargado",
          `${hojasActivas.length} hoja${hojasActivas.length !== 1 ? "s" : ""} exportada${hojasActivas.length !== 1 ? "s" : ""} correctamente`,
        );
      } else {
        toast.warning(
          "Sin datos",
          "No hay transacciones en el período seleccionado",
        );
      }
    } catch {
      toast.error("Error", "No se pudo generar el archivo Excel");
    }
    setDescargando(false);
  };

  const puedeDescargar =
    !descargando && !preview.sinDatos && hojasActivas.length > 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Exportar reportes</h1>
          <p className="page-subtitle">
            Descarga tus datos en Excel para análisis detallado
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 20,
          alignItems: "start",
        }}>
        {/* Panel izquierdo */}
        <div>
          <div className="card mb-4">
            <h2 className="section-title">Seleccionar período</h2>
            {anios.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                No hay transacciones registradas aún.
              </p>
            ) : (
              <SelectorRango anios={anios} rango={rango} onChange={setRango} />
            )}
          </div>

          <button
            className="btn btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "14px",
              fontSize: 15,
              opacity: puedeDescargar ? 1 : 0.6,
            }}
            onClick={handleExportar}
            disabled={!puedeDescargar}>
            {descargando
              ? "⏳ Generando archivo..."
              : `⬇ Descargar Excel${hojasActivas.length > 0 ? ` (${hojasActivas.length} hoja${hojasActivas.length !== 1 ? "s" : ""})` : ""}`}
          </button>

          {hojasActivas.length === 0 && (
            <p
              style={{
                fontSize: 12,
                color: "var(--accent3)",
                textAlign: "center",
                marginTop: 10,
              }}>
              Selecciona al menos una hoja para exportar
            </p>
          )}
          {preview.sinDatos && hojasActivas.length > 0 && (
            <p
              style={{
                fontSize: 12,
                color: "var(--muted)",
                textAlign: "center",
                marginTop: 10,
              }}>
              Selecciona un período con transacciones para habilitar la descarga
            </p>
          )}
        </div>

        {/* Panel derecho */}
        <div className="card">
          <h2 className="section-title">Vista previa del reporte</h2>
          <VistaPrevia
            preview={preview}
            rango={rango}
            hojasActivas={hojasActivas}
            onToggleHoja={handleToggleHoja}
          />
        </div>
      </div>
    </div>
  );
}

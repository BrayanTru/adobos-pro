import TablaPrecios from "../components/configuracion/TablaPrecios";

export default function Configuracion() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Configuración</h1>
          <p className="page-subtitle">
            Gestión de precios y parámetros del sistema
          </p>
        </div>
      </div>

      <div className="card mb-6">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: 4 }}>
              Precios de productos
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Estos precios se usan automáticamente al registrar una venta. Haz
              clic en <strong>Editar</strong> para modificar un precio y{" "}
              <strong>Enter</strong> para confirmar.
            </p>
          </div>
        </div>
        <TablaPrecios />
      </div>

      <div className="card" style={{ borderLeft: "3px solid #b8ddc8" }}>
        <h2 className="section-title" style={{ marginBottom: 8 }}>
          ℹ Cómo funciona el cálculo
        </h2>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
          Cuando registras una venta de tipo <strong>Ingreso</strong>, el
          sistema multiplica automáticamente el precio del tamaño seleccionado
          por la cantidad de unidades. El valor total se guarda en la
          transacción junto con el precio unitario y la cantidad, permitiendo
          trazabilidad completa de cada venta.
        </p>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { initials } from "../../utils/format";

export default function BuscadorCliente({
  clientes,
  value,
  onChange,
  placeholder = "Buscar cliente...",
}) {
  const [query, setQuery] = useState("");
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);

  const clienteSeleccionado = clientes.find((c) => c.id === value);

  const filtrados = clientes.filter(
    (c) =>
      !query ||
      c.nombre.toLowerCase().includes(query.toLowerCase()) ||
      c.municipio?.toLowerCase().includes(query.toLowerCase()),
  );

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSeleccionar = (cliente) => {
    onChange(cliente ? cliente.id : "");
    setAbierto(false);
    setQuery("");
  };

  return (
    <div ref={contenedorRef} style={{ position: "relative" }}>
      {/* Input principal */}
      <div
        onClick={() => setAbierto((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--bg3)",
          border: abierto
            ? "1px solid var(--accent)"
            : "1px solid var(--border)",
          borderRadius: 8,
          padding: "10px 14px",
          cursor: "pointer",
          transition: "border-color 0.15s",
          minHeight: 42,
        }}>
        {clienteSeleccionado ? (
          <>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "#e8f5ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                fontSize: 10,
                color: "#1a5c38",
                flexShrink: 0,
              }}>
              {initials(clienteSeleccionado.nombre)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--text)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                {clienteSeleccionado.nombre}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                {clienteSeleccionado.municipio},{" "}
                {clienteSeleccionado.departamento}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSeleccionar(null);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: 16,
                padding: "0 2px",
                lineHeight: 1,
              }}>
              ✕
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: 14, color: "var(--muted)", flex: 1 }}>
              — Sin cliente —
            </span>
            <span style={{ color: "var(--muted)", fontSize: 12 }}>
              {abierto ? "▲" : "▼"}
            </span>
          </>
        )}
      </div>

      {/* Dropdown */}
      {abierto && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            zIndex: 300,
            overflow: "hidden",
            animation: "panelIn 0.15s ease",
          }}>
          {/* Buscador */}
          <div
            style={{
              padding: "8px 10px",
              borderBottom: "1px solid var(--border)",
            }}>
            <input
              autoFocus
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontSize: 13,
                outline: "none",
                fontFamily: "var(--font-body)",
                color: "var(--text)",
              }}
            />
          </div>

          {/* Lista */}
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {/* Opción vacía */}
            <div
              onClick={() => handleSeleccionar(null)}
              style={{
                padding: "8px 14px",
                fontSize: 13,
                color: "var(--muted)",
                cursor: "pointer",
                borderBottom: "1px solid var(--bg3)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }>
              — Sin cliente —
            </div>

            {filtrados.length === 0 ? (
              <div
                style={{
                  padding: "16px 14px",
                  fontSize: 13,
                  color: "var(--muted)",
                  textAlign: "center",
                }}>
                Sin resultados para "{query}"
              </div>
            ) : (
              filtrados.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSeleccionar(c)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 14px",
                    cursor: "pointer",
                    background: c.id === value ? "#edf7f1" : "transparent",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (c.id !== value)
                      e.currentTarget.style.background = "var(--bg3)";
                  }}
                  onMouseLeave={(e) => {
                    if (c.id !== value)
                      e.currentTarget.style.background = "transparent";
                  }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: "#e8f5ee",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 10,
                      color: "#1a5c38",
                    }}>
                    {initials(c.nombre)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: c.id === value ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                      {c.nombre}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      {c.municipio}, {c.departamento}
                    </div>
                  </div>
                  {c.id === value && (
                    <span style={{ color: "#2d6a4f", fontSize: 14 }}>✓</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

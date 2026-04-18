import { useAtom } from "jotai";
import { Routes, Route, NavLink } from "react-router-dom";
import { useEffect } from "react";
import {
  clientesAtom,
  transaccionesAtom,
  recordatoriosAtom,
  preciosAtom,
} from "./store/atoms";
import { clientesService } from "./services/clientesService";
import { transaccionesService } from "./services/transaccionesService";
import { recordatoriosService } from "./services/clientesService";
import { preciosService } from "./services/preciosService";
import { useToast } from "./hooks/useToast";
import { ToastContext } from "./context/ToastContext";
import ToastContainer from "./components/ui/Toast";
import Dashboard from "./pages/Dashboard";
import Transacciones from "./pages/Transacciones";
import Clientes from "./pages/Clientes";
import Reportes from "./pages/Reportes";
import Notificaciones from "./pages/Notificaciones";
import Configuracion from "./pages/Configuracion";

export default function App() {
  const [clientes, setClientes] = useAtom(clientesAtom);
  const [transacciones, setTransacciones] = useAtom(transaccionesAtom);
  const [recordatorios, setRecordatorios] = useAtom(recordatoriosAtom);
  const [, setPrecios] = useAtom(preciosAtom);
  const { toasts, toast, removeToast } = useToast();

  useEffect(() => {
    clientesService.getAll().then(setClientes);
    transaccionesService.getAll().then(setTransacciones);
    recordatoriosService.getAll().then(setRecordatorios);
    preciosService.getAll().then(setPrecios);
  }, []);

  const alertCount = recordatorios.filter((r) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last = new Date(r.fecha_ultima_venta + "T00:00:00");
    return r.dias_recordatorio - Math.floor((today - last) / 86400000) <= 5;
  }).length;

  const navItems = [
    { to: "/", icon: "◉", label: "Dashboard" },
    { to: "/transacciones", icon: "⇄", label: "Transacciones" },
    { to: "/clientes", icon: "◎", label: "Clientes" },
    { to: "/reportes", icon: "▨", label: "Reportes" },
    {
      to: "/notificaciones",
      icon: "◈",
      label: "Notificaciones",
      badge: alertCount,
    },
    { to: "/configuracion", icon: "⚙", label: "Configuración" },
  ];

  return (
    <ToastContext.Provider value={toast}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          style={{
            width: 240,
            background: "#2d3a2e",
            borderRight: "1px solid #22301f",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 100,
          }}>
          <div
            style={{
              padding: "28px 24px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 22,
                fontWeight: 800,
                color: "#a8d98c",
              }}>
              Adobos Caseritos
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                marginTop: 4,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}>
              Gestión comercial
            </div>
          </div>

          <nav
            style={{
              flex: 1,
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 400,
                  textDecoration: "none",
                  border: "1px solid transparent",
                  transition: "all 0.15s",
                  background: isActive
                    ? "rgba(168,217,140,0.15)"
                    : "transparent",
                  color: isActive ? "#a8d98c" : "rgba(255,255,255,0.5)",
                  borderColor: isActive
                    ? "rgba(168,217,140,0.2)"
                    : "transparent",
                })}>
                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>
                  {item.icon}
                </span>
                {item.label}
                {item.badge > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "#c0392b",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 99,
                    }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              lineHeight: 1.6,
            }}>
            Conectado a Supabase
            <span
              style={{
                color: "rgba(168,217,140,0.5)",
                fontSize: 10,
                display: "block",
                marginTop: 4,
              }}>
              {clientes.length} clientes · {transacciones.length} transacciones
            </span>
          </div>
        </aside>

        <main style={{ marginLeft: 240, flex: 1, padding: "32px 36px" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transacciones" element={<Transacciones />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </main>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastContext.Provider>
  );
}

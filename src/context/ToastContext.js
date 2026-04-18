import { createContext, useContext } from "react";

export const ToastContext = createContext(null);

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useToastContext debe usarse dentro de ToastProvider");
  return ctx;
};

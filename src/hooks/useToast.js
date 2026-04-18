import { useState, useCallback } from "react";

let nextId = 1;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ type = "info", title, message, duration = 3500 }) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Atajos
  const toast = {
    success: (title, message) => addToast({ type: "success", title, message }),
    error: (title, message) => addToast({ type: "error", title, message }),
    warning: (title, message) => addToast({ type: "warning", title, message }),
    info: (title, message) => addToast({ type: "info", title, message }),
  };

  return { toasts, toast, removeToast };
}

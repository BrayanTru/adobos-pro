export const fmt = (v) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(v);

export const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const initials = (name) =>
  name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

export const daysDiff = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const then = new Date(dateStr + "T00:00:00");
  return Math.floor((today - then) / 86400000);
};

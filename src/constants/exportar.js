export const HOJAS_DISPONIBLES = [
  {
    id: "resumen",
    icon: "📊",
    nombre: "Resumen mensual",
    desc: "Ingresos, egresos, utilidad y unidades por mes",
  },
  {
    id: "ventas",
    icon: "🧾",
    nombre: "Detalle ventas",
    desc: "Cada venta con tamaños, cantidades y cliente",
  },
  {
    id: "egresos",
    icon: "📉",
    nombre: "Detalle egresos",
    desc: "Gastos por categoría con descripción",
  },
  {
    id: "clientes",
    icon: "👥",
    nombre: "Ventas por cliente",
    desc: "Ranking de clientes con totales por tamaño",
  },
  {
    id: "tamanos",
    icon: "🧂",
    nombre: "Adobos por tamaño",
    desc: "Unidades vendidas por tamaño y mes",
  },
];

export const TEMAS = {
  resumen: {
    header: "2D6A4F",
    headerText: "FFFFFF",
    altBg: "F0F7F3",
    totalBg: "C8E6C9",
    totalText: "1A3D2B",
  },
  ventas: {
    header: "1A4F8C",
    headerText: "FFFFFF",
    altBg: "EEF3FB",
    totalBg: "BBDEFB",
    totalText: "0D2B5C",
  },
  egresos: {
    header: "8C1A1A",
    headerText: "FFFFFF",
    altBg: "FBF0EE",
    totalBg: "FFCDD2",
    totalText: "5C0D0D",
  },
  clientes: {
    header: "5C1A8C",
    headerText: "FFFFFF",
    altBg: "F5EEF8",
    totalBg: "E1BEE7",
    totalText: "3D0D5C",
  },
  tamanos: {
    header: "8C4A1A",
    headerText: "FFFFFF",
    altBg: "FAF0E8",
    totalBg: "FFE0B2",
    totalText: "5C2E0D",
  },
};

export const CURRENCY_COLS = {
  resumen: ["Ingresos", "Egresos", "Utilidad neta"],
  ventas: ["Precio unitario", "Subtotal", "Total transacción"],
  egresos: ["Valor"],
  clientes: ["Total ventas"],
  tamanos: [],
};

export const NUMBER_COLS = {
  resumen: ["Unidades vendidas"],
  ventas: ["Cantidad"],
  egresos: [],
  clientes: [
    "Transacciones",
    "Unidades vendidas",
    "Personal",
    "Familiar",
    "Grande",
    "Institucional",
  ],
  tamanos: [
    "Personal (und)",
    "Familiar (und)",
    "Grande (und)",
    "Institucional (und)",
    "Total unidades",
  ],
};

export const TAMANOS = [
  { tamano: "Personal", gramos: 80, precio: 2000 },
  { tamano: "Familiar", gramos: 240, precio: 3900 },
  { tamano: "Grande", gramos: 500, precio: 8000 },
  { tamano: "Institucional", gramos: 1000, precio: 13000 },
];

export const TAMANO_LABELS = TAMANOS.reduce((acc, t) => {
  acc[t.tamano] = `${t.tamano} (${t.gramos}g)`;
  return acc;
}, {});

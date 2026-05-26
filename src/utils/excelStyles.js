import XLSXStyle from "xlsx-js-style";
import { TEMAS, CURRENCY_COLS, NUMBER_COLS } from "../constants/exportar";

const border = (color = "D0D0D0") => ({
  top: { style: "thin", color: { rgb: color } },
  bottom: { style: "thin", color: { rgb: color } },
  left: { style: "thin", color: { rgb: color } },
  right: { style: "thin", color: { rgb: color } },
});

const headerStyle = (tema) => ({
  font: { bold: true, color: { rgb: tema.headerText }, name: "Arial", sz: 11 },
  fill: {
    type: "pattern",
    patternType: "solid",
    fgColor: { rgb: tema.header },
  },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: {
    bottom: { style: "medium", color: { rgb: tema.header } },
    left: { style: "thin", color: { rgb: "FFFFFF" } },
    right: { style: "thin", color: { rgb: "FFFFFF" } },
  },
});

const normalStyle = (tema, esAlt) => ({
  font: { name: "Arial", sz: 10, color: { rgb: "1E1C18" } },
  fill: {
    type: "pattern",
    patternType: "solid",
    fgColor: { rgb: esAlt ? tema.altBg : "FFFFFF" },
  },
  alignment: { vertical: "center" },
  border: border(),
});

const totalStyle = (tema, isFirst) => ({
  font: { bold: true, name: "Arial", sz: 11, color: { rgb: tema.totalText } },
  fill: {
    type: "pattern",
    patternType: "solid",
    fgColor: { rgb: tema.totalBg },
  },
  alignment: { horizontal: isFirst ? "left" : "right", vertical: "center" },
  border: {
    top: { style: "medium", color: { rgb: tema.header } },
    bottom: { style: "medium", color: { rgb: tema.header } },
    left: { style: "thin", color: { rgb: tema.header } },
    right: { style: "thin", color: { rgb: tema.header } },
  },
});

const withCurrency = (base) => ({
  ...base,
  numFmt: '"$"#,##0;("$"#,##0);"-"',
  alignment: { ...base.alignment, horizontal: "right" },
});

const withNumber = (base) => ({
  ...base,
  alignment: { ...base.alignment, horizontal: "center" },
});

export const estilizarHoja = (ws, datos, hojaId) => {
  if (!ws["!ref"] || !datos.length) return;

  const tema = TEMAS[hojaId] || TEMAS.resumen;
  const range = XLSXStyle.utils.decode_range(ws["!ref"]);
  const cols = Object.keys(datos[0]);
  const ultimaFila = datos[datos.length - 1];
  const tieneTotal = ["TOTAL", "Total"].includes(String(ultimaFila?.Mes));
  const currencyCols = (CURRENCY_COLS[hojaId] || []).map((n) =>
    cols.indexOf(n),
  );
  const numberCols = (NUMBER_COLS[hojaId] || []).map((n) => cols.indexOf(n));

  for (let R = range.s.r; R <= range.e.r; R++) {
    const esHeader = R === 0;
    const esTotal = tieneTotal && R === range.e.r;
    const esAlt = !esHeader && !esTotal && R % 2 === 0;

    for (let C = range.s.c; C <= range.e.c; C++) {
      const addr = XLSXStyle.utils.encode_cell({ r: R, c: C });
      if (!ws[addr]) ws[addr] = { t: "s", v: "" };

      const esCurrency = currencyCols.includes(C) && !esHeader;
      const esNumber = numberCols.includes(C) && !esHeader;

      let estilo;
      if (esHeader) estilo = headerStyle(tema);
      else if (esTotal) estilo = totalStyle(tema, C === 0);
      else estilo = normalStyle(tema, esAlt);

      if (esCurrency) estilo = withCurrency(estilo);
      else if (esNumber) estilo = withNumber(estilo);

      ws[addr].s = estilo;
    }
  }

  ws["!rows"] = Array.from({ length: range.e.r + 1 }, (_, i) => ({
    hpt: i === 0 ? 34 : tieneTotal && i === range.e.r ? 26 : 20,
  }));
};

export const calcularAnchos = (datos) => {
  if (!datos.length) return [];
  return Object.keys(datos[0]).map((key) => ({
    wch: Math.min(
      42,
      Math.max(
        key.length + 3,
        ...datos.map((row) => String(row[key] ?? "").length + 1),
      ),
    ),
  }));
};

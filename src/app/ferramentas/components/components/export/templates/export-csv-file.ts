import * as XLSX from "xlsx";

export function exportarCsv(colunas: string[], dados: Record<string, any>[]) {
  const dadosFiltrados = dados.map((item) =>
    Object.fromEntries(colunas.map((col) => [col, item[col] ?? ""]))
  );
  const worksheet = XLSX.utils.json_to_sheet(dadosFiltrados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio");
  XLSX.writeFile(workbook, "relatorio.xlsx");
}

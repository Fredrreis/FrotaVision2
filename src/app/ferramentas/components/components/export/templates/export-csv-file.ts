import * as XLSX from "xlsx";

export function exportarCsv(
  colunasSelecionadas: string[],
  dados: Record<string, any>[],
  mapeamentoCampos: Record<string, string>
) {
  const camposSelecionados = colunasSelecionadas.map((col) => mapeamentoCampos[col]);
  const linhas = dados.map((item) =>
    camposSelecionados.map((chave) => item[chave] ?? "")
  );

  const aoa = [colunasSelecionadas, ...linhas];
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio");
  XLSX.writeFile(workbook, "relatorio.xlsx");
}

import * as XLSX from "xlsx";

export function exportarCsv(colunasSelecionadas: string[], dados: Record<string, any>[]) {
  const mapeamentoCampos: Record<string, string> = {
    Placa: "placa",
    Nome: "nome",
    "Tipo Caminhão": "tipo",
    Chassi: "chassi",
    Descrição: "descricao",
    Km: "km",
    Ano: "ano",
    Data: "data",
  };

  // Apenas os campos que foram selecionados
  const camposSelecionados = colunasSelecionadas.map(col => mapeamentoCampos[col]);

  const linhas = dados.map((item) =>
    camposSelecionados.map((chave) => item[chave] ?? "")
  );

  const aoa = [colunasSelecionadas, ...linhas]; // Primeira linha: títulos visíveis
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio");
  XLSX.writeFile(workbook, "relatorio.xlsx");
}

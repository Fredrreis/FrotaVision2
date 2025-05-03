import jsPDF from "jspdf";

export function exportarPdf(colunas: string[], dados: Record<string, any>[]) {
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

  const campos = colunas.map((col) => ({
    label: col,
    key: mapeamentoCampos[col],
  }));

  const doc = new jsPDF();
  let y = 15;
  const margemLabel = 10;
  const margemValor = 60; // maior espaçamento horizontal entre label e valor

  dados.forEach((item, index) => {
    campos.forEach(({ label, key }) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, margemLabel, y);
      doc.setFont("helvetica", "normal");
      const valor = String(item[key] ?? "");
      doc.text(valor, margemValor, y);
      y += 8; // linha mais espaçada
    });

    y += 5;
    doc.setLineWidth(0.1);
    doc.line(margemLabel, y, 200, y);
    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 15;
    }
  });

  doc.save("relatorio.pdf");
}

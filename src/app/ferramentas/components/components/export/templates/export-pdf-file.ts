import jsPDF from "jspdf";

export function exportarPdf(
  colunas: string[],
  dados: Record<string, unknown>[],
  mapeamentoCampos: Record<string, string>
) {
  const campos = colunas.map((col) => ({
    label: col,
    key: mapeamentoCampos[col],
  }));

  const doc = new jsPDF();
  let y = 15;
  const margemLabel = 10;
  const margemValor = 90;

  dados.forEach((item) => {
    campos.forEach(({ label, key }) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, margemLabel, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(item[key] ?? ""), margemValor, y);
      y += 8;
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

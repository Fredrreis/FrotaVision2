import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportarPdf(colunas: string[], dados: Record<string, any>[]) {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [colunas],
    body: dados.map((item) => colunas.map((col) => item[col] ?? "")),
  });
  doc.save("relatorio.pdf");
}

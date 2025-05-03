import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";

export async function exportarDocx(colunas: string[], dados: Record<string, any>[]) {
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

  const campos = colunas.map((col) => ({ label: col, key: mapeamentoCampos[col] }));

  const paragraphs: Paragraph[] = [];

  dados.forEach((item, index) => {
    campos.forEach(({ label, key }) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${label}: `, bold: true }),
            new TextRun({ text: String(item[key] ?? "") }),
          ],
        })
      );
    });

    if (index < dados.length - 1) {
      paragraphs.push(new Paragraph({ text: "—".repeat(40) }));
    }
  });

  const doc = new Document({
    sections: [{ children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "relatorio.docx");
}

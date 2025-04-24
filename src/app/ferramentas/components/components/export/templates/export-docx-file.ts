import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
  } from "docx";
  import { saveAs } from "file-saver";
  
  export async function exportarDocx(colunas: string[], dados: Record<string, any>[]) {
    const tableRows = [
      new TableRow({
        children: colunas.map(
          (col) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: col, bold: true })] })],
            })
        ),
      }),
      ...dados.map(
        (item) =>
          new TableRow({
            children: colunas.map(
              (col) =>
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun(String(item[col] ?? ""))] })],
                })
            ),
          })
      ),
    ];
  
    const doc = new Document({
      sections: [{ children: [new Table({ rows: tableRows })] }],
    });
  
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "relatorio.docx");
  }
  
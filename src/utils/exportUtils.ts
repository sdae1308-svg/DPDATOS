import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import jsPDF from 'jspdf';

// ============ EXPORTAR A EXCEL ============
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Datos') {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
}

export function exportMultipleSheets(sheets: { name: string; data: any[] }[], filename: string) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(sheet => {
    const ws = XLSX.utils.json_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
}

// ============ IMPORTAR DESDE EXCEL ============
export function importFromExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function importMultipleSheets(file: File): Promise<Record<string, any[]>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const result: Record<string, any[]> = {};
        workbook.SheetNames.forEach(name => {
          result[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
        });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ============ EXPORTAR A WORD ============
export async function exportToWord(title: string, content: { heading?: string; text: string }[], filename: string) {
  const children: Paragraph[] = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Generado: ${new Date().toLocaleDateString('es-EC')}`, italics: true, size: 20 })],
      spacing: { after: 400 },
    }),
  ];

  content.forEach(item => {
    if (item.heading) {
      children.push(new Paragraph({
        text: item.heading,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }));
    }
    children.push(new Paragraph({
      children: [new TextRun({ text: item.text, size: 22 })],
      spacing: { after: 100 },
    }));
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

// ============ EXPORTAR A PDF ============
export function exportToPDF(title: string, content: { heading?: string; text: string }[], filename: string, companyInfo?: string) {
  const pdf = new jsPDF();
  let y = 20;

  pdf.setFontSize(16);
  pdf.text(title, 20, y);
  y += 10;

  if (companyInfo) {
    pdf.setFontSize(10);
    pdf.text(companyInfo, 20, y);
    y += 7;
  }

  pdf.setFontSize(9);
  pdf.text(`Fecha: ${new Date().toLocaleDateString('es-EC')}`, 20, y);
  y += 10;
  pdf.line(20, y, 190, y);
  y += 8;

  pdf.setFontSize(10);
  content.forEach(item => {
    if (item.heading) {
      if (y > 270) { pdf.addPage(); y = 20; }
      pdf.setFontSize(12);
      pdf.text(item.heading, 20, y);
      y += 7;
      pdf.setFontSize(10);
    }
    const lines = pdf.splitTextToSize(item.text, 170);
    lines.forEach((line: string) => {
      if (y > 280) { pdf.addPage(); y = 20; }
      pdf.text(line, 20, y);
      y += 5;
    });
    y += 3;
  });

  pdf.save(`${filename}.pdf`);
}

// ============ EXPORTAR A JSON ============
export function exportToJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
}

// ============ EXPORTAR A CSV ============
export function exportToCSV(data: any[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
}

import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx';
import { saveAs } from 'file-saver';

interface AuditReport {
  company: any;
  auditType: string;
  auditDate: string;
  auditor: string;
  criteria: any[];
  evaluations: Record<string, { cumplimiento: string; evidencia: string; observaciones: string }>;
  score: number;
  hallazgos: any[];
}

// ============ GENERAR REPORTE PDF ============
export async function generateAuditReportPDF(report: AuditReport) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // PORTADA
  pdf.setFillColor(41, 128, 185);
  pdf.rect(0, 0, pageWidth, 100, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.text('INFORME DE AUDITORÍA', pageWidth / 2, 40, { align: 'center' });
  
  pdf.setFontSize(18);
  pdf.text(report.auditType, pageWidth / 2, 55, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(report.company.nombreComercial, pageWidth / 2, 70, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text(`Fecha: ${report.auditDate}`, pageWidth / 2, 85, { align: 'center' });

  pdf.setTextColor(0, 0, 0);
  y = 120;

  // INFORMACIÓN GENERAL
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('1. INFORMACIÓN GENERAL', margin, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const infoItems = [
    ['Empresa:', report.company.razonSocial],
    ['RUC:', report.company.ruc],
    ['Tipo de Auditoría:', report.auditType],
    ['Fecha de Auditoría:', report.auditDate],
    ['Auditor:', report.auditor || 'No especificado'],
    ['Alcance:', `Evaluación de cumplimiento de ${report.auditType}`],
  ];

  infoItems.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 40, y);
    y += 6;
  });

  y += 10;

  // RESUMEN EJECUTIVO
  if (y > 250) { pdf.addPage(); y = 20; }
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. RESUMEN EJECUTIVO', margin, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const totalCriteria = report.criteria.length;
  const evaluated = report.criteria.filter(c => report.evaluations[c.id]?.cumplimiento);
  const cumple = evaluated.filter(c => report.evaluations[c.id].cumplimiento === 'Cumple').length;
  const parcial = evaluated.filter(c => report.evaluations[c.id].cumplimiento === 'Cumple Parcial').length;
  const noCumple = evaluated.filter(c => report.evaluations[c.id].cumplimiento === 'No Cumple').length;

  const resumen = [
    `Se evaluaron ${totalCriteria} criterios de cumplimiento de ${report.auditType}.`,
    `De los criterios evaluados (${evaluated.length}), se obtuvo:`,
    `  • Cumple: ${cumple} criterios (${Math.round(cumple/evaluated.length*100)}%)`,
    `  • Cumple Parcial: ${parcial} criterios (${Math.round(parcial/evaluated.length*100)}%)`,
    `  • No Cumple: ${noCumple} criterios (${Math.round(noCumple/evaluated.length*100)}%)`,
    ``,
    `Score de Cumplimiento: ${report.score}%`,
    ``,
    `Se identificaron ${report.hallazgos.length} hallazgos que requieren atención:`
  ];

  resumen.forEach(line => {
    if (y > 280) { pdf.addPage(); y = 20; }
    pdf.text(line, margin, y);
    y += 5;
  });

  y += 5;

  // ANÁLISIS POR CATEGORÍAS
  if (y > 240) { pdf.addPage(); y = 20; }
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('3. ANÁLISIS POR CATEGORÍAS', margin, y);
  y += 10;

  const categories = [...new Set(report.criteria.map(c => c.category))];
  
  categories.forEach(category => {
    if (y > 260) { pdf.addPage(); y = 20; }
    
    const categoryCriteria = report.criteria.filter(c => c.category === category);
    const categoryEvaluated = categoryCriteria.filter(c => report.evaluations[c.id]?.cumplimiento);
    const categoryCumple = categoryEvaluated.filter(c => report.evaluations[c.id].cumplimiento === 'Cumple').length;
    const categoryParcial = categoryEvaluated.filter(c => report.evaluations[c.id].cumplimiento === 'Cumple Parcial').length;
    const categoryScore = categoryEvaluated.length > 0 ? Math.round(((categoryCumple + categoryParcial * 0.5) / categoryEvaluated.length) * 100) : 0;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(category, margin, y);
    y += 6;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Score: ${categoryScore}% | Evaluados: ${categoryEvaluated.length}/${categoryCriteria.length}`, margin, y);
    y += 5;

    // Barra de progreso
    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, y, 100, 3, 'F');
    const barColor = categoryScore >= 80 ? [46, 204, 113] : categoryScore >= 60 ? [241, 196, 15] : [231, 76, 60];
    pdf.setFillColor(barColor[0], barColor[1], barColor[2]);
    pdf.rect(margin, y, categoryScore, 3, 'F');
    y += 8;
  });

  y += 10;

  // DETALLE DE HALLAZGOS
  if (y > 240) { pdf.addPage(); y = 20; }
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('4. DETALLE DE HALLAZGOS', margin, y);
  y += 10;

  if (report.hallazgos.length === 0) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('No se identificaron hallazgos. ¡Excelente cumplimiento!', margin, y);
    y += 10;
  } else {
    report.hallazgos.forEach((hallazgo, idx) => {
      if (y > 260) { pdf.addPage(); y = 20; }
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${idx + 1}. ${hallazgo.descripcion}`, margin, y);
      y += 5;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Severidad: ${hallazgo.severidad}`, margin, y);
      y += 4;
      
      if (hallazgo.recomendacion) {
        pdf.text(`Recomendación: ${hallazgo.recomendacion}`, margin, y);
        y += 4;
      }
      
      y += 3;
    });
  }

  // CONCLUSIONES Y RECOMENDACIONES
  if (y > 230) { pdf.addPage(); y = 20; }
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('5. CONCLUSIONES Y RECOMENDACIONES', margin, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  let conclusion = '';
  if (report.score >= 80) {
    conclusion = 'La organización demuestra un alto nivel de cumplimiento con los requisitos evaluados. Se recomienda mantener los controles implementados y continuar con la mejora continua.';
  } else if (report.score >= 60) {
    conclusion = 'La organización cumple parcialmente con los requisitos evaluados. Se requiere implementar acciones correctivas para abordar los hallazgos identificados y mejorar el nivel de cumplimiento.';
  } else {
    conclusion = 'La organización presenta deficiencias significativas en el cumplimiento de los requisitos evaluados. Se requiere un plan de acción urgente para abordar las no conformidades críticas y evitar riesgos regulatorios.';
  }

  const conclusionLines = pdf.splitTextToSize(conclusion, pageWidth - 2 * margin);
  conclusionLines.forEach((line: string) => {
    if (y > 280) { pdf.addPage(); y = 20; }
    pdf.text(line, margin, y);
    y += 5;
  });

  y += 10;

  // PRIORIDADES
  if (report.hallazgos.length > 0) {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Prioridades de Acción:', margin, y);
    y += 6;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    const criticos = report.hallazgos.filter(h => h.severidad === 'Crítico');
    const mayores = report.hallazgos.filter(h => h.severidad === 'Mayor');
    const menores = report.hallazgos.filter(h => h.severidad === 'Menor');

    if (criticos.length > 0) {
      pdf.text(`• Atención inmediata: ${criticos.length} hallazgo(s) crítico(s)`, margin, y);
      y += 5;
    }
    if (mayores.length > 0) {
      pdf.text(`• Alta prioridad: ${mayores.length} hallazgo(s) mayor(es)`, margin, y);
      y += 5;
    }
    if (menores.length > 0) {
      pdf.text(`• Prioridad media: ${menores.length} hallazgo(s) menor(es)`, margin, y);
      y += 5;
    }
  }

  // PIE DE PÁGINA
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    pdf.text('Confidencial - Uso Interno', margin, 290);
    pdf.text(report.company.nombreComercial, pageWidth - margin, 290, { align: 'right' });
  }

  pdf.save(`Informe_Auditoria_${report.auditType.replace(/\s+/g, '_')}_${report.auditDate}.pdf`);
}

// ============ GENERAR REPORTE WORD ============
export async function generateAuditReportWord(report: AuditReport) {
  const children: Paragraph[] = [];

  // PORTADA
  children.push(
    new Paragraph({ text: '', spacing: { before: 2000 } }),
    new Paragraph({
      text: 'INFORME DE AUDITORÍA',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: report.auditType,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: report.company.nombreComercial, bold: true, size: 28 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Fecha: ${report.auditDate}`, size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // INFORMACIÓN GENERAL
  children.push(
    new Paragraph({
      text: '1. INFORMACIÓN GENERAL',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Empresa: ', bold: true, size: 22 }),
        new TextRun({ text: report.company.razonSocial, size: 22 }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'RUC: ', bold: true, size: 22 }),
        new TextRun({ text: report.company.ruc, size: 22 }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Tipo de Auditoría: ', bold: true, size: 22 }),
        new TextRun({ text: report.auditType, size: 22 }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Fecha de Auditoría: ', bold: true, size: 22 }),
        new TextRun({ text: report.auditDate, size: 22 }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Auditor: ', bold: true, size: 22 }),
        new TextRun({ text: report.auditor || 'No especificado', size: 22 }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Alcance: ', bold: true, size: 22 }),
        new TextRun({ text: `Evaluación de cumplimiento de ${report.auditType}`, size: 22 }),
      ],
      spacing: { after: 400 },
    })
  );

  // RESUMEN EJECUTIVO
  const totalCriteria = report.criteria.length;
  const evaluated = report.criteria.filter(c => report.evaluations[c.id]?.cumplimiento);
  const cumple = evaluated.filter(c => report.evaluations[c.id].cumplimiento === 'Cumple').length;
  const parcial = evaluated.filter(c => report.evaluations[c.id].cumplimiento === 'Cumple Parcial').length;
  const noCumple = evaluated.filter(c => report.evaluations[c.id].cumplimiento === 'No Cumple').length;

  children.push(
    new Paragraph({
      text: '2. RESUMEN EJECUTIVO',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Se evaluaron ${totalCriteria} criterios de cumplimiento de ${report.auditType}.`, size: 22 })],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'De los criterios evaluados, se obtuvo:', size: 22, bold: true })],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `  • Cumple: ${cumple} criterios (${evaluated.length > 0 ? Math.round(cumple/evaluated.length*100) : 0}%)`, size: 22 })],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `  • Cumple Parcial: ${parcial} criterios (${evaluated.length > 0 ? Math.round(parcial/evaluated.length*100) : 0}%)`, size: 22 })],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `  • No Cumple: ${noCumple} criterios (${evaluated.length > 0 ? Math.round(noCumple/evaluated.length*100) : 0}%)`, size: 22 })],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Score de Cumplimiento: ', size: 24, bold: true }),
        new TextRun({ text: `${report.score}%`, size: 28, bold: true, color: report.score >= 80 ? '2ECC71' : report.score >= 60 ? 'F1C40F' : 'E74C3C' }),
      ],
      spacing: { after: 200 },
    })
  );

  // ANÁLISIS POR CATEGORÍAS
  children.push(
    new Paragraph({
      text: '3. ANÁLISIS POR CATEGORÍAS',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    })
  );

  const categories = [...new Set(report.criteria.map(c => c.category))];
  
  categories.forEach(category => {
    const categoryCriteria = report.criteria.filter(c => c.category === category);
    const categoryEvaluated = categoryCriteria.filter(c => report.evaluations[c.id]?.cumplimiento);
    const categoryCumple = categoryEvaluated.filter(c => report.evaluations[c.id].cumplimiento === 'Cumple').length;
    const categoryParcial = categoryEvaluated.filter(c => report.evaluations[c.id].cumplimiento === 'Cumple Parcial').length;
    const categoryScore = categoryEvaluated.length > 0 ? Math.round(((categoryCumple + categoryParcial * 0.5) / categoryEvaluated.length) * 100) : 0;

    children.push(
      new Paragraph({
        text: category,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Score: ${categoryScore}% | `, size: 22 }),
          new TextRun({ text: `Evaluados: ${categoryEvaluated.length}/${categoryCriteria.length}`, size: 22 }),
        ],
        spacing: { after: 100 },
      })
    );
  });

  // DETALLE DE HALLAZGOS
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      text: '4. DETALLE DE HALLAZGOS',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    })
  );

  if (report.hallazgos.length === 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'No se identificaron hallazgos. ¡Excelente cumplimiento!', italics: true, size: 22 })],
        spacing: { after: 200 },
      })
    );
  } else {
    report.hallazgos.forEach((hallazgo, idx) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${idx + 1}. ${hallazgo.descripcion}`, bold: true, size: 22 })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Severidad: ${hallazgo.severidad}`, size: 22 })],
          spacing: { after: 50 },
        })
      );

      if (hallazgo.recomendacion) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `Recomendación: ${hallazgo.recomendacion}`, size: 22, italics: true })],
            spacing: { after: 200 },
          })
        );
      } else {
        children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
      }
    });
  }

  // CONCLUSIONES Y RECOMENDACIONES
  children.push(
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      text: '5. CONCLUSIONES Y RECOMENDACIONES',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    })
  );

  let conclusion = '';
  if (report.score >= 80) {
    conclusion = 'La organización demuestra un alto nivel de cumplimiento con los requisitos evaluados. Se recomienda mantener los controles implementados y continuar con la mejora continua.';
  } else if (report.score >= 60) {
    conclusion = 'La organización cumple parcialmente con los requisitos evaluados. Se requiere implementar acciones correctivas para abordar los hallazgos identificados y mejorar el nivel de cumplimiento.';
  } else {
    conclusion = 'La organización presenta deficiencias significativas en el cumplimiento de los requisitos evaluados. Se requiere un plan de acción urgente para abordar las no conformidades críticas y evitar riesgos regulatorios.';
  }

  children.push(
    new Paragraph({
      children: [new TextRun({ text: conclusion, size: 22 })],
      spacing: { after: 300 },
    })
  );

  // PRIORIDADES
  if (report.hallazgos.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Prioridades de Acción:', bold: true, size: 24 })],
        spacing: { after: 100 },
      })
    );

    const criticos = report.hallazgos.filter(h => h.severidad === 'Crítico');
    const mayores = report.hallazgos.filter(h => h.severidad === 'Mayor');
    const menores = report.hallazgos.filter(h => h.severidad === 'Menor');

    if (criticos.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: `• Atención inmediata: ${criticos.length} hallazgo(s) crítico(s)`, size: 22, color: 'E74C3C' })],
        spacing: { after: 50 },
      }));
    }
    if (mayores.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: `• Alta prioridad: ${mayores.length} hallazgo(s) mayor(es)`, size: 22, color: 'F39C12' })],
        spacing: { after: 50 },
      }));
    }
    if (menores.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: `• Prioridad media: ${menores.length} hallazgo(s) menor(es)`, size: 22, color: 'F1C40F' })],
        spacing: { after: 200 },
      }));
    }
  }

  // CREAR DOCUMENTO
  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Informe_Auditoria_${report.auditType.replace(/\s+/g, '_')}_${report.auditDate}.docx`);
}



import { useState } from 'react';
import { useStore } from '../store/store';
import type { Document } from '../data/demoData';
import jsPDF from 'jspdf';

export default function DocumentsModule() {
  const { documents, company } = useStore();
  const [filter, setFilter] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [selected, setSelected] = useState<Document | null>(null);

  const tipos = [...new Set(documents.map(d => d.tipo))];
  const filtered = documents.filter(d => {
    const matchName = d.nombre.toLowerCase().includes(filter.toLowerCase());
    const matchTipo = !filterTipo || d.tipo === filterTipo;
    return matchName && matchTipo;
  });

  const exportPDF = (doc: Document) => {
    const pdf = new jsPDF();
    pdf.setFontSize(14);
    pdf.text(doc.nombre, 20, 20);
    pdf.setFontSize(10);
    pdf.text(`Empresa: ${company.razonSocial}`, 20, 30);
    pdf.text(`Versión: ${doc.version}`, 20, 37);
    pdf.text(`Fecha emisión: ${doc.fechaEmision}`, 20, 44);
    pdf.text(`Responsable: ${doc.responsable}`, 20, 51);
    pdf.text(`Estado: ${doc.estado}`, 20, 58);
    pdf.line(20, 62, 190, 62);
    pdf.setFontSize(9);
    const lines = pdf.splitTextToSize(doc.contenido, 170);
    pdf.text(lines, 20, 70);
    pdf.save(`${doc.nombre.replace(/\s+/g, '_')}.pdf`);
  };

  const tipoIcon = (t: string) => {
    switch (t) {
      case 'Política': return 'fa-shield-halved text-blue-600';
      case 'Consentimiento': return 'fa-file-signature text-green-600';
      case 'Registro': return 'fa-clipboard-list text-purple-600';
      case 'Aviso': return 'fa-bullhorn text-amber-600';
      case 'Informe': return 'fa-file-lines text-indigo-600';
      default: return 'fa-file text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4 flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Buscar documento..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 min-w-48 border rounded px-3 py-2 text-sm" />
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="border rounded px-3 py-2 text-sm">
          <option value="">Todos los tipos</option>
          {tipos.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tipos.map(t => (
          <div key={t} className="bg-white rounded-lg border p-3 text-center">
            <i className={`fas ${tipoIcon(t)} text-xl mb-1`}></i>
            <p className="text-xl font-bold">{documents.filter(d => d.tipo === t).length}</p>
            <p className="text-xs text-gray-500">{t}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                  <i className={`fas ${tipoIcon(doc.tipo)} text-lg`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-800 truncate">{doc.nombre}</h4>
                  <p className="text-xs text-gray-500">v{doc.version} | {doc.tipo}</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Emisión:</span><span>{doc.fechaEmision}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Revisión:</span><span>{doc.fechaRevision}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Responsable:</span><span className="truncate ml-2">{doc.responsable}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Estado:</span>
                <span className={`px-2 py-0.5 rounded ${doc.estado === 'Vigente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{doc.estado}</span>
              </div>
            </div>
            <div className="p-3 border-t flex gap-2">
              <button onClick={() => setSelected(doc)} className="flex-1 px-2 py-1.5 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100">
                <i className="fas fa-eye mr-1"></i>Ver
              </button>
              <button onClick={() => exportPDF(doc)} className="flex-1 px-2 py-1.5 bg-red-50 text-red-700 rounded text-xs hover:bg-red-100">
                <i className="fas fa-file-pdf mr-1"></i>PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{selected.nombre}</h3>
                  <p className="text-sm text-gray-500">v{selected.version} | {selected.tipo} | {selected.estado}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><span className="text-gray-500">Emisión:</span> <span>{selected.fechaEmision}</span></div>
                <div><span className="text-gray-500">Revisión:</span> <span>{selected.fechaRevision}</span></div>
                <div><span className="text-gray-500">Responsable:</span> <span>{selected.responsable}</span></div>
                <div><span className="text-gray-500">Empresa:</span> <span>{company.nombreComercial}</span></div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-4">
                <p className="text-xs text-amber-700"><i className="fas fa-exclamation-triangle mr-1"></i>BORRADOR EDITABLE - Sujeto a validación jurídica y técnica</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-xs whitespace-pre-wrap font-sans text-gray-700">{selected.contenido}</pre>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => exportPDF(selected)} className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                  <i className="fas fa-file-pdf mr-1"></i>Exportar PDF
                </button>
                <button onClick={() => window.print()} className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300">
                  <i className="fas fa-print mr-1"></i>Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

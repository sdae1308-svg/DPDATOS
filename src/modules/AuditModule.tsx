import { useState } from 'react';
import { useStore } from '../store/store';
import type { Audit } from '../data/demoData';

export default function AuditModule() {
  const { audits } = useStore();
  const [selected, setSelected] = useState<Audit | null>(null);
  const [tab, setTab] = useState<'list' | 'summary'>('list');

  const totalHallazgos = audits.reduce((a, b) => a + b.hallazgos.length, 0);
  const hallazgosAbiertos = audits.reduce((a, b) => a + b.hallazgos.filter(h => h.estado === 'Abierto').length, 0);
  const hallazgosRemedicion = audits.reduce((a, b) => a + b.hallazgos.filter(h => h.estado === 'En remedición').length, 0);
  const hallazgosVencidos = audits.reduce((a, b) => a + b.hallazgos.filter(h => h.estado === 'Vencido').length, 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('list')} className={`px-4 py-2 rounded text-sm font-medium ${tab === 'list' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Auditorías</button>
        <button onClick={() => setTab('summary')} className={`px-4 py-2 rounded text-sm font-medium ${tab === 'summary' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Resumen de Hallazgos</button>
      </div>

      {tab === 'list' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-blue-600">{audits.length}</p><p className="text-xs text-gray-500">Auditorías</p></div>
            <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-gray-600">{totalHallazgos}</p><p className="text-xs text-gray-500">Total Hallazgos</p></div>
            <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-amber-600">{hallazgosAbiertos}</p><p className="text-xs text-gray-500">Abiertos</p></div>
            <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-blue-600">{hallazgosRemedicion}</p><p className="text-xs text-gray-500">En Remedición</p></div>
            <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-red-600">{hallazgosVencidos}</p><p className="text-xs text-gray-500">Vencidos</p></div>
          </div>

          <div className="space-y-4">
            {audits.map(audit => (
              <div key={audit.id} className="bg-white rounded-lg border overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{audit.nombre}</h4>
                    <p className="text-xs text-gray-500">{audit.tipo} | Auditor: {audit.auditor} | {audit.fechaInicio} → {audit.fechaFin}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{audit.scoring}</p>
                      <p className="text-[10px] text-gray-500">Score</p>
                    </div>
                    <button onClick={() => setSelected(audit)} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      <i className="fas fa-eye mr-1"></i>Detalle
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 mb-2">CRITERIOS EVALUADOS</h5>
                      <div className="space-y-1">
                        {audit.criterios.map(c => (
                          <div key={c.id} className="flex items-center gap-2 text-xs">
                            <span className={`w-2 h-2 rounded-full ${c.cumplimiento === 'Cumple' ? 'bg-green-500' : c.cumplimiento === 'Cumple parcial' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                            <span className="flex-1 truncate">{c.descripcion}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${c.cumplimiento === 'Cumple' ? 'bg-green-100 text-green-700' : c.cumplimiento === 'Cumple parcial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{c.cumplimiento}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-gray-500 mb-2">HALLAZGOS ({audit.hallazgos.length})</h5>
                      <div className="space-y-1">
                        {audit.hallazgos.map(h => (
                          <div key={h.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded px-2 py-1.5">
                            <span className={`w-2 h-2 rounded-full ${h.severidad === 'Crítico' ? 'bg-red-500' : h.severidad === 'Mayor' ? 'bg-orange-500' : 'bg-yellow-500'}`}></span>
                            <span className="flex-1 truncate">{h.descripcion}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${h.estado === 'Abierto' ? 'bg-red-100 text-red-700' : h.estado === 'Vencido' ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-700'}`}>{h.estado}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'summary' && (
        <div className="bg-white rounded-lg border p-4">
          <h4 className="font-semibold text-gray-700 mb-4">Resumen Consolidado de Hallazgos</h4>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Descripción</th>
                <th className="text-center px-4 py-2">Severidad</th>
                <th className="text-left px-4 py-2">Responsable</th>
                <th className="text-center px-4 py-2">Compromiso</th>
                <th className="text-center px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {audits.flatMap(a => a.hallazgos).map(h => (
                <tr key={h.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-xs">{h.id}</td>
                  <td className="px-4 py-2 text-xs">{h.descripcion}</td>
                  <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs text-white ${h.severidad === 'Crítico' ? 'bg-red-500' : h.severidad === 'Mayor' ? 'bg-orange-500' : 'bg-yellow-500'}`}>{h.severidad}</span></td>
                  <td className="px-4 py-2 text-xs">{h.responsable}</td>
                  <td className="px-4 py-2 text-center text-xs">{h.fechaCompromiso}</td>
                  <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs ${h.estado === 'Abierto' ? 'bg-red-100 text-red-700' : h.estado === 'Vencido' ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-700'}`}>{h.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{selected.nombre}</h3>
                <p className="text-sm text-gray-500">{selected.tipo} | Score: {selected.scoring}/100</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="mb-4 text-sm text-gray-600">
              <p><strong>Auditor:</strong> {selected.auditor}</p>
              <p><strong>Período:</strong> {selected.fechaInicio} → {selected.fechaFin}</p>
              <p><strong>Alcance:</strong> {selected.alcance}</p>
            </div>
            <h4 className="font-semibold text-sm mb-2">Criterios de Evaluación</h4>
            <div className="space-y-2 mb-4">
              {selected.criterios.map(c => (
                <div key={c.id} className="border rounded p-3 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{c.id}: {c.descripcion}</span>
                    <span className={`px-2 py-0.5 rounded ${c.cumplimiento === 'Cumple' ? 'bg-green-100 text-green-700' : c.cumplimiento === 'Cumple parcial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{c.cumplimiento}</span>
                  </div>
                  <p className="text-gray-500"><strong>Evidencia:</strong> {c.evidencia}</p>
                  {c.hallazgo !== 'Sin hallazgos' && <p className="text-orange-600"><strong>Hallazgo:</strong> {c.hallazgo}</p>}
                  {c.recomendacion !== 'Mantener revisión anual' && <p className="text-blue-600"><strong>Recomendación:</strong> {c.recomendacion}</p>}
                </div>
              ))}
            </div>
            <h4 className="font-semibold text-sm mb-2">Plan de Acción</h4>
            <table className="w-full text-xs">
              <thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Hallazgo</th><th className="text-center px-3 py-2">Severidad</th><th className="text-left px-3 py-2">Responsable</th><th className="text-center px-3 py-2">Fecha</th><th className="text-center px-3 py-2">Estado</th></tr></thead>
              <tbody>
                {selected.hallazgos.map(h => (
                  <tr key={h.id} className="border-t">
                    <td className="px-3 py-2">{h.descripcion}</td>
                    <td className="px-3 py-2 text-center"><span className={`px-1.5 py-0.5 rounded text-white ${h.severidad === 'Crítico' ? 'bg-red-500' : h.severidad === 'Mayor' ? 'bg-orange-500' : 'bg-yellow-500'}`}>{h.severidad}</span></td>
                    <td className="px-3 py-2">{h.responsable}</td>
                    <td className="px-3 py-2 text-center">{h.fechaCompromiso}</td>
                    <td className="px-3 py-2 text-center"><span className={`px-1.5 py-0.5 rounded ${h.estado === 'Abierto' ? 'bg-red-100 text-red-700' : h.estado === 'Vencido' ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-700'}`}>{h.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

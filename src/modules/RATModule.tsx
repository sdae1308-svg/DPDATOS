import { useState } from 'react';
import { useStore } from '../store/store';
import type { RAT } from '../data/demoData';

export default function RATModule() {
  const { rats } = useStore();
  const [filter, setFilter] = useState('');
  const [filterBase, setFilterBase] = useState('');
  const [filterRiesgo, setFilterRiesgo] = useState('');
  const [selected, setSelected] = useState<RAT | null>(null);

  const bases = [...new Set(rats.map(r => r.baseLegitimadora))];
  const filtered = rats.filter(r => {
    const matchName = r.nombre.toLowerCase().includes(filter.toLowerCase());
    const matchBase = !filterBase || r.baseLegitimadora === filterBase;
    const matchRiesgo = !filterRiesgo || r.nivelRiesgo === filterRiesgo;
    return matchName && matchBase && matchRiesgo;
  });

  const riesgoColor = (n: string) => n === 'Alto' ? 'bg-red-500' : n === 'Medio' ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4 flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Buscar tratamiento..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 min-w-48 border rounded px-3 py-2 text-sm" />
        <select value={filterBase} onChange={e => setFilterBase(e.target.value)} className="border rounded px-3 py-2 text-sm">
          <option value="">Todas las bases jurídicas</option>
          {bases.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={filterRiesgo} onChange={e => setFilterRiesgo(e.target.value)} className="border rounded px-3 py-2 text-sm">
          <option value="">Todos los niveles</option>
          <option value="Alto">Alto</option><option value="Medio">Medio</option><option value="Bajo">Bajo</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-blue-600">{rats.length}</p><p className="text-xs text-gray-500">Tratamientos</p></div>
        <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-red-600">{rats.filter(r => r.nivelRiesgo === 'Alto').length}</p><p className="text-xs text-gray-500">Alto Riesgo</p></div>
        <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-green-600">{rats.filter(r => r.estado === 'Vigente').length}</p><p className="text-xs text-gray-500">Vigentes</p></div>
        <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-purple-600">{rats.filter(r => r.decisionesAutomatizadas).length}</p><p className="text-xs text-gray-500">Dec. Automatizadas</p></div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Unidad</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Base Jurídica</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Riesgo</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-xs">{r.nombre.length > 40 ? r.nombre.substring(0, 40) + '...' : r.nombre}</td>
                  <td className="px-4 py-3 text-xs">{r.unidadResponsable}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{r.baseLegitimadora}</span></td>
                  <td className="px-4 py-3 text-center"><span className={`w-3 h-3 ${riesgoColor(r.nivelRiesgo)} rounded-full inline-block`}></span> <span className="text-xs">{r.nivelRiesgo}</span></td>
                  <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{r.estado}</span></td>
                  <td className="px-4 py-3 text-center"><button onClick={() => setSelected(r)} className="text-blue-600 hover:text-blue-800"><i className="fas fa-eye"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div><h3 className="text-lg font-bold">{selected.nombre}</h3><p className="text-sm text-gray-500">{selected.id} | {selected.unidadResponsable}</p></div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div><span className="text-gray-500">Responsable:</span> <span className="font-medium">{selected.responsableTratamiento}</span></div>
                <div><span className="text-gray-500">Encargado:</span> <span className="font-medium">{selected.encargadoTratamiento}</span></div>
                <div><span className="text-gray-500">DPO:</span> <span className="font-medium">{selected.delegadoProteccionDatos}</span></div>
                <div><span className="text-gray-500">Base Jurídica:</span> <span className="font-medium">{selected.baseLegitimadora}</span></div>
                <div><span className="text-gray-500">Finalidad:</span> <p className="text-xs mt-1 bg-gray-50 p-2 rounded">{selected.finalidad}</p></div>
                <div><span className="text-gray-500">Plazo Conservación:</span> <span className="font-medium">{selected.plazoConservacion}</span></div>
              </div>
              <div className="space-y-2">
                <div><span className="text-gray-500">Titulares:</span><div className="flex flex-wrap gap-1 mt-1">{selected.categoriasTitulares.map((t: string) => <span key={t} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{t}</span>)}</div></div>
                <div><span className="text-gray-500">Datos:</span><div className="flex flex-wrap gap-1 mt-1">{selected.categoriasDatos.map((d: string) => <span key={d} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">{d}</span>)}</div></div>
                {selected.categoriasEspeciales.length > 0 && <div><span className="text-gray-500">Datos Especiales:</span><div className="flex flex-wrap gap-1 mt-1">{selected.categoriasEspeciales.map((d: string) => <span key={d} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">{d}</span>)}</div></div>}
                <div><span className="text-gray-500">Destinatarios:</span><div className="flex flex-wrap gap-1 mt-1">{selected.destinatarios.map((d: string) => <span key={d} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{d}</span>)}</div></div>
                <div><span className="text-gray-500">Transferencias:</span> <span className="text-xs">{selected.transferencias}</span></div>
                <div><span className="text-gray-500">Dec. Automatizadas:</span> <span className={`px-2 py-0.5 rounded text-xs ${selected.decisionesAutomatizadas ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{selected.decisionesAutomatizadas ? 'Sí' : 'No'}</span></div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Sistema/Aplicación:</span> <span className="font-medium">{selected.sistemaAplicacion}</span></div>
              <div><span className="text-gray-500">Ubicación BD:</span> <span className="font-medium">{selected.ubicacionBD}</span></div>
            </div>
            <div className="mt-3"><h4 className="font-semibold text-sm mb-1">Medidas de Seguridad</h4><div className="flex flex-wrap gap-1">{selected.medidasSeguridad.map((m: string) => <span key={m} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{m}</span>)}</div></div>
            <div className="mt-3"><h4 className="font-semibold text-sm mb-1">Activos Relacionados</h4><div className="flex flex-wrap gap-1">{selected.activosRelacionados.map((a: string) => <span key={a} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">{a}</span>)}</div></div>
            <div className="mt-3 text-xs text-gray-400">Creado: {selected.fechaCreacion} | Revisado: {selected.fechaRevision} | Aprobado: {selected.fechaAprobacion}</div>
          </div>
        </div>
      )}
    </div>
  );
}

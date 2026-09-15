import { useState } from 'react';
import { useStore } from '../store/store';
import type { Asset } from '../data/demoData';

export default function AssetsModule() {
  const { assets } = useStore();
  const [filter, setFilter] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [selected, setSelected] = useState<Asset | null>(null);

  const tipos = [...new Set(assets.map(a => a.tipo))];
  const filtered = assets.filter(a => {
    const matchName = a.nombre.toLowerCase().includes(filter.toLowerCase());
    const matchTipo = !filterTipo || a.tipo === filterTipo;
    return matchName && matchTipo;
  });

  const criticidadColor = (c: string) => c === 'Alta' ? 'bg-red-100 text-red-700 border-red-300' : c === 'Media' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-green-100 text-green-700 border-green-300';

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4 flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Buscar activo..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 min-w-48 border rounded px-3 py-2 text-sm" />
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="border rounded px-3 py-2 text-sm">
          <option value="">Todos los tipos</option>
          {tipos.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-blue-600">{assets.length}</p><p className="text-xs text-gray-500">Total Activos</p></div>
        <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-red-600">{assets.filter(a => a.criticidad === 'Alta').length}</p><p className="text-xs text-gray-500">Criticidad Alta</p></div>
        <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-purple-600">{assets.filter(a => a.relacionDatosPersonales).length}</p><p className="text-xs text-gray-500">Con Datos Personales</p></div>
        <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-green-600">${(assets.reduce((a, b) => a + b.valor, 0) / 1000).toFixed(0)}K</p><p className="text-xs text-gray-500">Valor Total</p></div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Criticidad</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">C/I/D</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">DP</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Valor</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{a.id}</td>
                  <td className="px-4 py-3 font-medium">{a.nombre}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{a.tipo}</span></td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs border ${criticidadColor(a.criticidad)}`}>{a.criticidad}</span></td>
                  <td className="px-4 py-3 text-center text-xs">{a.confidencialidad}/{a.integridad}/{a.disponibilidad}</td>
                  <td className="px-4 py-3 text-center">{a.relacionDatosPersonales ? <i className="fas fa-check text-blue-500"></i> : <span className="text-gray-300">-</span>}</td>
                  <td className="px-4 py-3 text-right text-xs">${a.valor.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center"><button onClick={() => setSelected(a)} className="text-blue-600 hover:text-blue-800"><i className="fas fa-eye"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div><h3 className="text-xl font-bold">{selected.nombre}</h3><p className="text-sm text-gray-500">{selected.id} | {selected.tipo}</p></div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><span className="text-gray-500">Propietario:</span> <span className="font-medium">{selected.propietario}</span></div>
              <div><span className="text-gray-500">Custodio:</span> <span className="font-medium">{selected.custodio}</span></div>
              <div><span className="text-gray-500">Ubicación:</span> <span className="font-medium">{selected.ubicacion}</span></div>
              <div><span className="text-gray-500">Sistema:</span> <span className="font-medium">{selected.sistemaAsociado}</span></div>
              <div><span className="text-gray-500">Soporte:</span> <span className="font-medium">{selected.soporte}</span></div>
              <div><span className="text-gray-500">Valor:</span> <span className="font-medium">${selected.valor.toLocaleString()}</span></div>
            </div>
            <div className="mb-3">
              <h4 className="font-semibold text-sm mb-1">Clasificación CID</h4>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 rounded text-xs">Confidencialidad: {selected.confidencialidad}/5</span>
                <span className="px-3 py-1 bg-green-100 rounded text-xs">Integridad: {selected.integridad}/5</span>
                <span className="px-3 py-1 bg-purple-100 rounded text-xs">Disponibilidad: {selected.disponibilidad}/5</span>
              </div>
            </div>
            {selected.relacionDatosPersonales && (
              <div className="mb-3"><h4 className="font-semibold text-sm mb-1">Categorías de Datos</h4><div className="flex flex-wrap gap-1">{selected.categoriasDatos.map((c: string) => <span key={c} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">{c}</span>)}</div></div>
            )}
            <div className="mb-3"><h4 className="font-semibold text-sm mb-1">Amenazas</h4><div className="flex flex-wrap gap-1">{selected.amenazas.map((a: string) => <span key={a} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">{a}</span>)}</div></div>
            <div className="mb-3"><h4 className="font-semibold text-sm mb-1">Controles</h4><div className="flex flex-wrap gap-1">{selected.controles.map((c: string) => <span key={c} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{c}</span>)}</div></div>
            {selected.observaciones && <p className="text-sm text-gray-500 italic">Obs: {selected.observaciones}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

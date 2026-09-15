import { useState } from 'react';
import { useStore } from '../store/store';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function IncidentsModule() {
  const { incidents, risks } = useStore();
  const [tab, setTab] = useState<'incidents' | 'risk' | 'dashboard'>('dashboard');

  const riskMatrix = Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (_, j) => {
    const prob = 5 - i;
    const imp = j + 1;
    return risks.filter(r => r.probabilidad === prob && r.impacto === imp);
  }));

  const riskColor = (val: number) => {
    if (val >= 15) return 'bg-red-600 text-white';
    if (val >= 10) return 'bg-red-400 text-white';
    if (val >= 6) return 'bg-yellow-400 text-white';
    if (val >= 3) return 'bg-green-400 text-white';
    return 'bg-green-200 text-green-800';
  };

  const chartData = {
    labels: risks.map(r => r.nombre.length > 20 ? r.nombre.substring(0, 20) + '...' : r.nombre),
    datasets: [
      { label: 'Inherente', data: risks.map(r => r.riesgoInherente), backgroundColor: '#ef444480' },
      { label: 'Residual', data: risks.map(r => r.riesgoResidual), backgroundColor: '#3b82f680' },
    ]
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('dashboard')} className={`px-4 py-2 rounded text-sm font-medium ${tab === 'dashboard' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Dashboard</button>
        <button onClick={() => setTab('incidents')} className={`px-4 py-2 rounded text-sm font-medium ${tab === 'incidents' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Incidentes</button>
        <button onClick={() => setTab('risk')} className={`px-4 py-2 rounded text-sm font-medium ${tab === 'risk' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Matriz de Riesgos</button>
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-red-600">{incidents.filter(i => i.estado !== 'Cerrado').length}</p><p className="text-xs text-gray-500">Incidentes Abiertos</p></div>
            <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-green-600">{incidents.filter(i => i.estado === 'Cerrado').length}</p><p className="text-xs text-gray-500">Cerrados</p></div>
            <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-amber-600">{risks.filter(r => r.nivelAceptacion === 'No aceptable').length}</p><p className="text-xs text-gray-500">Riesgos No Aceptables</p></div>
            <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-blue-600">{incidents.filter(i => i.necesidadNotificacion).length}</p><p className="text-xs text-gray-500">Notificación SPDP</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <h4 className="font-semibold text-sm mb-3">Riesgos Inherentes vs Residuales</h4>
              <div className="h-64"><Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, max: 25 } } }} /></div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h4 className="font-semibold text-sm mb-3">Incidentes por Severidad</h4>
              <div className="space-y-2">
                {['Baja', 'Media', 'Alta', 'Crítica'].map(s => {
                  const count = incidents.filter(i => i.severidad === s).length;
                  const pct = incidents.length > 0 ? (count / incidents.length) * 100 : 0;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className="w-16 text-xs">{s}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4">
                        <div className={`h-4 rounded-full ${s === 'Baja' ? 'bg-green-400' : s === 'Media' ? 'bg-yellow-400' : s === 'Alta' ? 'bg-orange-400' : 'bg-red-500'}`} style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="text-xs font-medium w-6">{count}</span>
                    </div>
                  );
                })}
              </div>
              <h4 className="font-semibold text-sm mt-4 mb-2">Planes de Tratamiento</h4>
              <div className="space-y-1">
                {['En tratamiento', 'Controlado', 'Aceptado'].map(e => (
                  <div key={e} className="flex justify-between text-xs bg-gray-50 rounded px-3 py-2">
                    <span>{e}</span><span className="font-medium">{risks.filter(r => r.estado === e).length}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-semibold text-sm mb-3">Alertas de Notificación a SPDP</h4>
            {incidents.filter(i => i.necesidadNotificacion).length === 0 ? (
              <p className="text-sm text-gray-500">No hay incidentes que requieran notificación</p>
            ) : (
              <div className="space-y-2">
                {incidents.filter(i => i.necesidadNotificacion).map(i => (
                  <div key={i.id} className={`flex justify-between items-center p-3 rounded border ${i.estadoCierre.includes('Notificación') || i.estadoCierre.includes('realizada') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div>
                      <p className="text-sm font-medium">{i.codigo} - {i.tipo}</p>
                      <p className="text-xs text-gray-500">{i.titularesAfectados} titulares afectados | Fecha límite: {i.fechaLimiteNotificacion}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${i.estadoCierre.includes('Notificación') || i.estadoCierre.includes('realizada') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{i.estadoCierre.includes('Notificación') || i.estadoCierre.includes('realizada') ? 'Notificado' : 'Pendiente'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Incidents Tab */}
      {tab === 'incidents' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Código</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Descripción</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Severidad</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Titulares</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Estado</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Notif.</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(i => (
                  <tr key={i.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{i.codigo}</td>
                    <td className="px-4 py-3 text-xs">{i.fechaDeteccion}</td>
                    <td className="px-4 py-3 text-xs">{i.tipo}</td>
                    <td className="px-4 py-3 text-xs max-w-xs truncate">{i.descripcion}</td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs text-white ${i.severidad === 'Alta' || i.severidad === 'Crítica' ? 'bg-red-500' : i.severidad === 'Media' ? 'bg-yellow-500' : 'bg-green-500'}`}>{i.severidad}</span></td>
                    <td className="px-4 py-3 text-center text-xs">{i.titularesAfectados}</td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs ${i.estado === 'Cerrado' ? 'bg-green-100 text-green-700' : i.estado === 'Abierto' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{i.estado}</span></td>
                    <td className="px-4 py-3 text-center">{i.necesidadNotificacion ? <i className="fas fa-bell text-amber-500"></i> : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Risk Matrix Tab */}
      {tab === 'risk' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-semibold text-sm mb-3">Matriz de Riesgos 5x5 (Riesgo Residual)</h4>
            <div className="overflow-x-auto">
              <table className="mx-auto text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-center font-medium">Prob. →</th>
                    {[1, 2, 3, 4, 5].map(i => <th key={i} className="p-2 text-center font-medium border">{i}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[5, 4, 3, 2, 1].map(prob => (
                    <tr key={prob}>
                      <td className="p-2 text-center font-medium border">{prob}</td>
                      {[1, 2, 3, 4, 5].map(imp => {
                        const val = prob * imp;
                        const cellRisks = riskMatrix[5 - prob][imp - 1];
                        return (
                          <td key={imp} className={`p-2 text-center border min-w-[60px] ${riskColor(val)}`}>
                            <div className="font-bold">{val}</div>
                            {cellRisks.length > 0 && <div className="text-[9px] mt-0.5">{cellRisks.length} riesgo(s)</div>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-3 text-xs justify-center">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-200 rounded"></span>Bajo (1-5)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded"></span>Moderado (6-9)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded"></span>Medio (10-14)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded"></span>Alto (15-19)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-600 rounded"></span>Crítico (20-25)</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <h4 className="font-semibold text-sm p-4 border-b">Detalle de Riesgos</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Riesgo</th>
                    <th className="text-center px-4 py-2 font-medium text-gray-600">P</th>
                    <th className="text-center px-4 py-2 font-medium text-gray-600">I</th>
                    <th className="text-center px-4 py-2 font-medium text-gray-600">Inh.</th>
                    <th className="text-center px-4 py-2 font-medium text-gray-600">% Ctrl</th>
                    <th className="text-center px-4 py-2 font-medium text-gray-600">Res.</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Tratamiento</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.sort((a, b) => b.riesgoResidual - a.riesgoResidual).map(r => (
                    <tr key={r.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs">{r.nombre.length > 35 ? r.nombre.substring(0, 35) + '...' : r.nombre}</td>
                      <td className="px-4 py-2 text-center text-xs">{r.probabilidad}</td>
                      <td className="px-4 py-2 text-center text-xs">{r.impacto}</td>
                      <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs text-white ${riskColor(r.riesgoInherente)}`}>{r.riesgoInherente}</span></td>
                      <td className="px-4 py-2 text-center text-xs">{r.eficaciaControles}%</td>
                      <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs text-white ${riskColor(r.riesgoResidual)}`}>{r.riesgoResidual}</span></td>
                      <td className="px-4 py-2 text-xs">{r.tratamientoRiesgo}</td>
                      <td className="px-4 py-2"><span className={`px-2 py-0.5 rounded text-xs ${r.estado === 'Controlado' || r.estado === 'Aceptado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{r.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

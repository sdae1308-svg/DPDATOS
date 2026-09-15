import { useStore } from '../store/store';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function MaturityModule() {
  const { maturity } = useStore();

  const globalScore = (maturity.reduce((a, b) => a + b.nivel, 0) / maturity.length).toFixed(2);
  const globalPct = Math.round((maturity.reduce((a, b) => a + b.nivel, 0) / (maturity.length * 5)) * 100);

  const radarData = {
    labels: maturity.map(m => m.nombre.length > 18 ? m.nombre.substring(0, 18) + '...' : m.nombre),
    datasets: [{
      label: 'Nivel Actual',
      data: maturity.map(m => m.nivel),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
    }, {
      label: 'Meta (Nivel 4)',
      data: maturity.map(() => 4),
      backgroundColor: 'rgba(34, 197, 94, 0.05)',
      borderColor: 'rgba(34, 197, 94, 0.5)',
      borderDash: [5, 5],
      pointRadius: 0,
    }]
  };

  const barData = {
    labels: maturity.map(m => m.nombre.length > 15 ? m.nombre.substring(0, 15) + '...' : m.nombre),
    datasets: [{
      label: 'Nivel de Madurez',
      data: maturity.map(m => m.nivel),
      backgroundColor: maturity.map(m => m.nivel >= 4 ? '#22c55e' : m.nivel >= 3 ? '#3b82f6' : m.nivel >= 2 ? '#eab308' : '#ef4444'),
    }]
  };

  const nivelLabel = (n: number) => {
    switch (n) {
      case 0: return 'Inexistente';
      case 1: return 'Inicial';
      case 2: return 'Repetible';
      case 3: return 'Definido';
      case 4: return 'Gestionado';
      case 5: return 'Optimizado';
      default: return '';
    }
  };

  const brechas = maturity.filter(m => m.nivel < 3).sort((a, b) => a.nivel - b.nivel);

  return (
    <div className="space-y-6">
      {/* Global Score */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Madurez del Cumplimiento</h3>
            <p className="text-indigo-200 text-sm">Modelo de 5 niveles basado en guías SPDP</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">{globalScore}</p>
            <p className="text-indigo-200 text-xs">Score Global / 5.0</p>
            <p className="text-sm font-medium mt-1">{nivelLabel(Math.round(parseFloat(globalScore)))}</p>
          </div>
        </div>
        <div className="mt-4 bg-white/10 rounded-full h-4">
          <div className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-green-400" style={{ width: `${globalPct}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-indigo-200 mt-1">
          <span>0 - Inexistente</span><span>1 - Inicial</span><span>2 - Repetible</span><span>3 - Definido</span><span>4 - Gestionado</span><span>5 - Optimizado</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Radar de Madurez</h4>
          <div className="h-72"><Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } } }} /></div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Nivel por Dimensión</h4>
          <div className="h-72"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { max: 5, beginAtZero: true } } }} /></div>
        </div>
      </div>

      {/* Brechas */}
      {brechas.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-3"><i className="fas fa-exclamation-triangle mr-2"></i>Brechas Prioritarias (Nivel {'<'} 3)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {brechas.map(b => (
              <div key={b.nombre} className="bg-white rounded-lg p-3 border border-amber-100">
                <div className="flex justify-between items-start">
                  <h5 className="font-medium text-sm text-gray-800">{b.nombre}</h5>
                  <span className={`px-2 py-0.5 rounded text-xs text-white ${b.nivel <= 1 ? 'bg-red-500' : 'bg-yellow-500'}`}>Nivel {b.nivel}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{b.descripcion}</p>
                <div className="mt-2">
                  <p className="text-xs text-gray-400">Evidencias:</p>
                  <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                    {b.evidencias.map((e, i) => <li key={i}>• {e}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Detail */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b"><h4 className="font-semibold text-gray-700">Detalle por Dimensión</h4></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Dimensión</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Nivel</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {maturity.map(m => (
                <tr key={m.nombre} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{m.nombre}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} className={`w-4 h-4 rounded-sm ${n <= m.nivel ? (m.nivel >= 4 ? 'bg-green-400' : m.nivel >= 3 ? 'bg-blue-400' : m.nivel >= 2 ? 'bg-yellow-400' : 'bg-red-400') : 'bg-gray-200'}`}></div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${m.nivel >= 4 ? 'bg-green-100 text-green-700' : m.nivel >= 3 ? 'bg-blue-100 text-blue-700' : m.nivel >= 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{nivelLabel(m.nivel)}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-md">{m.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-semibold text-gray-700 mb-3"><i className="fas fa-road mr-2 text-blue-600"></i>Roadmap de Mejora Sugerido</h4>
        <div className="space-y-3">
          {brechas.map((b, i) => (
            <div key={b.nombre} className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
              <div className="flex-1 bg-gray-50 rounded p-3">
                <p className="font-medium text-sm">{b.nombre}</p>
                <p className="text-xs text-gray-500">Elevar de nivel {b.nivel} ({nivelLabel(b.nivel)}) a nivel {Math.min(b.nivel + 1, 5)} ({nivelLabel(Math.min(b.nivel + 1, 5))})</p>
                <p className="text-xs text-blue-600 mt-1">Acción: {b.evidencias.find(e => e.includes('Pendiente') || e.includes('Sin') || e.includes('Falta')) || 'Implementar controles y evidencias'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

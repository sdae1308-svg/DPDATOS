import { useStore } from '../store/store';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const { company, employees, assets, rats, incidents, risks, audits, documents, maturity } = useStore();

  // KPIs
  const totalCompliance = Math.round(maturity.reduce((a, b) => a + b.nivel, 0) / (maturity.length * 5) * 100);
  const docsVigentes = documents.filter(d => d.estado === 'Vigente').length;
  const docsVencidos = documents.filter(d => d.estado === 'Vencido').length;
  const ratsAltoRiesgo = rats.filter(r => r.nivelRiesgo === 'Alto').length;
  const incidentesAbiertos = incidents.filter(i => i.estado === 'Abierto' || i.estado === 'En seguimiento').length;
  const incidentesCerrados = incidents.filter(i => i.estado === 'Cerrado').length;
  const activosCriticos = assets.filter(a => a.criticidad === 'Alta').length;
  const consentPendiente = employees.filter(e => !e.consentimientoFirmado || !e.confidencialidadFirmada).length;
  const hallazgosAbiertos = audits.reduce((acc, a) => acc + a.hallazgos.filter(h => h.estado === 'Abierto' || h.estado === 'En remedición').length, 0);
  const riesgosCriticos = risks.filter(r => r.nivelAceptacion === 'No aceptable').length;

  const kpis = [
    { label: 'Cumplimiento Global', value: `${totalCompliance}%`, color: totalCompliance >= 70 ? 'bg-green-500' : totalCompliance >= 50 ? 'bg-yellow-500' : 'bg-red-500', icon: 'fa-chart-pie' },
    { label: 'Documentos Vigentes', value: docsVigentes, color: 'bg-blue-500', icon: 'fa-file-check' },
    { label: 'Tratamientos (RAT)', value: rats.length, color: 'bg-indigo-500', icon: 'fa-clipboard-list' },
    { label: 'RAT Alto Riesgo', value: ratsAltoRiesgo, color: 'bg-orange-500', icon: 'fa-triangle-exclamation' },
    { label: 'Incidentes Abiertos', value: incidentesAbiertos, color: incidentesAbiertos > 0 ? 'bg-red-500' : 'bg-green-500', icon: 'fa-exclamation-circle' },
    { label: 'Activos Críticos', value: activosCriticos, color: 'bg-purple-500', icon: 'fa-server' },
    { label: 'Consent. Pendiente', value: consentPendiente, color: consentPendiente > 0 ? 'bg-amber-500' : 'bg-green-500', icon: 'fa-file-signature' },
    { label: 'Hallazgos Abiertos', value: hallazgosAbiertos, color: hallazgosAbiertos > 0 ? 'bg-red-500' : 'bg-green-500', icon: 'fa-clipboard-exclamation' },
    { label: 'Riesgos No Aceptables', value: riesgosCriticos, color: 'bg-red-600', icon: 'fa-shield-virus' },
    { label: 'Madurez Global', value: `${(maturity.reduce((a, b) => a + b.nivel, 0) / maturity.length).toFixed(1)}/5`, color: 'bg-teal-500', icon: 'fa-chart-simple' },
  ];

  // Charts
  const incidentesBySeveridad = {
    labels: ['Baja', 'Media', 'Alta', 'Crítica'],
    datasets: [{
      data: [
        incidents.filter(i => i.severidad === 'Baja').length,
        incidents.filter(i => i.severidad === 'Media').length,
        incidents.filter(i => i.severidad === 'Alta').length,
        incidents.filter(i => i.severidad === 'Crítica').length,
      ],
      backgroundColor: ['#22c55e', '#eab308', '#f97316', '#ef4444'],
    }]
  };

  const risksByProcess = {
    labels: [...new Set(risks.map(r => r.proceso))],
    datasets: [
      { label: 'Inherente', data: [...new Set(risks.map(r => r.proceso))].map(p => risks.filter(r => r.proceso === p).reduce((a, b) => a + b.riesgoInherente, 0)), backgroundColor: '#ef444480' },
      { label: 'Residual', data: [...new Set(risks.map(r => r.proceso))].map(p => risks.filter(r => r.proceso === p).reduce((a, b) => a + b.riesgoResidual, 0)), backgroundColor: '#3b82f680' },
    ]
  };

  const maturityData = {
    labels: maturity.map(m => m.nombre.length > 15 ? m.nombre.substring(0, 15) + '...' : m.nombre),
    datasets: [{
      label: 'Nivel de Madurez',
      data: maturity.map(m => m.nivel),
      backgroundColor: maturity.map(m => m.nivel >= 4 ? '#22c55e' : m.nivel >= 3 ? '#3b82f6' : m.nivel >= 2 ? '#eab308' : '#ef4444'),
    }]
  };

  const docsByType = {
    labels: [...new Set(documents.map(d => d.tipo))],
    datasets: [{
      data: [...new Set(documents.map(d => d.tipo))].map(t => documents.filter(d => d.tipo === t).length),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
    }]
  };

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{company.nombreComercial}</h3>
            <p className="text-blue-200 text-sm">{company.razonSocial} | RUC: {company.ruc}</p>
            <p className="text-blue-300 text-xs mt-1">Sistema de Cumplimiento LOPDP - Ecuador</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalCompliance}%</div>
            <p className="text-blue-200 text-xs">Cumplimiento Global</p>
            <div className="w-32 bg-slate-600 rounded-full h-2 mt-1">
              <div className={`h-2 rounded-full ${totalCompliance >= 70 ? 'bg-green-400' : totalCompliance >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${totalCompliance}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${kpi.color} rounded-lg flex items-center justify-center`}>
                <i className={`fas ${kpi.icon} text-white text-xs`}></i>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(incidentesAbiertos > 0 || consentPendiente > 0 || riesgosCriticos > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2"><i className="fas fa-exclamation-triangle mr-2"></i>Alertas Activas</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            {incidentesAbiertos > 0 && <p className="text-amber-700">⚠️ {incidentesAbiertos} incidente(s) abierto(s) requiere(n) atención</p>}
            {consentPendiente > 0 && <p className="text-amber-700">⚠️ {consentPendiente} empleado(s) con consentimiento/confidencialidad pendiente</p>}
            {riesgosCriticos > 0 && <p className="text-amber-700">⚠️ {riesgosCriticos} riesgo(s) no aceptable(s) en tratamiento</p>}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Incidentes por Severidad</h4>
          <div className="h-48 flex items-center justify-center">
            <Doughnut data={incidentesBySeveridad} options={{ plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Riesgos por Proceso (Inherente vs Residual)</h4>
          <div className="h-48">
            <Bar data={risksByProcess} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Madurez por Dimensión</h4>
          <div className="h-48">
            <Bar data={maturityData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { max: 5, beginAtZero: true } } }} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Documentos por Tipo</h4>
          <div className="h-48 flex items-center justify-center">
            <Doughnut data={docsByType} options={{ plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>
      </div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Últimos Incidentes</h4>
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Código</th><th className="text-left py-2">Tipo</th><th className="text-left py-2">Severidad</th><th className="text-left py-2">Estado</th></tr></thead>
            <tbody>
              {incidents.slice(0, 5).map(inc => (
                <tr key={inc.id} className="border-b border-gray-100">
                  <td className="py-2 font-mono text-xs">{inc.codigo}</td>
                  <td className="py-2">{inc.tipo}</td>
                  <td className="py-2"><span className={`px-2 py-0.5 rounded text-xs text-white ${inc.severidad === 'Alta' || inc.severidad === 'Crítica' ? 'bg-red-500' : inc.severidad === 'Media' ? 'bg-yellow-500' : 'bg-green-500'}`}>{inc.severidad}</span></td>
                  <td className="py-2"><span className={`px-2 py-0.5 rounded text-xs ${inc.estado === 'Cerrado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{inc.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Top Riesgos</h4>
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2">Riesgo</th><th className="text-center py-2">Inh.</th><th className="text-center py-2">Res.</th><th className="text-left py-2">Estado</th></tr></thead>
            <tbody>
              {risks.sort((a, b) => b.riesgoInherente - a.riesgoInherente).slice(0, 5).map(r => (
                <tr key={r.id} className="border-b border-gray-100">
                  <td className="py-2 text-xs">{r.nombre.length > 35 ? r.nombre.substring(0, 35) + '...' : r.nombre}</td>
                  <td className="py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs text-white ${r.riesgoInherente >= 12 ? 'bg-red-500' : r.riesgoInherente >= 6 ? 'bg-yellow-500' : 'bg-green-500'}`}>{r.riesgoInherente}</span></td>
                  <td className="py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs text-white ${r.riesgoResidual >= 8 ? 'bg-red-500' : r.riesgoResidual >= 4 ? 'bg-yellow-500' : 'bg-green-500'}`}>{r.riesgoResidual}</span></td>
                  <td className="py-2"><span className={`px-2 py-0.5 rounded text-xs ${r.estado === 'Controlado' || r.estado === 'Aceptado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{r.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

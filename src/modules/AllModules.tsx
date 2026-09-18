// Todos los módulos de datos consolidados usando useEnterprise hook
import { useState, useRef } from 'react';
import { useEnterprise } from '../store/useEnterprise';
import { useStore } from '../store/store';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, RadialLinearScale, Filler, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { exportToExcel, importFromExcel, exportToWord, exportToPDF, exportToJSON, exportMultipleSheets } from '../utils/exportUtils';
import { generateAuditReportPDF, generateAuditReportWord } from '../utils/auditReportUtils';
import type { Employee, Asset, RAT, Incident, Risk, Document as DocType } from '../data/demoData';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, RadialLinearScale, Filler, Title, Tooltip, Legend);

// ==================== DASHBOARD ====================
export function Dashboard() {
  const { company, employees, assets, rats, incidents, risks, audits, documents, maturity } = useEnterprise();
  if (!company) return <p className="text-gray-500">No hay empresa activa</p>;

  const totalCompliance = Math.round(maturity.reduce((a: number, b: any) => a + b.nivel, 0) / (maturity.length * 5) * 100);
  const incidentesAbiertos = incidents.filter((i: Incident) => i.estado !== 'Cerrado').length;
  const consentPendiente = employees.filter((e: Employee) => !e.consentimientoFirmado || !e.confidencialidadFirmada).length;
  const riesgosCriticos = risks.filter((r: Risk) => r.nivelAceptacion === 'No aceptable').length;

  const kpis = [
    { label: 'Cumplimiento', value: `${totalCompliance}%`, color: totalCompliance >= 70 ? 'bg-green-500' : totalCompliance >= 50 ? 'bg-yellow-500' : 'bg-red-500', icon: 'fa-chart-pie' },
    { label: 'Empleados', value: employees.length, color: 'bg-blue-500', icon: 'fa-users' },
    { label: 'Activos', value: assets.length, color: 'bg-purple-500', icon: 'fa-server' },
    { label: 'RAT', value: rats.length, color: 'bg-indigo-500', icon: 'fa-clipboard-list' },
    { label: 'Inc. Abiertos', value: incidentesAbiertos, color: incidentesAbiertos > 0 ? 'bg-red-500' : 'bg-green-500', icon: 'fa-exclamation-circle' },
    { label: 'Consent. Pend.', value: consentPendiente, color: consentPendiente > 0 ? 'bg-amber-500' : 'bg-green-500', icon: 'fa-file-signature' },
    { label: 'Riesgos Críticos', value: riesgosCriticos, color: 'bg-red-600', icon: 'fa-shield-virus' },
    { label: 'Documentos', value: documents.length, color: 'bg-teal-500', icon: 'fa-file-lines' },
  ];

  const severityData = { labels: ['Baja', 'Media', 'Alta'], datasets: [{ data: ['Baja', 'Media', 'Alta'].map(s => incidents.filter((i: Incident) => i.severidad === s).length), backgroundColor: ['#22c55e', '#eab308', '#ef4444'] }] };
  const maturityData = { labels: maturity.map((m: any) => m.nombre.substring(0, 12)), datasets: [{ label: 'Nivel', data: maturity.map((m: any) => m.nivel), backgroundColor: maturity.map((m: any) => m.nivel >= 4 ? '#22c55e' : m.nivel >= 3 ? '#3b82f6' : m.nivel >= 2 ? '#eab308' : '#ef4444') }] };

  const handleExportDashboard = (format: 'excel' | 'pdf' | 'word') => {
    const dashboardData = [
      { Indicador: 'Cumplimiento Global', Valor: `${totalCompliance}%` },
      { Indicador: 'Total Empleados', Valor: employees.length.toString() },
      { Indicador: 'Total Activos', Valor: assets.length.toString() },
      { Indicador: 'Tratamientos (RAT)', Valor: rats.length.toString() },
      { Indicador: 'Incidentes Abiertos', Valor: incidentesAbiertos.toString() },
      { Indicador: 'Consentimientos Pendientes', Valor: consentPendiente.toString() },
      { Indicador: 'Riesgos Críticos', Valor: riesgosCriticos.toString() },
      { Indicador: 'Documentos', Valor: documents.length.toString() },
      { Indicador: 'Auditorías', Valor: audits.length.toString() },
      { Indicador: 'Score Madurez', Valor: `${(maturity.reduce((a: number, b: any) => a + b.nivel, 0) / maturity.length).toFixed(2)}/5.0` },
    ];

    if (format === 'excel') {
      exportToExcel(dashboardData, 'Dashboard_Ejecutivo', 'KPIs');
    } else if (format === 'pdf') {
      exportToPDF('Dashboard Ejecutivo - Resumen de Cumplimiento', dashboardData.map(d => ({ heading: d.Indicador, text: d.Valor })), 'Dashboard_Ejecutivo', company.razonSocial);
    } else {
      exportToWord('Dashboard Ejecutivo - Resumen de Cumplimiento', dashboardData.map(d => ({ heading: d.Indicador, text: d.Valor })), 'Dashboard_Ejecutivo');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-xl p-5 text-white">
        <div className="flex justify-between items-center">
          <div><h3 className="text-lg font-bold">{company.nombreComercial}</h3><p className="text-blue-200 text-xs">{company.razonSocial} | RUC: {company.ruc}</p></div>
          <div className="text-right"><div className="text-3xl font-bold">{totalCompliance}%</div><p className="text-blue-200 text-xs">Cumplimiento</p></div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => handleExportDashboard('excel')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"><i className="fas fa-file-excel mr-1"></i>Exportar Excel</button>
        <button onClick={() => handleExportDashboard('pdf')} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"><i className="fas fa-file-pdf mr-1"></i>Exportar PDF</button>
        <button onClick={() => handleExportDashboard('word')} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"><i className="fas fa-file-word mr-1"></i>Exportar Word</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-lg border p-3"><div className={`w-7 h-7 ${k.color} rounded flex items-center justify-center mb-2`}><i className={`fas ${k.icon} text-white text-xs`}></i></div><p className="text-xl font-bold">{k.value}</p><p className="text-xs text-gray-500">{k.label}</p></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border p-4"><h4 className="font-semibold text-sm mb-2">Incidentes por Severidad</h4><div className="h-44 flex items-center justify-center"><Doughnut data={severityData} options={{ plugins: { legend: { position: 'right' } } }} /></div></div>
        <div className="bg-white rounded-lg border p-4"><h4 className="font-semibold text-sm mb-2">Madurez por Dimensión</h4><div className="h-44"><Bar data={maturityData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { max: 5 } } }} /></div></div>
      </div>
    </div>
  );
}

// ==================== COMPANY ====================
export function CompanyModule() {
  const { company, employees, rats, maturity, updateCompany } = useEnterprise();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(company);
  if (!company) return null;
  const totalCompliance = Math.round(maturity.reduce((a: number, b: any) => a + b.nivel, 0) / (maturity.length * 5) * 100);

  const handleSave = () => { updateCompany(form as any); setEditing(false); };

  const handleExportCompany = (format: 'excel' | 'pdf' | 'word') => {
    const companyData = [
      { Campo: 'Razón Social', Valor: company.razonSocial },
      { Campo: 'Nombre Comercial', Valor: company.nombreComercial },
      { Campo: 'RUC', Valor: company.ruc },
      { Campo: 'Domicilio Legal', Valor: company.domicilioLegal },
      { Campo: 'Ciudad', Valor: company.ciudad },
      { Campo: 'Provincia', Valor: company.provincia },
      { Campo: 'Sector Económico', Valor: company.sectorEconomico },
      { Campo: 'Tamaño', Valor: company.tamanoEmpresa },
      { Campo: 'Representante Legal', Valor: company.representanteLegal },
      { Campo: 'Responsable Cumplimiento', Valor: company.responsableCumplimiento },
      { Campo: 'DPO', Valor: company.delegadoProteccionDatos },
      { Campo: 'Email', Valor: company.email },
      { Campo: 'Teléfono', Valor: company.telefono },
      { Campo: 'Sitio Web', Valor: company.sitioWeb },
    ];

    if (format === 'excel') {
      exportToExcel(companyData, 'Ficha_Empresarial', 'Empresa');
    } else if (format === 'pdf') {
      exportToPDF('Ficha Empresarial', companyData.map(d => ({ heading: d.Campo, text: d.Valor })), 'Ficha_Empresarial', company.razonSocial);
    } else {
      exportToWord('Ficha Empresarial', companyData.map(d => ({ heading: d.Campo, text: d.Valor })), 'Ficha_Empresarial');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-5 text-white">
        <div className="flex justify-between"><div><h3 className="text-xl font-bold">{company.nombreComercial}</h3><p className="text-blue-200 text-sm">{company.razonSocial}</p></div><div className="text-right"><div className="text-3xl font-bold">{totalCompliance}%</div><p className="text-blue-200 text-xs">Cumplimiento</p></div></div>
        <div className="grid grid-cols-3 gap-3 mt-3">{[{l:'Empleados',v:employees.length},{l:'Tratamientos',v:rats.length},{l:'Dim.≥3',v:`${maturity.filter((m:any)=>m.nivel>=3).length}/${maturity.length}`}].map((s,i)=><div key={i} className="bg-white/10 rounded p-2 text-center"><p className="text-xl font-bold">{s.v}</p><p className="text-xs text-blue-200">{s.l}</p></div>)}</div>
      </div>
      <div className="bg-white rounded-lg border">
        <div className="flex justify-between p-4 border-b">
          <h4 className="font-semibold"><i className="fas fa-building mr-2 text-blue-600"></i>Ficha Empresarial</h4>
          <div className="flex gap-2">
            {!editing ? (
              <>
                <button onClick={() => handleExportCompany('excel')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"><i className="fas fa-file-excel mr-1"></i>Excel</button>
                <button onClick={() => handleExportCompany('pdf')} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
                <button onClick={() => handleExportCompany('word')} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"><i className="fas fa-file-word mr-1"></i>Word</button>
                <button onClick={() => { setForm(company); setEditing(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"><i className="fas fa-edit mr-1"></i>Editar</button>
              </>
            ) : (
              <div className="flex gap-2"><button onClick={handleSave} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-save mr-1"></i>Guardar</button><button onClick={() => setEditing(false)} className="px-3 py-1.5 bg-gray-200 rounded text-sm">Cancelar</button></div>
            )}
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[{l:'Razón Social',k:'razonSocial'},{l:'Nombre Comercial',k:'nombreComercial'},{l:'RUC',k:'ruc'},{l:'Domicilio',k:'domicilioLegal'},{l:'Ciudad',k:'ciudad'},{l:'Provincia',k:'provincia'},{l:'Sector',k:'sectorEconomico'},{l:'Tamaño',k:'tamanoEmpresa'},{l:'Representante Legal',k:'representanteLegal'},{l:'Resp. Cumplimiento',k:'responsableCumplimiento'},{l:'DPO',k:'delegadoProteccionDatos'},{l:'Email',k:'email'},{l:'Teléfono',k:'telefono'},{l:'Sitio Web',k:'sitioWeb'}].map(f => (
            <div key={f.k}><label className="text-xs text-gray-500">{f.l}</label>{editing ? <input value={(form as any)[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value } as any)} className="w-full border rounded px-2 py-1 text-sm" /> : <p className="text-sm font-medium">{(company as any)[f.k]}</p>}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== EMPLOYEES ====================
export function EmployeesModule() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEnterprise();
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({ nombre: '', cedula: '', cargo: '', area: '', fechaIngreso: '', tipoRelacion: 'Indefinido', nivelAccesoDatos: 'Bajo', confidencialidadFirmada: false, consentimientoFirmado: false, capacitaciones: [], incidentesAsociados: [], observaciones: '', estado: 'Activo', accesoActivos: [] });
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = employees.filter((e: Employee) => e.nombre.toLowerCase().includes(filter.toLowerCase()) || e.cargo.toLowerCase().includes(filter.toLowerCase()));

  const handleSave = () => {
    if (!form.nombre || !form.cedula) return;
    if (editId) { updateEmployee(editId, form); }
    else { const id = `EMP-${String(employees.length + 1).padStart(3, '0')}`; addEmployee({ ...form, id, accesoActivos: [], capacitaciones: [], incidentesAsociados: [] } as Employee); }
    setShowForm(false); setEditId(null); setForm({ nombre: '', cedula: '', cargo: '', area: '', fechaIngreso: '', tipoRelacion: 'Indefinido', nivelAccesoDatos: 'Bajo', confidencialidadFirmada: false, consentimientoFirmado: false, capacitaciones: [], incidentesAsociados: [], observaciones: '', estado: 'Activo', accesoActivos: [] });
  };

  const handleEdit = (emp: Employee) => { setForm(emp); setEditId(emp.id); setShowForm(true); };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const data = await importFromExcel(file);
    data.forEach((row: any) => { const id = `EMP-${String(employees.length + 1).padStart(3, '0')}`; addEmployee({ ...row, id, accesoActivos: [], capacitaciones: [], incidentesAsociados: [], confidencialidadFirmada: row.confidencialidadFirmada === true || row.confidencialidadFirmada === 'true', consentimientoFirmado: row.consentimientoFirmado === true || row.consentimientoFirmado === 'true' } as Employee); });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-3 flex flex-wrap gap-2 items-center">
        <input type="text" placeholder="Buscar..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 min-w-40 border rounded px-3 py-1.5 text-sm" />
        <button onClick={() => { setEditId(null); setForm({ nombre: '', cedula: '', cargo: '', area: '', fechaIngreso: '', tipoRelacion: 'Indefinido', nivelAccesoDatos: 'Bajo', confidencialidadFirmada: false, consentimientoFirmado: false, capacitaciones: [], incidentesAsociados: [], observaciones: '', estado: 'Activo', accesoActivos: [] }); setShowForm(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"><i className="fas fa-plus mr-1"></i>Nuevo</button>
        <button onClick={() => exportToExcel(employees, 'empleados', 'Empleados')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel</button>
        <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm"><i className="fas fa-file-import mr-1"></i>Importar</button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Nombre</th><th className="text-left px-3 py-2">Cargo</th><th className="text-left px-3 py-2">Área</th><th className="text-center px-3 py-2">Confid.</th><th className="text-center px-3 py-2">Consent.</th><th className="text-center px-3 py-2">Acciones</th></tr></thead>
          <tbody>{filtered.map((emp: Employee) => (
            <tr key={emp.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2"><p className="font-medium text-xs">{emp.nombre}</p><p className="text-[10px] text-gray-400">{emp.cedula}</p></td>
              <td className="px-3 py-2 text-xs">{emp.cargo}</td>
              <td className="px-3 py-2"><span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{emp.area}</span></td>
              <td className="px-3 py-2 text-center">{emp.confidencialidadFirmada ? <i className="fas fa-check-circle text-green-500"></i> : <i className="fas fa-times-circle text-red-500"></i>}</td>
              <td className="px-3 py-2 text-center">{emp.consentimientoFirmado ? <i className="fas fa-check-circle text-green-500"></i> : <i className="fas fa-times-circle text-red-500"></i>}</td>
              <td className="px-3 py-2 text-center">
                <button onClick={() => handleEdit(emp)} className="text-blue-600 mr-2"><i className="fas fa-edit"></i></button>
                <button onClick={() => deleteEmployee(emp.id)} className="text-red-600"><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold mb-3">{editId ? 'Editar' : 'Nuevo'} Empleado</h3>
            <div className="space-y-2">
              <input placeholder="Nombre *" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Cédula *" value={form.cedula} onChange={e => setForm({...form, cedula: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Cargo" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Área" value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input type="date" value={form.fechaIngreso} onChange={e => setForm({...form, fechaIngreso: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <select value={form.nivelAccesoDatos} onChange={e => setForm({...form, nivelAccesoDatos: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm"><option value="Bajo">Bajo</option><option value="Medio">Medio</option><option value="Alto">Alto</option></select>
              <div className="flex gap-4"><label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={form.confidencialidadFirmada} onChange={e => setForm({...form, confidencialidadFirmada: e.target.checked})} />Confid.</label><label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={form.consentimientoFirmado} onChange={e => setForm({...form, consentimientoFirmado: e.target.checked})} />Consent.</label></div>
            </div>
            <div className="flex gap-2 mt-3"><button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">Guardar</button><button onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-gray-200 rounded text-sm">Cancelar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== ASSETS ====================
export function AssetsModule() {
  const { assets, addAsset, updateAsset, deleteAsset } = useEnterprise();
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Asset>>({ nombre: '', tipo: 'Software', propietario: '', custodio: '', ubicacion: '', criticidad: 'Media', confidencialidad: 3, integridad: 3, disponibilidad: 3, relacionDatosPersonales: false, categoriasDatos: [], soporte: 'Digital', sistemaAsociado: '', dependenciaTecnologica: 'Media', estado: 'Activo', amenazas: [], vulnerabilidades: [], controles: [], valor: 0, observaciones: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = assets.filter((a: Asset) => a.nombre.toLowerCase().includes(filter.toLowerCase()));
  const handleSave = () => {
    if (!form.nombre) return;
    if (editId) { updateAsset(editId, form); }
    else { const id = `ACT-${String(assets.length + 1).padStart(3, '0')}`; addAsset({ ...form, id, categoriasDatos: [], amenazas: [], vulnerabilidades: [], controles: [] } as Asset); }
    setShowForm(false); setEditId(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-3 flex flex-wrap gap-2 items-center">
        <input placeholder="Buscar..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 min-w-40 border rounded px-3 py-1.5 text-sm" />
        <button onClick={() => { setEditId(null); setShowForm(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"><i className="fas fa-plus mr-1"></i>Nuevo</button>
        <button onClick={() => exportToExcel(assets, 'activos', 'Activos')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel</button>
        <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm"><i className="fas fa-file-import mr-1"></i>Importar</button>
        <input ref={fileRef} type="file" accept=".xlsx" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const d = await importFromExcel(f); d.forEach((r: any) => addAsset({ ...r, id: `ACT-${String(assets.length+1).padStart(3,'0')}`, categoriasDatos: [], amenazas: [], vulnerabilidades: [], controles: [] } as Asset)); }} className="hidden" />
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">ID</th><th className="text-left px-3 py-2">Nombre</th><th className="text-left px-3 py-2">Tipo</th><th className="text-center px-3 py-2">Criticidad</th><th className="text-center px-3 py-2">DP</th><th className="text-center px-3 py-2">Acciones</th></tr></thead>
          <tbody>{filtered.map((a: Asset) => (
            <tr key={a.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2 font-mono text-xs">{a.id}</td>
              <td className="px-3 py-2 font-medium text-xs">{a.nombre}</td>
              <td className="px-3 py-2"><span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{a.tipo}</span></td>
              <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs ${a.criticidad === 'Alta' ? 'bg-red-100 text-red-700' : a.criticidad === 'Media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{a.criticidad}</span></td>
              <td className="px-3 py-2 text-center">{a.relacionDatosPersonales ? <i className="fas fa-check text-blue-500"></i> : '-'}</td>
              <td className="px-3 py-2 text-center">
                <button onClick={() => { setForm(a); setEditId(a.id); setShowForm(true); }} className="text-blue-600 mr-2"><i className="fas fa-edit"></i></button>
                <button onClick={() => deleteAsset(a.id)} className="text-red-600"><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold mb-3">{editId ? 'Editar' : 'Nuevo'} Activo</h3>
            <div className="space-y-2">
              <input placeholder="Nombre *" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm"><option>Software</option><option>Hardware</option><option>Base de Datos</option><option>Documento</option><option>Tercero</option><option>Servicio</option></select>
              <input placeholder="Propietario" value={form.propietario} onChange={e => setForm({...form, propietario: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <select value={form.criticidad} onChange={e => setForm({...form, criticidad: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm"><option>Alta</option><option>Media</option><option>Baja</option></select>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.relacionDatosPersonales} onChange={e => setForm({...form, relacionDatosPersonales: e.target.checked})} />Contiene datos personales</label>
            </div>
            <div className="flex gap-2 mt-3"><button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">Guardar</button><button onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-gray-200 rounded text-sm">Cancelar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== RAT ====================
export function RATModule() {
  const { rats, addRAT, updateRAT, deleteRAT } = useEnterprise();
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<RAT>>({ nombre: '', unidadResponsable: '', responsableTratamiento: '', encargadoTratamiento: '', delegadoProteccionDatos: '', finalidad: '', baseLegitimadora: 'Consentimiento', categoriasTitulares: [], categoriasDatos: [], categoriasEspeciales: [], destinatarios: [], transferencias: '', decisionesAutomatizadas: false, plazoConservacion: '', ubicacionBD: '', sistemaAplicacion: '', medidasSeguridad: [], activosRelacionados: [], estado: 'Vigente', fechaCreacion: '', fechaRevision: '', fechaAprobacion: '', nivelRiesgo: 'Medio' });
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = rats.filter((r: RAT) => r.nombre.toLowerCase().includes(filter.toLowerCase()));
  const handleSave = () => {
    if (!form.nombre) return;
    if (editId) { updateRAT(editId, form); } else { const id = `RAT-${String(rats.length + 1).padStart(3, '0')}`; addRAT({ ...form, id, categoriasTitulares: [], categoriasDatos: [], categoriasEspeciales: [], destinatarios: [], medidasSeguridad: [], activosRelacionados: [], fechaCreacion: new Date().toISOString().split('T')[0] } as RAT); }
    setShowForm(false); setEditId(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-3 flex flex-wrap gap-2 items-center">
        <input placeholder="Buscar..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 min-w-40 border rounded px-3 py-1.5 text-sm" />
        <button onClick={() => { setEditId(null); setShowForm(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"><i className="fas fa-plus mr-1"></i>Nuevo</button>
        <button onClick={() => exportToExcel(rats, 'rat', 'RAT')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel</button>
        <button onClick={() => exportToPDF('Registro de Actividades de Tratamiento', rats.map((r: RAT) => ({ heading: r.nombre, text: `Base: ${r.baseLegitimadora} | Finalidad: ${r.finalidad}` })), 'RAT')} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
        <button onClick={() => exportToWord('Registro de Actividades de Tratamiento', rats.map((r: RAT) => ({ heading: r.nombre, text: `Base Jurídica: ${r.baseLegitimadora}\nFinalidad: ${r.finalidad}\nResponsable: ${r.responsableTratamiento}` })), 'RAT')} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"><i className="fas fa-file-word mr-1"></i>Word</button>
        <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm"><i className="fas fa-file-import mr-1"></i>Importar</button>
        <input ref={fileRef} type="file" accept=".xlsx" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const d = await importFromExcel(f); d.forEach((r: any) => addRAT({ ...r, id: `RAT-${String(rats.length+1).padStart(3,'0')}`, categoriasTitulares: [], categoriasDatos: [], categoriasEspeciales: [], destinatarios: [], medidasSeguridad: [], activosRelacionados: [] } as RAT)); }} className="hidden" />
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">ID</th><th className="text-left px-3 py-2">Nombre</th><th className="text-left px-3 py-2">Base</th><th className="text-center px-3 py-2">Riesgo</th><th className="text-center px-3 py-2">Acciones</th></tr></thead>
          <tbody>{filtered.map((r: RAT) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
              <td className="px-3 py-2 text-xs">{r.nombre.length > 40 ? r.nombre.substring(0, 40) + '...' : r.nombre}</td>
              <td className="px-3 py-2"><span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{r.baseLegitimadora}</span></td>
              <td className="px-3 py-2 text-center"><span className={`w-3 h-3 rounded-full inline-block ${r.nivelRiesgo === 'Alto' ? 'bg-red-500' : r.nivelRiesgo === 'Medio' ? 'bg-yellow-500' : 'bg-green-500'}`}></span></td>
              <td className="px-3 py-2 text-center">
                <button onClick={() => { setForm(r); setEditId(r.id); setShowForm(true); }} className="text-blue-600 mr-2"><i className="fas fa-edit"></i></button>
                <button onClick={() => deleteRAT(r.id)} className="text-red-600"><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold mb-3">{editId ? 'Editar' : 'Nuevo'} RAT</h3>
            <div className="space-y-2">
              <input placeholder="Nombre *" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Unidad Responsable" value={form.unidadResponsable} onChange={e => setForm({...form, unidadResponsable: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Finalidad" value={form.finalidad} onChange={e => setForm({...form, finalidad: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <select value={form.baseLegitimadora} onChange={e => setForm({...form, baseLegitimadora: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm"><option>Consentimiento</option><option>Ejecución de contrato</option><option>Obligación legal</option><option>Interés legítimo</option><option>Relación laboral</option></select>
              <select value={form.nivelRiesgo} onChange={e => setForm({...form, nivelRiesgo: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm"><option>Bajo</option><option>Medio</option><option>Alto</option></select>
              <input placeholder="Plazo de conservación" value={form.plazoConservacion} onChange={e => setForm({...form, plazoConservacion: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
            <div className="flex gap-2 mt-3"><button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">Guardar</button><button onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-gray-200 rounded text-sm">Cancelar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== INCIDENTS ====================
export function IncidentsModule() {
  const { incidents, risks, addIncident, updateIncident, deleteIncident, deleteRisk, addRisk } = useEnterprise();
  const [tab, setTab] = useState<'dash' | 'inc' | 'risk'>('dash');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Incident>>({ codigo: '', fechaDeteccion: '', fechaEvento: '', reportante: '', activoAfectado: '', tratamientoAfectado: '', tipo: '', descripcion: '', causaRaiz: '', datosComprometidos: [], titularesAfectados: 0, impacto: 3, probabilidad: 3, severidad: 'Media', estado: 'Abierto', accionesContencion: '', accionesCorrectivas: '', accionesPreventivas: '', responsableRespuesta: '', necesidadNotificacion: false, fechaLimiteNotificacion: '', estadoCierre: '' });

  const handleSave = () => {
    if (!form.codigo) return;
    if (editId) { updateIncident(editId, form); } else { addIncident({ ...form, id: `INC-${Date.now()}`, datosComprometidos: [] } as Incident); }
    setShowForm(false); setEditId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('dash')} className={`px-3 py-1.5 rounded text-sm ${tab === 'dash' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Dashboard</button>
        <button onClick={() => setTab('inc')} className={`px-3 py-1.5 rounded text-sm ${tab === 'inc' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Incidentes</button>
        <button onClick={() => setTab('risk')} className={`px-3 py-1.5 rounded text-sm ${tab === 'risk' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Riesgos</button>
      </div>

      {tab === 'dash' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-red-600">{incidents.filter((i: Incident) => i.estado !== 'Cerrado').length}</p><p className="text-xs text-gray-500">Abiertos</p></div>
          <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-green-600">{incidents.filter((i: Incident) => i.estado === 'Cerrado').length}</p><p className="text-xs text-gray-500">Cerrados</p></div>
          <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-amber-600">{risks.filter((r: Risk) => r.nivelAceptacion === 'No aceptable').length}</p><p className="text-xs text-gray-500">No Aceptables</p></div>
          <div className="bg-white rounded-lg border p-3 text-center"><p className="text-2xl font-bold text-blue-600">{risks.length}</p><p className="text-xs text-gray-500">Total Riesgos</p></div>
        </div>
      )}

      {tab === 'inc' && (
        <>
          <div className="flex gap-2">
            <button onClick={() => { setEditId(null); setForm({ codigo: `INC-${new Date().getFullYear()}-${String(incidents.length+1).padStart(3,'0')}`, fechaDeteccion: new Date().toISOString().split('T')[0], fechaEvento: '', reportante: '', activoAfectado: '', tratamientoAfectado: '', tipo: '', descripcion: '', causaRaiz: '', datosComprometidos: [], titularesAfectados: 0, impacto: 3, probabilidad: 3, severidad: 'Media', estado: 'Abierto', accionesContencion: '', accionesCorrectivas: '', accionesPreventivas: '', responsableRespuesta: '', necesidadNotificacion: false, fechaLimiteNotificacion: '', estadoCierre: '' }); setShowForm(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"><i className="fas fa-plus mr-1"></i>Nuevo</button>
            <button onClick={() => exportToExcel(incidents, 'incidentes', 'Incidentes')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel</button>
            <button onClick={() => exportToPDF('Registro de Incidentes', incidents.map((i: Incident) => ({ heading: i.codigo, text: `${i.tipo} | ${i.severidad}\n${i.descripcion}` })), 'Incidentes')} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
          </div>
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Código</th><th className="text-left px-3 py-2">Tipo</th><th className="text-center px-3 py-2">Severidad</th><th className="text-center px-3 py-2">Estado</th><th className="text-center px-3 py-2">Acciones</th></tr></thead>
              <tbody>{incidents.map((i: Incident) => (
                <tr key={i.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs">{i.codigo}</td>
                  <td className="px-3 py-2 text-xs">{i.tipo}</td>
                  <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs text-white ${i.severidad === 'Alta' || i.severidad === 'Crítica' ? 'bg-red-500' : i.severidad === 'Media' ? 'bg-yellow-500' : 'bg-green-500'}`}>{i.severidad}</span></td>
                  <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs ${i.estado === 'Cerrado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{i.estado}</span></td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => { setForm(i); setEditId(i.id); setShowForm(true); }} className="text-blue-600 mr-2"><i className="fas fa-edit"></i></button>
                    <button onClick={() => deleteIncident(i.id)} className="text-red-600"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'risk' && (
        <>
          <div className="flex gap-2">
            <button onClick={() => exportToExcel(risks, 'riesgos', 'Riesgos')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel</button>
            <button onClick={() => exportToPDF('Matriz de Riesgos', risks.map((r: Risk) => ({ heading: r.nombre, text: `P:${r.probabilidad} I:${r.impacto} Inh:${r.riesgoInherente} Res:${r.riesgoResidual}` })), 'Riesgos')} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-semibold text-sm mb-2">Matriz 5x5</h4>
            <table className="mx-auto text-xs border-collapse">
              <thead><tr><th className="p-1"></th>{[1,2,3,4,5].map(i=><th key={i} className="p-1 text-center border">{i}</th>)}</tr></thead>
              <tbody>{[5,4,3,2,1].map(p=><tr key={p}><td className="p-1 text-center border font-medium">{p}</td>{[1,2,3,4,5].map(im=>{const v=p*im;return<td key={im} className={`p-1 text-center border min-w-[40px] ${v>=15?'bg-red-500 text-white':v>=10?'bg-red-300 text-white':v>=6?'bg-yellow-300':v>=3?'bg-green-300':'bg-green-100'}`}><div className="font-bold">{v}</div><div className="text-[8px]">{risks.filter((r:Risk)=>r.probabilidad===p&&r.impacto===im).length}</div></td>})}</tr>)}</tbody>
            </table>
          </div>
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="text-left px-3 py-2">Riesgo</th><th className="text-center px-3 py-2">P</th><th className="text-center px-3 py-2">I</th><th className="text-center px-3 py-2">Inh</th><th className="text-center px-3 py-2">Res</th><th className="text-center px-3 py-2">Acciones</th></tr></thead>
              <tbody>{risks.map((r: Risk) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs">{r.nombre.length > 30 ? r.nombre.substring(0, 30) + '...' : r.nombre}</td>
                  <td className="px-3 py-2 text-center text-xs">{r.probabilidad}</td>
                  <td className="px-3 py-2 text-center text-xs">{r.impacto}</td>
                  <td className="px-3 py-2 text-center"><span className={`px-1.5 py-0.5 rounded text-xs text-white ${r.riesgoInherente >= 12 ? 'bg-red-500' : r.riesgoInherente >= 6 ? 'bg-yellow-500' : 'bg-green-500'}`}>{r.riesgoInherente}</span></td>
                  <td className="px-3 py-2 text-center"><span className={`px-1.5 py-0.5 rounded text-xs text-white ${r.riesgoResidual >= 8 ? 'bg-red-500' : r.riesgoResidual >= 4 ? 'bg-yellow-500' : 'bg-green-500'}`}>{r.riesgoResidual}</span></td>
                  <td className="px-3 py-2 text-center"><button onClick={() => deleteRisk(r.id)} className="text-red-600"><i className="fas fa-trash"></i></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold mb-3">{editId ? 'Editar' : 'Nuevo'} Incidente</h3>
            <div className="space-y-2">
              <input placeholder="Código" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Tipo" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm h-16" />
              <select value={form.severidad} onChange={e => setForm({...form, severidad: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm"><option>Baja</option><option>Media</option><option>Alta</option><option>Crítica</option></select>
              <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm"><option>Abierto</option><option>En seguimiento</option><option>Cerrado</option></select>
            </div>
            <div className="flex gap-2 mt-3"><button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">Guardar</button><button onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-gray-200 rounded text-sm">Cancelar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== AUDIT ====================
import { lopdpCriteria, iso27001Criteria, iso27002Criteria, iso27701Criteria } from '../data/auditCriteria';

export function AuditModule() {
  const { audits, addAudit, deleteAudit, company } = useEnterprise();
  const [activeTab, setActiveTab] = useState<'existing' | 'lopdp' | 'iso27001' | 'iso27002' | 'iso27701'>('existing');
  const [evaluations, setEvaluations] = useState<Record<string, { cumplimiento: string; evidencia: string; observaciones: string }>>({});

  const handleEvaluate = (criterionId: string, field: string, value: string) => {
    setEvaluations(prev => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        [field]: value,
        cumplimiento: prev[criterionId]?.cumplimiento || '',
        evidencia: prev[criterionId]?.evidencia || '',
        observaciones: prev[criterionId]?.observaciones || ''
      }
    }));
  };

  const calculateScore = (criteria: any[]) => {
    const evaluated = criteria.filter(c => evaluations[c.id]?.cumplimiento);
    if (evaluated.length === 0) return 0;
    const cumple = evaluated.filter(c => evaluations[c.id].cumplimiento === 'Cumple').length;
    const parcial = evaluated.filter(c => evaluations[c.id].cumplimiento === 'Cumple Parcial').length;
    return Math.round(((cumple + parcial * 0.5) / evaluated.length) * 100);
  };

  const saveAudit = (norma: string, criteria: any[]) => {
    const score = calculateScore(criteria);
    const hallazgos = criteria
      .filter(c => evaluations[c.id]?.cumplimiento === 'No Cumple' || evaluations[c.id]?.cumplimiento === 'Cumple Parcial')
      .map((c, idx) => ({
        id: `H-${Date.now()}-${idx}`,
        descripcion: `${c.id}: ${c.description}`,
        severidad: evaluations[c.id].cumplimiento === 'No Cumple' ? 'Mayor' : 'Menor',
        responsable: '',
        fechaCompromiso: '',
        estado: 'Abierto'
      }));

    addAudit({
      id: `AUD-${Date.now()}`,
      nombre: `Auditoría ${norma} - ${new Date().toLocaleDateString('es-EC')}`,
      tipo: norma,
      auditor: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date().toISOString().split('T')[0],
      alcance: `Evaluación de cumplimiento de ${norma}`,
      criterios: criteria.map(c => ({
        id: c.id,
        descripcion: c.description,
        cumplimiento: evaluations[c.id]?.cumplimiento || 'No Evaluado',
        evidencia: evaluations[c.id]?.evidencia || '',
        hallazgo: evaluations[c.id]?.observaciones || '',
        recomendacion: ''
      })),
      scoring: score,
      estado: score >= 80 ? 'Aprobada' : score >= 60 ? 'Aprobada con observaciones' : 'No aprobada',
      hallazgos
    } as any);

    alert('Auditoría guardada exitosamente');
    setActiveTab('existing');
    setEvaluations({});
  };

  const generateFullReport = async (norma: string, criteria: any[], format: 'pdf' | 'word') => {
    if (!company) {
      alert('No hay empresa seleccionada');
      return;
    }

    const score = calculateScore(criteria);
    const hallazgos = criteria
      .filter(c => evaluations[c.id]?.cumplimiento === 'No Cumple' || evaluations[c.id]?.cumplimiento === 'Cumple Parcial')
      .map((c, idx) => ({
        id: `H-${Date.now()}-${idx}`,
        descripcion: `${c.id}: ${c.description}`,
        severidad: evaluations[c.id].cumplimiento === 'No Cumple' ? 'Mayor' : 'Menor',
        recomendacion: evaluations[c.id]?.observaciones || '',
        requisito: c.requirement,
        evidencia: evaluations[c.id]?.evidencia || 'No documentada'
      }));

    const report = {
      company,
      auditType: norma,
      auditDate: new Date().toLocaleDateString('es-EC'),
      auditor: 'Auditor del Sistema',
      criteria,
      evaluations,
      score,
      hallazgos
    };

    try {
      if (format === 'pdf') {
        await generateAuditReportPDF(report);
      } else {
        await generateAuditReportWord(report);
      }
      alert(`Reporte ${format.toUpperCase()} generado exitosamente`);
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte');
    }
  };

  const renderCriteriaTable = (norma: string, criteria: any[]) => {
    const score = calculateScore(criteria);
    const categories = [...new Set(criteria.map(c => c.category))];

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold">{norma}</h3>
              <p className="text-xs text-gray-500">{criteria.length} criterios de evaluación</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{score}%</p>
              <p className="text-xs text-gray-500">Cumplimiento</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => saveAudit(norma, criteria)} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
              <i className="fas fa-save mr-1"></i>Guardar Auditoría
            </button>
            <button onClick={() => generateFullReport(norma, criteria, 'pdf')} className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
              <i className="fas fa-file-pdf mr-1"></i>Reporte PDF Completo
            </button>
            <button onClick={() => generateFullReport(norma, criteria, 'word')} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              <i className="fas fa-file-word mr-1"></i>Reporte Word Completo
            </button>
            <button onClick={() => exportToExcel(criteria.map(c => ({ ID: c.id, Categoria: c.category, Descripcion: c.description, Requisito: c.requirement, Cumplimiento: evaluations[c.id]?.cumplimiento || 'No Evaluado', Evidencia: evaluations[c.id]?.evidencia || '', Observaciones: evaluations[c.id]?.observaciones || '' })), `Auditoria_${norma}`, 'Evaluacion')} className="px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700">
              <i className="fas fa-file-excel mr-1"></i>Exportar Excel
            </button>
          </div>
        </div>

        {categories.map(category => (
          <div key={category} className="bg-white rounded-lg border overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="font-semibold text-sm">{category}</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 w-20">ID</th>
                    <th className="text-left px-3 py-2">Criterio</th>
                    <th className="text-left px-3 py-2">Requisito</th>
                    <th className="text-center px-3 py-2 w-32">Cumplimiento</th>
                    <th className="text-left px-3 py-2">Evidencia</th>
                    <th className="text-left px-3 py-2">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.filter(c => c.category === category).map(criterion => (
                    <tr key={criterion.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-[10px]">{criterion.id}</td>
                      <td className="px-3 py-2">
                        <p className="font-medium">{criterion.description}</p>
                        <p className="text-[10px] text-gray-400">{criterion.evidence}</p>
                      </td>
                      <td className="px-3 py-2 text-[10px] text-gray-600">{criterion.requirement}</td>
                      <td className="px-3 py-2">
                        <select
                          value={evaluations[criterion.id]?.cumplimiento || ''}
                          onChange={(e) => handleEvaluate(criterion.id, 'cumplimiento', e.target.value)}
                          className={`w-full border rounded px-2 py-1 text-[10px] ${
                            evaluations[criterion.id]?.cumplimiento === 'Cumple' ? 'bg-green-50 border-green-300' :
                            evaluations[criterion.id]?.cumplimiento === 'Cumple Parcial' ? 'bg-yellow-50 border-yellow-300' :
                            evaluations[criterion.id]?.cumplimiento === 'No Cumple' ? 'bg-red-50 border-red-300' : ''
                          }`}
                        >
                          <option value="">No Evaluado</option>
                          <option value="Cumple">✓ Cumple</option>
                          <option value="Cumple Parcial">◐ Cumple Parcial</option>
                          <option value="No Cumple">✗ No Cumple</option>
                          <option value="No Aplica">⊘ No Aplica</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={evaluations[criterion.id]?.evidencia || ''}
                          onChange={(e) => handleEvaluate(criterion.id, 'evidencia', e.target.value)}
                          placeholder="Evidencia..."
                          className="w-full border rounded px-2 py-1 text-[10px]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={evaluations[criterion.id]?.observaciones || ''}
                          onChange={(e) => handleEvaluate(criterion.id, 'observaciones', e.target.value)}
                          placeholder="Observaciones..."
                          className="w-full border rounded px-2 py-1 text-[10px]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        <button onClick={() => setActiveTab('existing')} className={`px-4 py-2 rounded text-sm whitespace-nowrap ${activeTab === 'existing' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>
          <i className="fas fa-list mr-1"></i>Auditorías Existentes
        </button>
        <button onClick={() => setActiveTab('lopdp')} className={`px-4 py-2 rounded text-sm whitespace-nowrap ${activeTab === 'lopdp' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>
          <i className="fas fa-shield-alt mr-1"></i>LOPDP
        </button>
        <button onClick={() => setActiveTab('iso27001')} className={`px-4 py-2 rounded text-sm whitespace-nowrap ${activeTab === 'iso27001' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>
          <i className="fas fa-lock mr-1"></i>ISO 27001
        </button>
        <button onClick={() => setActiveTab('iso27002')} className={`px-4 py-2 rounded text-sm whitespace-nowrap ${activeTab === 'iso27002' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>
          <i className="fas fa-tasks mr-1"></i>ISO 27002
        </button>
        <button onClick={() => setActiveTab('iso27701')} className={`px-4 py-2 rounded text-sm whitespace-nowrap ${activeTab === 'iso27701' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>
          <i className="fas fa-user-shield mr-1"></i>ISO 27701
        </button>
      </div>

      {activeTab === 'existing' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => exportToExcel(audits.flatMap((a: any) => a.hallazgos), 'hallazgos', 'Hallazgos')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel Hallazgos</button>
            <button onClick={() => exportToPDF('Informe de Auditoría', audits.map((a: any) => ({ heading: a.nombre, text: `Score: ${a.scoring}/100\n${a.hallazgos.length} hallazgos` })), 'Auditoria')} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
            <button onClick={() => exportToWord('Informe de Auditoría', audits.map((a: any) => ({ heading: a.nombre, text: `Tipo: ${a.tipo}\nAuditor: ${a.auditor}\nScore: ${a.scoring}/100\nHallazgos: ${a.hallazgos.length}` })), 'Auditoria')} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"><i className="fas fa-file-word mr-1"></i>Word</button>
          </div>
          {audits.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <i className="fas fa-clipboard-check text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">No hay auditorías registradas</p>
              <p className="text-xs text-gray-400 mt-1">Crea una nueva auditoría desde las pestañas de normas</p>
            </div>
          ) : (
            audits.map((audit: any) => (
              <div key={audit.id} className="bg-white rounded-lg border overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <div><h4 className="font-semibold">{audit.nombre}</h4><p className="text-xs text-gray-500">{audit.tipo} | {audit.fechaInicio} → {audit.fechaFin}</p></div>
                  <div className="flex items-center gap-3">
                    <div className="text-center"><p className="text-2xl font-bold text-blue-600">{audit.scoring}</p><p className="text-[10px] text-gray-500">Score</p></div>
                    <button onClick={() => deleteAudit(audit.id)} className="text-red-600"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
                <div className="p-4">
                  <h5 className="text-xs font-semibold text-gray-500 mb-2">HALLAZGOS ({audit.hallazgos.length})</h5>
                  {audit.hallazgos.map((h: any) => (
                    <div key={h.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded px-2 py-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full ${h.severidad === 'Crítico' ? 'bg-red-500' : h.severidad === 'Mayor' ? 'bg-orange-500' : 'bg-yellow-500'}`}></span>
                      <span className="flex-1">{h.descripcion}</span>
                      <span className={`px-1.5 py-0.5 rounded ${h.estado === 'Abierto' ? 'bg-red-100 text-red-700' : h.estado === 'Vencido' ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-700'}`}>{h.estado}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'lopdp' && renderCriteriaTable('LOPDP - Ley Orgánica de Protección de Datos Personales', lopdpCriteria)}
      {activeTab === 'iso27001' && renderCriteriaTable('ISO 27001:2022 - Sistema de Gestión de Seguridad de la Información', iso27001Criteria)}
      {activeTab === 'iso27002' && renderCriteriaTable('ISO 27002:2022 - Buenas Prácticas de Seguridad de la Información', iso27002Criteria)}
      {activeTab === 'iso27701' && renderCriteriaTable('ISO 27701:2019 - Sistema de Gestión de Privacidad', iso27701Criteria)}
    </div>
  );
}

// ==================== MATURITY ====================
export function MaturityModule() {
  const { maturity, company } = useEnterprise();
  const globalScore = (maturity.reduce((a: number, b: any) => a + b.nivel, 0) / maturity.length).toFixed(2);
  const radarData = { labels: maturity.map((m: any) => m.nombre.substring(0, 15)), datasets: [{ label: 'Actual', data: maturity.map((m: any) => m.nivel), backgroundColor: 'rgba(59,130,246,0.2)', borderColor: 'rgba(59,130,246,1)', pointBackgroundColor: 'rgba(59,130,246,1)' }] };

  const handleExportMaturity = (format: 'excel' | 'pdf' | 'word') => {
    const maturityData = maturity.map((m: any) => ({
      Dimensión: m.nombre,
      Nivel: m.nivel,
      Estado: ['Inexistente', 'Inicial', 'Repetible', 'Definido', 'Gestionado', 'Optimizado'][m.nivel],
      Descripción: m.descripcion,
      Evidencias: m.evidencias?.join(', ') || 'N/A'
    }));

    if (format === 'excel') {
      exportToExcel(maturityData, 'Evaluacion_Madurez', 'Madurez');
    } else if (format === 'pdf') {
      exportToPDF('Evaluación de Madurez del Cumplimiento', maturityData.map(d => ({ heading: d.Dimensión, text: `Nivel: ${d.Nivel}/5 - ${d.Estado}\n${d.Descripción}\nEvidencias: ${d.Evidencias}` })), 'Evaluacion_Madurez', company?.razonSocial);
    } else {
      exportToWord('Evaluación de Madurez del Cumplimiento', maturityData.map(d => ({ heading: d.Dimensión, text: `Nivel: ${d.Nivel}/5 - ${d.Estado}\n${d.Descripción}\nEvidencias: ${d.Evidencias}` })), 'Evaluacion_Madurez');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-5 text-white">
        <div className="flex justify-between items-center"><div><h3 className="text-lg font-bold">Madurez del Cumplimiento</h3><p className="text-indigo-200 text-xs">Modelo 5 niveles - Guías SPDP</p></div><div className="text-center"><p className="text-3xl font-bold">{globalScore}</p><p className="text-indigo-200 text-xs">/ 5.0</p></div></div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => handleExportMaturity('excel')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"><i className="fas fa-file-excel mr-1"></i>Exportar Excel</button>
        <button onClick={() => handleExportMaturity('pdf')} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"><i className="fas fa-file-pdf mr-1"></i>Exportar PDF</button>
        <button onClick={() => handleExportMaturity('word')} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"><i className="fas fa-file-word mr-1"></i>Exportar Word</button>
      </div>
      <div className="bg-white rounded-lg border p-4"><h4 className="font-semibold text-sm mb-2">Radar de Madurez</h4><div className="h-64"><Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } } }} /></div></div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2">Dimensión</th><th className="text-center px-4 py-2">Nivel</th><th className="text-left px-4 py-2">Estado</th></tr></thead>
          <tbody>{maturity.map((m: any) => (
            <tr key={m.nombre} className="border-t"><td className="px-4 py-2 text-xs">{m.nombre}</td><td className="px-4 py-2 text-center"><div className="flex gap-0.5 justify-center">{[1,2,3,4,5].map(n=><div key={n} className={`w-3 h-3 rounded-sm ${n<=m.nivel?(m.nivel>=4?'bg-green-400':m.nivel>=3?'bg-blue-400':m.nivel>=2?'bg-yellow-400':'bg-red-400'):'bg-gray-200'}`}></div>)}</div></td><td className="px-4 py-2"><span className={`px-2 py-0.5 rounded text-xs ${m.nivel>=4?'bg-green-100 text-green-700':m.nivel>=3?'bg-blue-100 text-blue-700':m.nivel>=2?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{['Inexistente','Inicial','Repetible','Definido','Gestionado','Optimizado'][m.nivel]}</span></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== DOCUMENTS ====================
export function DocumentsModule() {
  const { documents, company, deleteDocument } = useEnterprise();
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<DocType | null>(null);
  const filtered = documents.filter((d: DocType) => d.nombre.toLowerCase().includes(filter.toLowerCase()));

  const handleExportPDF = (doc: DocType) => {
    exportToPDF(doc.nombre, [{ text: doc.contenido }], doc.nombre.replace(/\s+/g, '_'), company?.razonSocial);
  };
  const handleExportWord = (doc: DocType) => {
    exportToWord(doc.nombre, doc.contenido.split('\n').filter((l: string) => l.trim()).map((l: string) => ({ text: l })), doc.nombre.replace(/\s+/g, '_'));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-3 flex gap-2 items-center">
        <input placeholder="Buscar..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 border rounded px-3 py-1.5 text-sm" />
        <button onClick={() => exportToExcel(documents, 'documentos', 'Documentos')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((doc: DocType) => (
          <div key={doc.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-3 border-b bg-gray-50"><h4 className="font-medium text-sm truncate">{doc.nombre}</h4><p className="text-xs text-gray-500">v{doc.version} | {doc.tipo}</p></div>
            <div className="p-3 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Emisión:</span><span>{doc.fechaEmision}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Responsable:</span><span className="truncate ml-2">{doc.responsable}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Estado:</span><span className={`px-2 py-0.5 rounded ${doc.estado === 'Vigente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{doc.estado}</span></div>
            </div>
            <div className="p-2 border-t flex gap-1">
              <button onClick={() => setSelected(doc)} className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100"><i className="fas fa-eye mr-1"></i>Ver</button>
              <button onClick={() => handleExportPDF(doc)} className="flex-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs hover:bg-red-100"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
              <button onClick={() => handleExportWord(doc)} className="flex-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs hover:bg-indigo-100"><i className="fas fa-file-word mr-1"></i>Word</button>
              <button onClick={() => deleteDocument(doc.id)} className="px-2 py-1 bg-gray-50 text-red-600 rounded text-xs hover:bg-red-50"><i className="fas fa-trash"></i></button>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between mb-4"><h3 className="text-lg font-bold">{selected.nombre}</h3><button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button></div>
            <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-4"><p className="text-xs text-amber-700"><i className="fas fa-exclamation-triangle mr-1"></i>BORRADOR EDITABLE - Sujeto a validación jurídica y técnica</p></div>
            <div className="bg-gray-50 rounded p-4"><pre className="text-xs whitespace-pre-wrap font-sans">{selected.contenido}</pre></div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleExportPDF(selected)} className="px-4 py-2 bg-red-600 text-white rounded text-sm"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
              <button onClick={() => handleExportWord(selected)} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"><i className="fas fa-file-word mr-1"></i>Word</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== LOGS ====================
export function LogsModule() {
  const { logs, resetToDemo } = useStore();
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4 flex justify-between items-center">
        <div><h4 className="font-semibold">Bitácora de Auditoría</h4><p className="text-xs text-gray-500">{logs.length} registros</p></div>
        <div className="flex gap-2">
          <button onClick={() => exportToExcel(logs, 'bitacora', 'Bitácora')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel</button>
          <button onClick={resetToDemo} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded text-sm"><i className="fas fa-rotate-left mr-1"></i>Restaurar Demo</button>
        </div>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2">Fecha</th><th className="text-left px-4 py-2">Usuario</th><th className="text-left px-4 py-2">Acción</th><th className="text-left px-4 py-2">Módulo</th><th className="text-left px-4 py-2">Detalle</th></tr></thead>
          <tbody>{[...logs].reverse().slice(0, 100).map((log: any) => (
            <tr key={log.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 text-xs font-mono text-gray-500">{new Date(log.timestamp).toLocaleString('es-EC')}</td>
              <td className="px-4 py-2 text-xs">{log.userName}</td>
              <td className="px-4 py-2"><span className={`px-2 py-0.5 rounded text-xs ${log.action === 'Crear' ? 'bg-green-100 text-green-700' : log.action === 'Editar' ? 'bg-blue-100 text-blue-700' : log.action === 'Eliminar' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{log.action}</span></td>
              <td className="px-4 py-2 text-xs">{log.module}</td>
              <td className="px-4 py-2 text-xs text-gray-600">{log.detail}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

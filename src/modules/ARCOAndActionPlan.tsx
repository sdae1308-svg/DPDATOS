import { useState, useRef } from 'react';
import { useEnterprise } from '../store/useEnterprise';
import { exportToExcel, exportToPDF, exportToWord, importFromExcel } from '../utils/exportUtils';
import type { ARCORequest, ActionPlan } from '../data/demoData';

// ==================== DERECHOS ARCO ====================
export function ARCOModule() {
  const { arcoRequests, addARCORequest, updateARCORequest, deleteARCORequest, company } = useEnterprise();
  const [filter, setFilter] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ARCORequest | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<ARCORequest>>({
    codigo: '', fechaSolicitud: '', fechaLimiteRespuesta: '', fechaRespuesta: '',
    titularNombre: '', titularCedula: '', titularEmail: '', titularTelefono: '',
    tipoDerecho: 'Acceso', tratamientoRelacionado: '', descripcion: '',
    estado: 'Recibida', respuesta: '', responsable: '', observaciones: '', diasTranscurridos: 0
  });

  const filtered = arcoRequests.filter((r: ARCORequest) => {
    const matchName = r.titularNombre.toLowerCase().includes(filter.toLowerCase()) || r.codigo.toLowerCase().includes(filter.toLowerCase());
    const matchEstado = !filterEstado || r.estado === filterEstado;
    const matchTipo = !filterTipo || r.tipoDerecho === filterTipo;
    return matchName && matchEstado && matchTipo;
  });

  const calcularDias = (fechaSolicitud: string) => {
    const inicio = new Date(fechaSolicitud);
    const hoy = new Date();
    return Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSave = () => {
    if (!form.codigo || !form.titularNombre || !form.fechaSolicitud) return;
    const dias = calcularDias(form.fechaSolicitud);
    if (editId) {
      updateARCORequest(editId, { ...form, diasTranscurridos: dias });
    } else {
      addARCORequest({ ...form, diasTranscurridos: dias } as ARCORequest);
    }
    setShowForm(false); setEditId(null);
    setForm({ codigo: '', fechaSolicitud: '', fechaLimiteRespuesta: '', fechaRespuesta: '', titularNombre: '', titularCedula: '', titularEmail: '', titularTelefono: '', tipoDerecho: 'Acceso', tratamientoRelacionado: '', descripcion: '', estado: 'Recibida', respuesta: '', responsable: '', observaciones: '', diasTranscurridos: 0 });
  };

  const handleEdit = (r: ARCORequest) => {
    setForm(r);
    setEditId(r.id);
    setShowForm(true);
  };

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'Cerrada': return 'bg-green-100 text-green-700';
      case 'Respondida': return 'bg-blue-100 text-blue-700';
      case 'En proceso': return 'bg-yellow-100 text-yellow-700';
      case 'En análisis': return 'bg-purple-100 text-purple-700';
      case 'Recibida': return 'bg-gray-100 text-gray-700';
      case 'Vencida': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const vencidas = arcoRequests.filter((r: ARCORequest) => {
    if (r.estado === 'Cerrada' || r.estado === 'Respondida') return false;
    const dias = calcularDias(r.fechaSolicitud);
    return dias > 15;
  });

  const porVencer = arcoRequests.filter((r: ARCORequest) => {
    if (r.estado === 'Cerrada' || r.estado === 'Respondida') return false;
    const dias = calcularDias(r.fechaSolicitud);
    return dias >= 10 && dias <= 15;
  });

  const handleExport = (format: 'excel' | 'pdf' | 'word') => {
    const data = arcoRequests.map(r => ({
      Código: r.codigo,
      Fecha: r.fechaSolicitud,
      Titular: r.titularNombre,
      Cédula: r.titularCedula,
      Tipo: r.tipoDerecho,
      Estado: r.estado,
      'Días Transcurridos': calcularDias(r.fechaSolicitud),
      Responsable: r.responsable
    }));

    if (format === 'excel') {
      exportToExcel(data, 'Derechos_ARCO', 'Solicitudes');
    } else if (format === 'pdf') {
      exportToPDF('Registro de Solicitudes de Derechos ARCO', data.map(d => ({ heading: `${d.Código} - ${d.Titular}`, text: `Tipo: ${d.Tipo}\nFecha: ${d.Fecha}\nEstado: ${d.Estado}\nDías: ${d['Días Transcurridos']}\nResponsable: ${d.Responsable}` })), 'Derechos_ARCO', company?.razonSocial);
    } else {
      exportToWord('Registro de Solicitudes de Derechos ARCO', data.map(d => ({ heading: `${d.Código} - ${d.Titular}`, text: `Tipo: ${d.Tipo}\nFecha: ${d.Fecha}\nEstado: ${d.Estado}\nDías: ${d['Días Transcurridos']}\nResponsable: ${d.Responsable}` })), 'Derechos_ARCO');
    }
  };

  return (
    <div className="space-y-4">
      {/* Alertas */}
      {vencidas.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700 font-semibold"><i className="fas fa-exclamation-triangle mr-2"></i>{vencidas.length} solicitud(es) VENCIDA(S) - Requieren atención inmediata</p>
          <div className="mt-2 space-y-1">
            {vencidas.map(r => (
              <p key={r.id} className="text-xs text-red-600">• {r.codigo} - {r.titularNombre} ({calcularDias(r.fechaSolicitud)} días)</p>
            ))}
          </div>
        </div>
      )}
      {porVencer.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-700 font-semibold"><i className="fas fa-clock mr-2"></i>{porVencer.length} solicitud(es) por vencer (plazo legal: 15 días)</p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{arcoRequests.length}</p>
          <p className="text-xs text-gray-500">Total Solicitudes</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{arcoRequests.filter((r: ARCORequest) => r.estado === 'Cerrada' || r.estado === 'Respondida').length}</p>
          <p className="text-xs text-gray-500">Atendidas</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">{arcoRequests.filter((r: ARCORequest) => r.estado !== 'Cerrada' && r.estado !== 'Respondida' && r.estado !== 'Vencida').length}</p>
          <p className="text-xs text-gray-500">En Proceso</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{vencidas.length}</p>
          <p className="text-xs text-gray-500">Vencidas</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{arcoRequests.filter((r: ARCORequest) => r.tipoDerecho === 'Cancelación').length}</p>
          <p className="text-xs text-gray-500">Cancelaciones</p>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="bg-white rounded-lg border p-3 flex flex-wrap gap-2 items-center">
        <input type="text" placeholder="Buscar por titular o código..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 min-w-40 border rounded px-3 py-1.5 text-sm" />
        <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="border rounded px-3 py-1.5 text-sm">
          <option value="">Todos los estados</option>
          <option value="Recibida">Recibida</option>
          <option value="En análisis">En análisis</option>
          <option value="En proceso">En proceso</option>
          <option value="Respondida">Respondida</option>
          <option value="Cerrada">Cerrada</option>
          <option value="Vencida">Vencida</option>
        </select>
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="border rounded px-3 py-1.5 text-sm">
          <option value="">Todos los tipos</option>
          <option value="Acceso">Acceso</option>
          <option value="Rectificación">Rectificación</option>
          <option value="Cancelación">Cancelación</option>
          <option value="Oposición">Oposición</option>
          <option value="Portabilidad">Portabilidad</option>
          <option value="Limitación">Limitación</option>
        </select>
        <button onClick={() => { setEditId(null); setForm({ codigo: `ARCO-${new Date().getFullYear()}-${String(arcoRequests.length + 1).padStart(3, '0')}`, fechaSolicitud: new Date().toISOString().split('T')[0], fechaLimiteRespuesta: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], tipoDerecho: 'Acceso', estado: 'Recibida', diasTranscurridos: 0 }); setShowForm(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"><i className="fas fa-plus mr-1"></i>Nueva</button>
        <button onClick={() => handleExport('excel')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel</button>
        <button onClick={() => handleExport('pdf')} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
        <button onClick={() => handleExport('word')} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"><i className="fas fa-file-word mr-1"></i>Word</button>
        <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm"><i className="fas fa-file-import mr-1"></i>Importar</button>
        <input ref={fileRef} type="file" accept=".xlsx" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const d = await importFromExcel(f); d.forEach((r: any) => addARCORequest({ ...r, id: `ARCO-${Date.now()}-${Math.random()}`, diasTranscurridos: calcularDias(r.fechaSolicitud) } as ARCORequest)); }} className="hidden" />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2">Código</th>
                <th className="text-left px-3 py-2">Titular</th>
                <th className="text-left px-3 py-2">Tipo</th>
                <th className="text-center px-3 py-2">Fecha</th>
                <th className="text-center px-3 py-2">Días</th>
                <th className="text-center px-3 py-2">Estado</th>
                <th className="text-left px-3 py-2">Responsable</th>
                <th className="text-center px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r: ARCORequest) => {
                const dias = calcularDias(r.fechaSolicitud);
                return (
                  <tr key={r.id} className={`border-t hover:bg-gray-50 ${r.estado === 'Vencida' ? 'bg-red-50' : dias > 10 && r.estado !== 'Cerrada' && r.estado !== 'Respondida' ? 'bg-amber-50' : ''}`}>
                    <td className="px-3 py-2 font-mono text-xs">{r.codigo}</td>
                    <td className="px-3 py-2">
                      <p className="text-xs font-medium">{r.titularNombre}</p>
                      <p className="text-[10px] text-gray-400">{r.titularCedula}</p>
                    </td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{r.tipoDerecho}</span></td>
                    <td className="px-3 py-2 text-center text-xs">{r.fechaSolicitud}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${dias > 15 ? 'bg-red-500 text-white' : dias > 10 ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'}`}>{dias}</span>
                    </td>
                    <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs ${estadoColor(r.estado)}`}>{r.estado}</span></td>
                    <td className="px-3 py-2 text-xs">{r.responsable}</td>
                    <td className="px-3 py-2 text-center">
                      <button onClick={() => setSelected(r)} className="text-blue-600 mr-1" title="Ver"><i className="fas fa-eye"></i></button>
                      <button onClick={() => handleEdit(r)} className="text-amber-600 mr-1" title="Editar"><i className="fas fa-edit"></i></button>
                      <button onClick={() => deleteARCORequest(r.id)} className="text-red-600" title="Eliminar"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{selected.codigo}</h3>
                <p className="text-sm text-gray-500">{selected.tipoDerecho} - {selected.estado}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Titular:</span> <span className="font-medium">{selected.titularNombre}</span></div>
              <div><span className="text-gray-500">Cédula:</span> <span className="font-medium">{selected.titularCedula}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selected.titularEmail}</span></div>
              <div><span className="text-gray-500">Teléfono:</span> <span className="font-medium">{selected.titularTelefono}</span></div>
              <div><span className="text-gray-500">Fecha Solicitud:</span> <span className="font-medium">{selected.fechaSolicitud}</span></div>
              <div><span className="text-gray-500">Fecha Límite:</span> <span className="font-medium">{selected.fechaLimiteRespuesta}</span></div>
              <div><span className="text-gray-500">Tratamiento:</span> <span className="font-medium">{selected.tratamientoRelacionado}</span></div>
              <div><span className="text-gray-500">Responsable:</span> <span className="font-medium">{selected.responsable}</span></div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-1">Descripción de la Solicitud</h4>
              <p className="text-sm bg-gray-50 rounded p-3">{selected.descripcion}</p>
            </div>
            {selected.respuesta && (
              <div className="mt-3">
                <h4 className="font-semibold text-sm mb-1">Respuesta</h4>
                <p className="text-sm bg-green-50 rounded p-3">{selected.respuesta}</p>
              </div>
            )}
            {selected.observaciones && (
              <div className="mt-3">
                <h4 className="font-semibold text-sm mb-1">Observaciones</h4>
                <p className="text-sm bg-blue-50 rounded p-3">{selected.observaciones}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold mb-3">{editId ? 'Editar' : 'Nueva'} Solicitud ARCO</h3>
            <div className="space-y-2">
              <input placeholder="Código *" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Nombre del Titular *" value={form.titularNombre} onChange={e => setForm({...form, titularNombre: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Cédula" value={form.titularCedula} onChange={e => setForm({...form, titularCedula: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Email" value={form.titularEmail} onChange={e => setForm({...form, titularEmail: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
                <input placeholder="Teléfono" value={form.titularTelefono} onChange={e => setForm({...form, titularTelefono: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={form.tipoDerecho} onChange={e => setForm({...form, tipoDerecho: e.target.value as any})} className="w-full border rounded px-3 py-1.5 text-sm">
                  <option>Acceso</option><option>Rectificación</option><option>Cancelación</option><option>Oposición</option><option>Portabilidad</option><option>Limitación</option>
                </select>
                <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value as any})} className="w-full border rounded px-3 py-1.5 text-sm">
                  <option>Recibida</option><option>En análisis</option><option>En proceso</option><option>Respondida</option><option>Cerrada</option><option>Vencida</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-gray-500">Fecha Solicitud *</label><input type="date" value={form.fechaSolicitud} onChange={e => setForm({...form, fechaSolicitud: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" /></div>
                <div><label className="text-xs text-gray-500">Fecha Límite</label><input type="date" value={form.fechaLimiteRespuesta} onChange={e => setForm({...form, fechaLimiteRespuesta: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" /></div>
              </div>
              <input placeholder="Tratamiento relacionado" value={form.tratamientoRelacionado} onChange={e => setForm({...form, tratamientoRelacionado: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Responsable" value={form.responsable} onChange={e => setForm({...form, responsable: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <textarea placeholder="Descripción de la solicitud" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm h-16" />
              <textarea placeholder="Respuesta" value={form.respuesta} onChange={e => setForm({...form, respuesta: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm h-16" />
              <textarea placeholder="Observaciones" value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm h-16" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">Guardar</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-gray-200 rounded text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PLAN DE ACCIÓN ====================
export function ActionPlanModule() {
  const { actionPlans, addActionPlan, updateActionPlan, deleteActionPlan, company } = useEnterprise();
  const [filter, setFilter] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterPrioridad, setFilterPrioridad] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ActionPlan | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<ActionPlan>>({
    codigo: '', titulo: '', descripcion: '', origen: 'Hallazgo', origenReferencia: '',
    prioridad: 'Media', responsable: '', fechaCreacion: '', fechaCompromiso: '', fechaCierre: '',
    estado: 'Pendiente', progreso: 0, acciones: [], observaciones: ''
  });

  const filtered = actionPlans.filter((p: ActionPlan) => {
    const matchName = p.titulo.toLowerCase().includes(filter.toLowerCase()) || p.codigo.toLowerCase().includes(filter.toLowerCase());
    const matchEstado = !filterEstado || p.estado === filterEstado;
    const matchPrioridad = !filterPrioridad || p.prioridad === filterPrioridad;
    return matchName && matchEstado && matchPrioridad;
  });

  const handleSave = () => {
    if (!form.codigo || !form.titulo) return;
    if (editId) {
      updateActionPlan(editId, form);
    } else {
      addActionPlan(form as ActionPlan);
    }
    setShowForm(false); setEditId(null);
    setForm({ codigo: '', titulo: '', descripcion: '', origen: 'Hallazgo', origenReferencia: '', prioridad: 'Media', responsable: '', fechaCreacion: '', fechaCompromiso: '', fechaCierre: '', estado: 'Pendiente', progreso: 0, acciones: [], observaciones: '' });
  };

  const handleEdit = (p: ActionPlan) => {
    setForm(p);
    setEditId(p.id);
    setShowForm(true);
  };

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'Completada': return 'bg-green-100 text-green-700';
      case 'En progreso': return 'bg-blue-100 text-blue-700';
      case 'Pendiente': return 'bg-gray-100 text-gray-700';
      case 'Vencida': return 'bg-red-100 text-red-700';
      case 'Cancelada': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const prioridadColor = (p: string) => {
    switch (p) {
      case 'Crítica': return 'bg-red-500 text-white';
      case 'Alta': return 'bg-orange-500 text-white';
      case 'Media': return 'bg-yellow-500 text-white';
      case 'Baja': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const vencidas = actionPlans.filter((p: ActionPlan) => {
    if (p.estado === 'Completada' || p.estado === 'Cancelada') return false;
    return new Date(p.fechaCompromiso) < new Date();
  });

  const handleExport = (format: 'excel' | 'pdf' | 'word') => {
    const data = actionPlans.map(p => ({
      Código: p.codigo,
      Título: p.titulo,
      Origen: p.origen,
      Prioridad: p.prioridad,
      Responsable: p.responsable,
      'Fecha Compromiso': p.fechaCompromiso,
      Progreso: `${p.progreso}%`,
      Estado: p.estado
    }));

    if (format === 'excel') {
      exportToExcel(data, 'Plan_de_Accion', 'Acciones');
    } else if (format === 'pdf') {
      exportToPDF('Plan de Acción - Seguimiento de Mejoras', data.map(d => ({ heading: `${d.Código} - ${d.Título}`, text: `Origen: ${d.Origen}\nPrioridad: ${d.Prioridad}\nResponsable: ${d.Responsable}\nCompromiso: ${d['Fecha Compromiso']}\nProgreso: ${d.Progreso}\nEstado: ${d.Estado}` })), 'Plan_de_Accion', company?.razonSocial);
    } else {
      exportToWord('Plan de Acción - Seguimiento de Mejoras', data.map(d => ({ heading: `${d.Código} - ${d.Título}`, text: `Origen: ${d.Origen}\nPrioridad: ${d.Prioridad}\nResponsable: ${d.Responsable}\nCompromiso: ${d['Fecha Compromiso']}\nProgreso: ${d.Progreso}\nEstado: ${d.Estado}` })), 'Plan_de_Accion');
    }
  };

  return (
    <div className="space-y-4">
      {/* Alertas */}
      {vencidas.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700 font-semibold"><i className="fas fa-exclamation-triangle mr-2"></i>{vencidas.length} acción(es) VENCIDA(S)</p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{actionPlans.length}</p>
          <p className="text-xs text-gray-500">Total Acciones</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{actionPlans.filter((p: ActionPlan) => p.estado === 'Completada').length}</p>
          <p className="text-xs text-gray-500">Completadas</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{actionPlans.filter((p: ActionPlan) => p.estado === 'En progreso').length}</p>
          <p className="text-xs text-gray-500">En Progreso</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{vencidas.length}</p>
          <p className="text-xs text-gray-500">Vencidas</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{Math.round(actionPlans.reduce((a: number, b: ActionPlan) => a + b.progreso, 0) / Math.max(actionPlans.length, 1))}%</p>
          <p className="text-xs text-gray-500">Progreso Promedio</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border p-3 flex flex-wrap gap-2 items-center">
        <input type="text" placeholder="Buscar..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 min-w-40 border rounded px-3 py-1.5 text-sm" />
        <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="border rounded px-3 py-1.5 text-sm">
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Completada">Completada</option>
          <option value="Vencida">Vencida</option>
          <option value="Cancelada">Cancelada</option>
        </select>
        <select value={filterPrioridad} onChange={e => setFilterPrioridad(e.target.value)} className="border rounded px-3 py-1.5 text-sm">
          <option value="">Todas las prioridades</option>
          <option value="Crítica">Crítica</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <button onClick={() => { setEditId(null); setForm({ codigo: `PA-${new Date().getFullYear()}-${String(actionPlans.length + 1).padStart(3, '0')}`, titulo: '', descripcion: '', origen: 'Hallazgo', origenReferencia: '', prioridad: 'Media', responsable: '', fechaCreacion: new Date().toISOString().split('T')[0], fechaCompromiso: '', fechaCierre: '', estado: 'Pendiente', progreso: 0, acciones: [], observaciones: '' }); setShowForm(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"><i className="fas fa-plus mr-1"></i>Nueva</button>
        <button onClick={() => handleExport('excel')} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"><i className="fas fa-file-excel mr-1"></i>Excel</button>
        <button onClick={() => handleExport('pdf')} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm"><i className="fas fa-file-pdf mr-1"></i>PDF</button>
        <button onClick={() => handleExport('word')} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"><i className="fas fa-file-word mr-1"></i>Word</button>
        <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm"><i className="fas fa-file-import mr-1"></i>Importar</button>
        <input ref={fileRef} type="file" accept=".xlsx" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const d = await importFromExcel(f); d.forEach((p: any) => addActionPlan({ ...p, id: `PA-${Date.now()}-${Math.random()}`, acciones: [] } as ActionPlan)); }} className="hidden" />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2">Código</th>
                <th className="text-left px-3 py-2">Título</th>
                <th className="text-left px-3 py-2">Origen</th>
                <th className="text-center px-3 py-2">Prioridad</th>
                <th className="text-left px-3 py-2">Responsable</th>
                <th className="text-center px-3 py-2">Compromiso</th>
                <th className="text-center px-3 py-2">Progreso</th>
                <th className="text-center px-3 py-2">Estado</th>
                <th className="text-center px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: ActionPlan) => (
                <tr key={p.id} className={`border-t hover:bg-gray-50 ${p.estado === 'Vencida' ? 'bg-red-50' : ''}`}>
                  <td className="px-3 py-2 font-mono text-xs">{p.codigo}</td>
                  <td className="px-3 py-2 text-xs font-medium max-w-xs truncate">{p.titulo}</td>
                  <td className="px-3 py-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{p.origen}</span></td>
                  <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs ${prioridadColor(p.prioridad)}`}>{p.prioridad}</span></td>
                  <td className="px-3 py-2 text-xs">{p.responsable}</td>
                  <td className="px-3 py-2 text-center text-xs">{p.fechaCompromiso}</td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center gap-1">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${p.progreso >= 100 ? 'bg-green-500' : p.progreso >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${p.progreso}%` }}></div>
                      </div>
                      <span className="text-xs">{p.progreso}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded text-xs ${estadoColor(p.estado)}`}>{p.estado}</span></td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => setSelected(p)} className="text-blue-600 mr-1" title="Ver"><i className="fas fa-eye"></i></button>
                    <button onClick={() => handleEdit(p)} className="text-amber-600 mr-1" title="Editar"><i className="fas fa-edit"></i></button>
                    <button onClick={() => deleteActionPlan(p.id)} className="text-red-600" title="Eliminar"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{selected.titulo}</h3>
                <p className="text-sm text-gray-500">{selected.codigo} | {selected.origen}: {selected.origenReferencia}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Prioridad:</span> <span className={`px-2 py-0.5 rounded text-xs ${prioridadColor(selected.prioridad)}`}>{selected.prioridad}</span></div>
              <div><span className="text-gray-500">Estado:</span> <span className={`px-2 py-0.5 rounded text-xs ${estadoColor(selected.estado)}`}>{selected.estado}</span></div>
              <div><span className="text-gray-500">Responsable:</span> <span className="font-medium">{selected.responsable}</span></div>
              <div><span className="text-gray-500">Progreso:</span> <span className="font-medium">{selected.progreso}%</span></div>
              <div><span className="text-gray-500">Fecha Creación:</span> <span>{selected.fechaCreacion}</span></div>
              <div><span className="text-gray-500">Fecha Compromiso:</span> <span>{selected.fechaCompromiso}</span></div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-1">Descripción</h4>
              <p className="text-sm bg-gray-50 rounded p-3">{selected.descripcion}</p>
            </div>
            {selected.acciones.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold text-sm mb-2">Acciones ({selected.acciones.filter(a => a.completada).length}/{selected.acciones.length})</h4>
                <div className="space-y-1">
                  {selected.acciones.map((a, i) => (
                    <div key={i} className={`flex items-start gap-2 text-xs p-2 rounded ${a.completada ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <span>{a.completada ? '✅' : '⬜'}</span>
                      <div className="flex-1">
                        <p className="font-medium">{a.descripcion}</p>
                        <p className="text-gray-500">{a.fecha} | {a.responsable}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selected.observaciones && (
              <div className="mt-3">
                <h4 className="font-semibold text-sm mb-1">Observaciones</h4>
                <p className="text-sm bg-blue-50 rounded p-3">{selected.observaciones}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold mb-3">{editId ? 'Editar' : 'Nueva'} Acción</h3>
            <div className="space-y-2">
              <input placeholder="Código *" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <input placeholder="Título *" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm h-16" />
              <div className="grid grid-cols-2 gap-2">
                <select value={form.origen} onChange={e => setForm({...form, origen: e.target.value as any})} className="w-full border rounded px-3 py-1.5 text-sm">
                  <option>Auditoría</option><option>Incidente</option><option>Riesgo</option><option>Hallazgo</option><option>Mejora Continua</option><option>Obligación Legal</option>
                </select>
                <input placeholder="Referencia origen" value={form.origenReferencia} onChange={e => setForm({...form, origenReferencia: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={form.prioridad} onChange={e => setForm({...form, prioridad: e.target.value as any})} className="w-full border rounded px-3 py-1.5 text-sm">
                  <option>Crítica</option><option>Alta</option><option>Media</option><option>Baja</option>
                </select>
                <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value as any})} className="w-full border rounded px-3 py-1.5 text-sm">
                  <option>Pendiente</option><option>En progreso</option><option>Completada</option><option>Vencida</option><option>Cancelada</option>
                </select>
              </div>
              <input placeholder="Responsable" value={form.responsable} onChange={e => setForm({...form, responsable: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-gray-500">Fecha Creación</label><input type="date" value={form.fechaCreacion} onChange={e => setForm({...form, fechaCreacion: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" /></div>
                <div><label className="text-xs text-gray-500">Fecha Compromiso</label><input type="date" value={form.fechaCompromiso} onChange={e => setForm({...form, fechaCompromiso: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm" /></div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Progreso (%)</label>
                <input type="number" min="0" max="100" value={form.progreso} onChange={e => setForm({...form, progreso: parseInt(e.target.value) || 0})} className="w-full border rounded px-3 py-1.5 text-sm" />
              </div>
              <textarea placeholder="Observaciones" value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} className="w-full border rounded px-3 py-1.5 text-sm h-16" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">Guardar</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-gray-200 rounded text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

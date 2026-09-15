import { useState } from 'react';
import { useStore } from '../store/store';
import type { Employee } from '../data/demoData';

export default function EmployeesModule() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filter, setFilter] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterConsent, setFilterConsent] = useState('');
  const [form, setForm] = useState<Partial<Employee>>({
    nombre: '', cedula: '', cargo: '', area: '', fechaIngreso: '', tipoRelacion: 'Indefinido',
    nivelAccesoDatos: 'Bajo', confidencialidadFirmada: false, consentimientoFirmado: false,
    capacitaciones: [], incidentesAsociados: [], observaciones: '', estado: 'Activo', accesoActivos: []
  });

  const areas = [...new Set(employees.map(e => e.area))];
  const filtered = employees.filter(e => {
    const matchName = e.nombre.toLowerCase().includes(filter.toLowerCase()) || e.cargo.toLowerCase().includes(filter.toLowerCase());
    const matchArea = !filterArea || e.area === filterArea;
    const matchConsent = !filterConsent || (filterConsent === 'pending' ? (!e.consentimientoFirmado || !e.confidencialidadFirmada) : true);
    return matchName && matchArea && matchConsent;
  });

  const handleSave = () => {
    if (!form.nombre || !form.cedula) return;
    const id = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    addEmployee({ ...form, id, accesoActivos: form.accesoActivos || [] } as Employee);
    setShowForm(false);
    setForm({ nombre: '', cedula: '', cargo: '', area: '', fechaIngreso: '', tipoRelacion: 'Indefinido', nivelAccesoDatos: 'Bajo', confidencialidadFirmada: false, consentimientoFirmado: false, capacitaciones: [], incidentesAsociados: [], observaciones: '', estado: 'Activo', accesoActivos: [] });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-48">
            <input type="text" placeholder="Buscar por nombre o cargo..." value={filter} onChange={e => setFilter(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <select value={filterArea} onChange={e => setFilterArea(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
            <option value="">Todas las áreas</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filterConsent} onChange={e => setFilterConsent(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
            <option value="">Todos</option>
            <option value="pending">Con consentimiento pendiente</option>
          </select>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            <i className="fas fa-plus mr-1"></i>Nuevo Empleado
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
          <p className="text-xs text-gray-500">Total Empleados</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{employees.filter(e => e.consentimientoFirmado && e.confidencialidadFirmada).length}</p>
          <p className="text-xs text-gray-500">Documentación Completa</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{employees.filter(e => !e.consentimientoFirmado || !e.confidencialidadFirmada).length}</p>
          <p className="text-xs text-gray-500">Pendientes</p>
        </div>
        <div className="bg-white rounded-lg border p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{employees.filter(e => e.capacitaciones.length > 0).length}</p>
          <p className="text-xs text-gray-500">Capacitados</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cargo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Área</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Acceso</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Confid.</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Consent.</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Capacit.</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{emp.nombre}</p>
                    <p className="text-xs text-gray-400">{emp.cedula}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{emp.cargo}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{emp.area}</span></td>
                  <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded text-xs text-white ${emp.nivelAccesoDatos === 'Alto' ? 'bg-red-500' : emp.nivelAccesoDatos === 'Medio' ? 'bg-yellow-500' : 'bg-green-500'}`}>{emp.nivelAccesoDatos}</span></td>
                  <td className="px-4 py-3 text-center">{emp.confidencialidadFirmada ? <i className="fas fa-check-circle text-green-500"></i> : <i className="fas fa-times-circle text-red-500"></i>}</td>
                  <td className="px-4 py-3 text-center">{emp.consentimientoFirmado ? <i className="fas fa-check-circle text-green-500"></i> : <i className="fas fa-times-circle text-red-500"></i>}</td>
                  <td className="px-4 py-3 text-center"><span className="text-xs">{emp.capacitaciones.length} curso(s)</span></td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelectedEmployee(emp)} className="text-blue-600 hover:text-blue-800 mr-2" title="Ver detalle"><i className="fas fa-eye"></i></button>
                    <button onClick={() => updateEmployee(emp.id, { consentimientoFirmado: !emp.consentimientoFirmado })} className="text-amber-600 hover:text-amber-800 mr-2" title="Toggle consentimiento"><i className="fas fa-file-signature"></i></button>
                    <button onClick={() => deleteEmployee(emp.id)} className="text-red-600 hover:text-red-800" title="Eliminar"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedEmployee.nombre}</h3>
                  <p className="text-sm text-gray-500">{selectedEmployee.cargo} | {selectedEmployee.area}</p>
                </div>
                <button onClick={() => setSelectedEmployee(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Cédula:</span> <span className="font-medium">{selectedEmployee.cedula}</span></div>
                <div><span className="text-gray-500">Fecha Ingreso:</span> <span className="font-medium">{selectedEmployee.fechaIngreso}</span></div>
                <div><span className="text-gray-500">Tipo Relación:</span> <span className="font-medium">{selectedEmployee.tipoRelacion}</span></div>
                <div><span className="text-gray-500">Nivel Acceso:</span> <span className={`px-2 py-0.5 rounded text-xs text-white ${selectedEmployee.nivelAccesoDatos === 'Alto' ? 'bg-red-500' : selectedEmployee.nivelAccesoDatos === 'Medio' ? 'bg-yellow-500' : 'bg-green-500'}`}>{selectedEmployee.nivelAccesoDatos}</span></div>
                <div><span className="text-gray-500">Confidencialidad:</span> {selectedEmployee.confidencialidadFirmada ? <span className="text-green-600">✓ Firmada</span> : <span className="text-red-600">✗ Pendiente</span>}</div>
                <div><span className="text-gray-500">Consentimiento:</span> {selectedEmployee.consentimientoFirmado ? <span className="text-green-600">✓ Firmado</span> : <span className="text-red-600">✗ Pendiente</span>}</div>
              </div>
              {selectedEmployee.capacitaciones.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Capacitaciones</h4>
                  <div className="space-y-1">
                    {selectedEmployee.capacitaciones.map((c, i) => (
                      <div key={i} className="flex justify-between text-xs bg-gray-50 rounded px-3 py-2">
                        <span>{c.tema}</span>
                        <span className={`px-2 py-0.5 rounded ${c.estado === 'Aprobado' ? 'bg-green-100 text-green-700' : c.estado === 'Reprobado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.estado}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedEmployee.observaciones && <p className="mt-4 text-sm text-gray-500 italic">Obs: {selectedEmployee.observaciones}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold mb-4">Nuevo Empleado</h3>
            <div className="space-y-3">
              <input placeholder="Nombre completo *" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              <input placeholder="Cédula *" value={form.cedula} onChange={e => setForm({...form, cedula: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              <input placeholder="Cargo" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              <input placeholder="Área" value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              <input type="date" value={form.fechaIngreso} onChange={e => setForm({...form, fechaIngreso: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
              <select value={form.nivelAccesoDatos} onChange={e => setForm({...form, nivelAccesoDatos: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                <option value="Bajo">Bajo</option><option value="Medio">Medio</option><option value="Alto">Alto</option>
              </select>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.confidencialidadFirmada} onChange={e => setForm({...form, confidencialidadFirmada: e.target.checked})} />Confidencialidad</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.consentimientoFirmado} onChange={e => setForm({...form, consentimientoFirmado: e.target.checked})} />Consentimiento</label>
              </div>
              <textarea placeholder="Observaciones" value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} className="w-full border rounded px-3 py-2 text-sm h-16" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Guardar</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

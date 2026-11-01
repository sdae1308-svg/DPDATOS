import { useState } from 'react';
import { useEnterprise } from '../store/useEnterprise';
import { exportToExcel, exportToPDF, exportToWord } from '../utils/exportUtils';

interface EIPD {
  id: string;
  tratamiento: string;
  ratId: string;
  fechaEvaluacion: string;
  responsable: string;
  descripcionTratamiento: string;
  necesidadEvaluacion: string;
  datosEspeciales: boolean;
  transferenciasInternacionales: boolean;
  monitoreoSistematico: boolean;
  decisionesAutomatizadas: boolean;
  grandesVolumenes: boolean;
  personasVulnerables: boolean;
  tecnologiasInnovadoras: boolean;
  riesgosIdentificados: string[];
  medidasMitigacion: string[];
  riesgoResidual: string;
  conclusion: string;
  estado: string;
}

export function EIPDModule() {
  const { rats } = useEnterprise();
  const [eipds, setEipds] = useState<EIPD[]>([
    {
      id: 'EIPD-001',
      tratamiento: 'Tratamiento de datos biométricos para control de acceso',
      ratId: 'RAT-005',
      fechaEvaluacion: '2024-03-15',
      responsable: 'María González',
      descripcionTratamiento: 'Uso de huella dactilar para control de asistencia y acceso a instalaciones',
      necesidadEvaluacion: 'Tratamiento de datos biométricos considerados datos sensibles',
      datosEspeciales: true,
      transferenciasInternacionales: false,
      monitoreoSistematico: true,
      decisionesAutomatizadas: false,
      grandesVolumenes: false,
      personasVulnerables: false,
      tecnologiasInnovadoras: true,
      riesgosIdentificados: ['Acceso no autorizado a datos biométricos', 'Fuga de datos sensibles', 'Uso indebido de información biométrica'],
      medidasMitigacion: ['Cifrado de datos biométricos', 'Control de acceso estricto', 'Auditorías trimestrales', 'Política de retención limitada'],
      riesgoResidual: 'Medio',
      conclusion: 'El tratamiento es necesario pero requiere implementación de medidas de seguridad adicionales',
      estado: 'Aprobada'
    },
    {
      id: 'EIPD-002',
      tratamiento: 'Sistema de videovigilancia con reconocimiento facial',
      ratId: 'RAT-008',
      fechaEvaluacion: '2024-05-20',
      responsable: 'Carlos Rodríguez',
      descripcionTratamiento: 'Videovigilancia con capacidad de reconocimiento facial en áreas comunes',
      necesidadEvaluacion: 'Monitoreo sistemático de personas con tecnología innovadora',
      datosEspeciales: true,
      transferenciasInternacionales: false,
      monitoreoSistematico: true,
      decisionesAutomatizadas: true,
      grandesVolumenes: false,
      personasVulnerables: false,
      tecnologiasInnovadoras: true,
      riesgosIdentificados: ['Identificación errónea', 'Uso discriminatorio', 'Violación de privacidad', 'Almacenamiento excesivo'],
      medidasMitigacion: ['Limitación de áreas monitoreadas', 'Señalización clara', 'Retención máxima de 30 días', 'Sin almacenamiento de datos biométricos'],
      riesgoResidual: 'Alto',
      conclusion: 'Se recomienda implementar medidas adicionales o considerar alternativas menos invasivas',
      estado: 'En revisión'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<EIPD>>({});

  const handleSave = () => {
    if (!form.tratamiento || !form.ratId) {
      alert('Complete los campos obligatorios');
      return;
    }

    if (editingId) {
      setEipds(eipds.map(e => e.id === editingId ? { ...e, ...form } as EIPD : e));
    } else {
      const newId = `EIPD-${String(eipds.length + 1).padStart(3, '0')}`;
      setEipds([...eipds, { ...form, id: newId } as EIPD]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm({});
  };

  const handleEdit = (eipd: EIPD) => {
    setForm(eipd);
    setEditingId(eipd.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta evaluación de impacto?')) {
      setEipds(eipds.filter(e => e.id !== id));
    }
  };

  const handleExport = (format: 'excel' | 'pdf' | 'word') => {
    const data = eipds.map(e => ({
      ID: e.id,
      Tratamiento: e.tratamiento,
      RAT: e.ratId,
      Fecha: e.fechaEvaluacion,
      Responsable: e.responsable,
      'Datos Especiales': e.datosEspeciales ? 'Sí' : 'No',
      'Riesgo Residual': e.riesgoResidual,
      Estado: e.estado,
      Conclusión: e.conclusion
    }));

    if (format === 'excel') {
      exportToExcel(data, 'Evaluaciones_Impacto', 'EIPD');
    } else if (format === 'pdf') {
      exportToPDF('Evaluaciones de Impacto', data.map(d => ({ heading: `${d.ID}: ${d.Tratamiento}`, text: `RAT: ${d.RAT}\nResponsable: ${d.Responsable}\nRiesgo Residual: ${d['Riesgo Residual']}\nEstado: ${d.Estado}\nConclusión: ${d.Conclusión}` })), 'EIPD');
    } else {
      exportToWord('Evaluaciones de Impacto', data.map(d => ({ heading: `${d.ID}: ${d.Tratamiento}`, text: `RAT: ${d.RAT}\nResponsable: ${d.Responsable}\nRiesgo Residual: ${d['Riesgo Residual']}\nEstado: ${d.Estado}\nConclusión: ${d.Conclusión}` })), 'EIPD');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Evaluaciones de Impacto (EIPD)</h2>
        <div className="flex gap-2">
          <button onClick={() => handleExport('excel')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <i className="fas fa-file-excel mr-2"></i>Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <i className="fas fa-file-pdf mr-2"></i>PDF
          </button>
          <button onClick={() => handleExport('word')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <i className="fas fa-file-word mr-2"></i>Word
          </button>
          <button onClick={() => { setForm({}); setEditingId(null); setShowForm(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <i className="fas fa-plus mr-2"></i>Nueva EIPD
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tratamiento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RAT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Riesgo</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eipds.map(eipd => (
                <tr key={eipd.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{eipd.id}</td>
                  <td className="px-4 py-3 text-sm">{eipd.tratamiento}</td>
                  <td className="px-4 py-3 text-sm font-mono">{eipd.ratId}</td>
                  <td className="px-4 py-3 text-sm">{eipd.responsable}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      eipd.riesgoResidual === 'Alto' ? 'bg-red-100 text-red-700' :
                      eipd.riesgoResidual === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {eipd.riesgoResidual}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      eipd.estado === 'Aprobada' ? 'bg-green-100 text-green-700' :
                      eipd.estado === 'En revisión' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {eipd.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleEdit(eipd)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => handleDelete(eipd.id)} className="text-red-600 hover:text-red-800">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{editingId ? 'Editar' : 'Nueva'} Evaluación de Impacto</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento *</label>
                  <input
                    type="text"
                    value={form.tratamiento || ''}
                    onChange={e => setForm({ ...form, tratamiento: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Nombre del tratamiento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RAT Asociado *</label>
                  <select
                    value={form.ratId || ''}
                    onChange={e => setForm({ ...form, ratId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Seleccione un RAT</option>
                    {rats.map(r => (
                      <option key={r.id} value={r.id}>{r.id} - {r.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Evaluación</label>
                  <input
                    type="date"
                    value={form.fechaEvaluacion || ''}
                    onChange={e => setForm({ ...form, fechaEvaluacion: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                  <input
                    type="text"
                    value={form.responsable || ''}
                    onChange={e => setForm({ ...form, responsable: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Tratamiento</label>
                  <textarea
                    value={form.descripcionTratamiento || ''}
                    onChange={e => setForm({ ...form, descripcionTratamiento: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Criterios de Evaluación</label>
                  <div className="space-y-2">
                    {[
                      { key: 'datosEspeciales', label: 'Tratamiento de datos especiales/sensibles' },
                      { key: 'transferenciasInternacionales', label: 'Transferencias internacionales' },
                      { key: 'monitoreoSistematico', label: 'Monitoreo sistemático' },
                      { key: 'decisionesAutomatizadas', label: 'Decisiones automatizadas' },
                      { key: 'grandesVolumenes', label: 'Grandes volúmenes de datos' },
                      { key: 'personasVulnerables', label: 'Personas vulnerables' },
                      { key: 'tecnologiasInnovadoras', label: 'Tecnologías innovadoras' }
                    ].map(criterio => (
                      <label key={criterio.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(form as any)[criterio.key] || false}
                          onChange={e => setForm({ ...form, [criterio.key]: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm">{criterio.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Riesgo Residual</label>
                  <select
                    value={form.riesgoResidual || ''}
                    onChange={e => setForm({ ...form, riesgoResidual: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Seleccione</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conclusión</label>
                  <textarea
                    value={form.conclusion || ''}
                    onChange={e => setForm({ ...form, conclusion: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={form.estado || ''}
                    onChange={e => setForm({ ...form, estado: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Seleccione</option>
                    <option value="En elaboración">En elaboración</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Aprobada">Aprobada</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                  Cancelar
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

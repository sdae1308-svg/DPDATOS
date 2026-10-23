import { useState } from 'react';
import { useStore } from '../store/store';
import { exportToExcel, exportToPDF, exportToWord } from '../utils/exportUtils';

export default function EIPDModule() {
  const { eipds, addEIPD, updateEIPD, deleteEIPD } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tratamiento: '',
    descripcion: '',
    responsable: '',
    fechaEvaluacion: new Date().toISOString().split('T')[0],
    datosEspeciales: false,
    transferenciasInternacionales: false,
    monitoreoSistematico: false,
    decisionesAutomatizadas: false,
    granEscala: false,
    riesgos: [] as { descripcion: string; probabilidad: number; impacto: number; medidas: string }[],
    medidasImplementadas: '',
    medidasPropuestas: '',
    riesgoResidual: '',
    conclusion: '',
    estado: 'En evaluación' as const
  });

  const handleSave = () => {
    if (editingId) {
      updateEIPD(editingId, formData);
    } else {
      addEIPD({
        ...formData,
        id: `EIPD-${Date.now()}`,
        riesgos: formData.riesgos.map((r, i) => ({ ...r, id: `R-${i}` }))
      } as any);
    }
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tratamiento: '',
      descripcion: '',
      responsable: '',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      datosEspeciales: false,
      transferenciasInternacionales: false,
      monitoreoSistematico: false,
      decisionesAutomatizadas: false,
      granEscala: false,
      riesgos: [],
      medidasImplementadas: '',
      medidasPropuestas: '',
      riesgoResidual: '',
      conclusion: '',
      estado: 'En evaluación'
    });
    setEditingId(null);
  };

  const handleEdit = (eipd: any) => {
    setFormData({
      nombre: eipd.nombre || '',
      tratamiento: eipd.tratamiento || '',
      descripcion: eipd.descripcion || '',
      responsable: eipd.responsable || '',
      fechaEvaluacion: eipd.fechaEvaluacion || new Date().toISOString().split('T')[0],
      datosEspeciales: eipd.datosEspeciales || false,
      transferenciasInternacionales: eipd.transferenciasInternacionales || false,
      monitoreoSistematico: eipd.monitoreoSistematico || false,
      decisionesAutomatizadas: eipd.decisionesAutomatizadas || false,
      granEscala: eipd.granEscala || false,
      riesgos: eipd.riesgos || [],
      medidasImplementadas: eipd.medidasImplementadas || '',
      medidasPropuestas: eipd.medidasPropuestas || '',
      riesgoResidual: eipd.riesgoResidual || '',
      conclusion: eipd.conclusion || '',
      estado: eipd.estado || 'En evaluación'
    });
    setEditingId(eipd.id);
    setShowForm(true);
  };

  const addRisk = () => {
    setFormData({
      ...formData,
      riesgos: [...formData.riesgos, { descripcion: '', probabilidad: 3, impacto: 3, medidas: '' }]
    });
  };

  const updateRisk = (index: number, field: string, value: any) => {
    const newRiesgos = [...formData.riesgos];
    newRiesgos[index] = { ...newRiesgos[index], [field]: value };
    setFormData({ ...formData, riesgos: newRiesgos });
  };

  const removeRisk = (index: number) => {
    setFormData({
      ...formData,
      riesgos: formData.riesgos.filter((_, i) => i !== index)
    });
  };

  const calculateRiskLevel = (prob: number, imp: number) => {
    const level = prob * imp;
    if (level >= 15) return { text: 'Crítico', color: 'bg-red-600' };
    if (level >= 10) return { text: 'Alto', color: 'bg-red-500' };
    if (level >= 6) return { text: 'Medio', color: 'bg-yellow-500' };
    if (level >= 3) return { text: 'Bajo', color: 'bg-green-500' };
    return { text: 'Muy Bajo', color: 'bg-green-600' };
  };

  const handleExport = (format: 'excel' | 'pdf' | 'word') => {
    const data = eipds.map((e: any) => ({
      ID: e.id,
      Nombre: e.nombre,
      Tratamiento: e.tratamiento,
      Responsable: e.responsable,
      Fecha: e.fechaEvaluacion,
      Estado: e.estado,
      'Datos Especiales': e.datosEspeciales ? 'Sí' : 'No',
      'Transferencias Int.': e.transferenciasInternacionales ? 'Sí' : 'No',
      'Riesgo Residual': e.riesgoResidual,
      Conclusión: e.conclusion
    }));

    if (format === 'excel') {
      exportToExcel(data, 'Evaluaciones_Impacto', 'EIPDs');
    } else if (format === 'pdf') {
      exportToPDF('Evaluaciones de Impacto de Protección de Datos', data.map((d: any) => ({
        heading: d.Nombre,
        text: `Tratamiento: ${d.Tratamiento}\nResponsable: ${d.Responsable}\nFecha: ${d.Fecha}\nEstado: ${d.Estado}\nRiesgo Residual: ${d['Riesgo Residual']}\nConclusión: ${d.Conclusión}`
      })), 'EIPDs');
    } else {
      exportToWord('Evaluaciones de Impacto de Protección de Datos', data.map((d: any) => ({
        heading: d.Nombre,
        text: `Tratamiento: ${d.Tratamiento}\nResponsable: ${d.Responsable}\nFecha: ${d.Fecha}\nEstado: ${d.Estado}\nRiesgo Residual: ${d['Riesgo Residual']}\nConclusión: ${d.Conclusión}`
      })), 'EIPDs');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Evaluaciones de Impacto (EIPD)</h2>
          <p className="text-sm text-gray-600">Art. 24 LOPDP - Evaluaciones requeridas para tratamientos de alto riesgo</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('excel')} className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
            <i className="fas fa-file-excel mr-1"></i>Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
            <i className="fas fa-file-pdf mr-1"></i>PDF
          </button>
          <button onClick={() => handleExport('word')} className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            <i className="fas fa-file-word mr-1"></i>Word
          </button>
          <button onClick={() => setShowForm(true)} className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            <i className="fas fa-plus mr-1"></i>Nueva EIPD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">Total EIPDs</p>
          <p className="text-2xl font-bold text-gray-800">{eipds.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">Aprobadas</p>
          <p className="text-2xl font-bold text-green-600">{eipds.filter((e: any) => e.estado === 'Aprobada').length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">En Evaluación</p>
          <p className="text-2xl font-bold text-yellow-600">{eipds.filter((e: any) => e.estado === 'En evaluación').length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-600">Requieren Revisión</p>
          <p className="text-2xl font-bold text-red-600">{eipds.filter((e: any) => e.estado === 'Requiere revisión').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">ID</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Nombre</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Tratamiento</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Responsable</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Fecha</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Estado</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eipds.map((eipd: any) => (
              <tr key={eipd.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{eipd.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{eipd.nombre}</td>
                <td className="px-4 py-3 text-sm">{eipd.tratamiento}</td>
                <td className="px-4 py-3 text-sm">{eipd.responsable}</td>
                <td className="px-4 py-3 text-sm text-center">{eipd.fechaEvaluacion}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    eipd.estado === 'Aprobada' ? 'bg-green-100 text-green-700' :
                    eipd.estado === 'En evaluación' ? 'bg-yellow-100 text-yellow-700' :
                    eipd.estado === 'Requiere revisión' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {eipd.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleEdit(eipd)} className="text-blue-600 hover:text-blue-800 mr-2">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => deleteEIPD(eipd.id)} className="text-red-600 hover:text-red-800">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{editingId ? 'Editar' : 'Nueva'} EIPD</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento Relacionado *</label>
                  <input
                    type="text"
                    value={formData.tratamiento}
                    onChange={e => setFormData({ ...formData, tratamiento: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
                  <input
                    type="text"
                    value={formData.responsable}
                    onChange={e => setFormData({ ...formData, responsable: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Evaluación *</label>
                  <input
                    type="date"
                    value={formData.fechaEvaluacion}
                    onChange={e => setFormData({ ...formData, fechaEvaluacion: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Criterios de Evaluación</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.datosEspeciales}
                      onChange={e => setFormData({ ...formData, datosEspeciales: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Datos especialmente protegidos</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.transferenciasInternacionales}
                      onChange={e => setFormData({ ...formData, transferenciasInternacionales: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Transferencias internacionales</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.monitoreoSistematico}
                      onChange={e => setFormData({ ...formData, monitoreoSistematico: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Monitoreo sistemático</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.decisionesAutomatizadas}
                      onChange={e => setFormData({ ...formData, decisionesAutomatizadas: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Decisiones automatizadas</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.granEscala}
                      onChange={e => setFormData({ ...formData, granEscala: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Tratamiento a gran escala</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Riesgos Identificados</label>
                  <button onClick={addRisk} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    <i className="fas fa-plus mr-1"></i>Agregar Riesgo
                  </button>
                </div>
                {formData.riesgos.map((riesgo, index) => (
                  <div key={index} className="border rounded-lg p-3 mb-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Descripción del riesgo"
                        value={riesgo.descripcion}
                        onChange={e => updateRisk(index, 'descripcion', e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <div>
                        <label className="text-xs text-gray-600">Probabilidad</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={riesgo.probabilidad}
                          onChange={e => updateRisk(index, 'probabilidad', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Impacto</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={riesgo.impacto}
                          onChange={e => updateRisk(index, 'impacto', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <button onClick={() => removeRisk(index)} className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-600">Nivel:</span>
                      <span className={`px-2 py-0.5 rounded text-xs text-white ${calculateRiskLevel(riesgo.probabilidad, riesgo.impacto).color}`}>
                        {calculateRiskLevel(riesgo.probabilidad, riesgo.impacto).text}
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Medidas de mitigación"
                      value={riesgo.medidas}
                      onChange={e => updateRisk(index, 'medidas', e.target.value)}
                      className="w-full mt-2 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medidas Implementadas</label>
                <textarea
                  value={formData.medidasImplementadas}
                  onChange={e => setFormData({ ...formData, medidasImplementadas: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medidas Propuestas</label>
                <textarea
                  value={formData.medidasPropuestas}
                  onChange={e => setFormData({ ...formData, medidasPropuestas: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Riesgo Residual</label>
                  <select
                    value={formData.riesgoResidual}
                    onChange={e => setFormData({ ...formData, riesgoResidual: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Muy Bajo">Muy Bajo</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                    <option value="Crítico">Crítico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={e => setFormData({ ...formData, estado: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="En evaluación">En evaluación</option>
                    <option value="Aprobada">Aprobada</option>
                    <option value="Requiere revisión">Requiere revisión</option>
                    <option value="No requerida">No requerida</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Conclusión</label>
                <textarea
                  value={formData.conclusion}
                  onChange={e => setFormData({ ...formData, conclusion: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                  Cancelar
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useStore } from '../store/store';

export default function CompanyModule() {
  const { company, setCompany, employees, rats, maturity } = useStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(company);

  const totalCompliance = Math.round(maturity.reduce((a, b) => a + b.nivel, 0) / (maturity.length * 5) * 100);

  const handleSave = () => {
    setCompany(form);
    setEditing(false);
  };

  const consentRate = Math.round((employees.filter(e => e.consentimientoFirmado && e.confidencialidadFirmada).length / employees.length) * 100);

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold">{company.nombreComercial}</h3>
            <p className="text-blue-200">{company.razonSocial}</p>
            <p className="text-blue-300 text-sm mt-1">RUC: {company.ruc} | {company.ciudad}, {company.provincia}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{totalCompliance}%</div>
            <p className="text-blue-200 text-xs">Cumplimiento</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{rats.length}</p>
            <p className="text-xs text-blue-200">Tratamientos</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{employees.length}</p>
            <p className="text-xs text-blue-200">Empleados</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{consentRate}%</p>
            <p className="text-xs text-blue-200">Consentimientos</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{maturity.filter(m => m.nivel >= 3).length}/{maturity.length}</p>
            <p className="text-xs text-blue-200">Dimensiones ≥3</p>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h4 className="font-semibold text-gray-700"><i className="fas fa-building mr-2 text-blue-600"></i>Ficha Empresarial</h4>
          <div className="flex gap-2">
            {!editing ? (
              <button onClick={() => { setForm(company); setEditing(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                <i className="fas fa-edit mr-1"></i>Editar
              </button>
            ) : (
              <>
                <button onClick={handleSave} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  <i className="fas fa-save mr-1"></i>Guardar
                </button>
                <button onClick={() => setEditing(false)} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Cancelar</button>
              </>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Razón Social', key: 'razonSocial', type: 'text' },
              { label: 'Nombre Comercial', key: 'nombreComercial', type: 'text' },
              { label: 'RUC', key: 'ruc', type: 'text' },
              { label: 'Domicilio Legal', key: 'domicilioLegal', type: 'text' },
              { label: 'Ciudad', key: 'ciudad', type: 'text' },
              { label: 'Provincia', key: 'provincia', type: 'text' },
              { label: 'Sector Económico', key: 'sectorEconomico', type: 'text' },
              { label: 'Tamaño de Empresa', key: 'tamanoEmpresa', type: 'text' },
              { label: 'Actividad Principal', key: 'actividadPrincipal', type: 'text' },
              { label: 'Representante Legal', key: 'representanteLegal', type: 'text' },
              { label: 'Responsable Cumplimiento', key: 'responsableCumplimiento', type: 'text' },
              { label: 'Delegado Protección Datos', key: 'delegadoProteccionDatos', type: 'text' },
              { label: 'Teléfono', key: 'telefono', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Sitio Web', key: 'sitioWeb', type: 'text' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs text-gray-500 font-medium">{field.label}</label>
                {editing ? (
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-800 font-medium">{(company as any)[field.key]}</p>
                )}
              </div>
            ))}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-xs text-gray-500 font-medium">Política de Conservación Documental</label>
              {editing ? (
                <textarea
                  value={form.politicaConservacion}
                  onChange={e => setForm({ ...form, politicaConservacion: e.target.value })}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm h-20 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-800">{company.politicaConservacion}</p>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Última actualización: {company.fechaActualizacion}</p>
        </div>
      </div>
    </div>
  );
}

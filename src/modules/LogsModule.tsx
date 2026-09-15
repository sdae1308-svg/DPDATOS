import { useStore } from '../store/store';

export default function LogsModule() {
  const { logs, resetToDemo } = useStore();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-gray-700">Bitácora de Auditoría</h4>
          <p className="text-xs text-gray-500">Registro de todas las acciones realizadas en el sistema</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetToDemo} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded text-sm hover:bg-amber-200">
            <i className="fas fa-rotate-left mr-1"></i>Restaurar Demo
          </button>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <i className="fas fa-clock-rotate-left text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-500">No hay registros en la bitácora aún.</p>
          <p className="text-xs text-gray-400 mt-1">Las acciones que realices en el sistema se registrarán aquí.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha/Hora</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Usuario</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Acción</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Módulo</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {[...logs].reverse().map(log => (
                  <tr key={log.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{new Date(log.timestamp).toLocaleString('es-EC')}</td>
                    <td className="px-4 py-3 text-xs">{log.user}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${log.action === 'Crear' ? 'bg-green-100 text-green-700' : log.action === 'Editar' ? 'bg-blue-100 text-blue-700' : log.action === 'Eliminar' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{log.action}</span></td>
                    <td className="px-4 py-3 text-xs">{log.module}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 text-sm mb-2"><i className="fas fa-info-circle mr-2"></i>Información del Sistema</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-700">
          <p>• Sistema de Cumplimiento LOPDP Ecuador</p>
          <p>• Basado en: LOPDP (26 mayo 2021), RGLOPDP (Decreto 904, 13 nov 2023)</p>
          <p>• Guías SPDP: Gestión de Riesgos v2 (2026), PbD v1</p>
          <p>• Seguridad: ISO 27001:2022 / ISO 27002:2022</p>
          <p>• Persistencia: LocalStorage (preparado para API)</p>
          <p>• Todos los documentos son borradores editables sujetos a validación jurídica</p>
        </div>
      </div>
    </div>
  );
}

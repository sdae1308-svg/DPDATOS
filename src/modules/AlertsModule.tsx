import { useState, useEffect } from 'react';
import { useEnterprise } from '../store/useEnterprise';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  date: string;
  dueDate?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  module: string;
}

export function AlertsModule() {
  const { employees, assets, rats, incidents, risks, documents } = useEnterprise();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');

  useEffect(() => {
    generateAlerts();
  }, [employees, assets, rats, incidents, risks, documents]);

  const generateAlerts = () => {
    const newAlerts: Alert[] = [];
    const today = new Date();

    // Empleados sin consentimiento
    employees.forEach(emp => {
      if (!emp.consentimientoFirmado) {
        newAlerts.push({
          id: `ALERT-EMP-${emp.id}`,
          type: 'critical',
          category: 'Consentimiento',
          title: `Empleado sin consentimiento: ${emp.nombre}`,
          description: `El empleado ${emp.nombre} (${emp.cargo}) no ha firmado el consentimiento para el tratamiento de datos personales`,
          date: today.toISOString(),
          status: 'pending',
          module: 'Empleados'
        });
      }
    });

    // Activos críticos sin amenazas identificadas
    assets.forEach(asset => {
      if (asset.criticidad === 'Alta' && asset.amenazas.length === 0) {
        newAlerts.push({
          id: `ALERT-ASSET-${asset.id}`,
          type: 'critical',
          category: 'Riesgos',
          title: `Activo crítico sin evaluación: ${asset.nombre}`,
          description: `El activo crítico ${asset.nombre} no tiene amenazas identificadas`,
          date: today.toISOString(),
          status: 'pending',
          module: 'Activos'
        });
      }
    });

    // Incidentes abiertos
    incidents.forEach(inc => {
      if (inc.estado === 'Abierto') {
        newAlerts.push({
          id: `ALERT-INC-${inc.id}`,
          type: 'critical',
          category: 'Incidentes',
          title: `Incidente abierto: ${inc.codigo}`,
          description: `Incidente de ${inc.tipo} con estado abierto desde ${inc.fechaDeteccion}`,
          date: today.toISOString(),
          status: 'pending',
          module: 'Incidentes'
        });
      }
    });

    // Riesgos altos sin tratamiento
    risks.forEach(risk => {
      if (risk.riesgoInherente >= 15 && !risk.tratamientoRiesgo) {
        newAlerts.push({
          id: `ALERT-RISK-${risk.id}`,
          type: 'critical',
          category: 'Riesgos',
          title: `Riesgo alto sin tratamiento: ${risk.nombre}`,
          description: `El riesgo ${risk.nombre} tiene nivel alto (${risk.riesgoInherente}) y no tiene plan de tratamiento definido`,
          date: today.toISOString(),
          status: 'pending',
          module: 'Riesgos'
        });
      }
    });

    // Documentos próximos a vencer
    documents.forEach(doc => {
      if (doc.fechaRevision) {
        const revisionDate = new Date(doc.fechaRevision);
        const daysUntilRevision = Math.ceil((revisionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilRevision <= 30 && daysUntilRevision > 0) {
          newAlerts.push({
            id: `ALERT-DOC-${doc.id}`,
            type: 'warning',
            category: 'Documentos',
            title: `Documento próximo a revisión: ${doc.nombre}`,
            description: `El documento debe ser revisado en ${daysUntilRevision} días (${doc.fechaRevision})`,
            date: today.toISOString(),
            dueDate: doc.fechaRevision,
            status: 'pending',
            module: 'Documentos'
          });
        } else if (daysUntilRevision <= 0) {
          newAlerts.push({
            id: `ALERT-DOC-${doc.id}`,
            type: 'critical',
            category: 'Documentos',
            title: `Documento vencido: ${doc.nombre}`,
            description: `El documento venció el ${doc.fechaRevision} y requiere revisión inmediata`,
            date: today.toISOString(),
            dueDate: doc.fechaRevision,
            status: 'pending',
            module: 'Documentos'
          });
        }
      }
    });

    // RAT sin revisión anual
    rats.forEach(rat => {
      if (rat.fechaRevision) {
        const revisionDate = new Date(rat.fechaRevision);
        const daysUntilRevision = Math.ceil((revisionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilRevision <= 60 && daysUntilRevision > 0) {
          newAlerts.push({
            id: `ALERT-RAT-${rat.id}`,
            type: 'warning',
            category: 'RAT',
            title: `RAT próximo a revisión: ${rat.nombre}`,
            description: `El registro de tratamiento debe ser revisado en ${daysUntilRevision} días`,
            date: today.toISOString(),
            dueDate: rat.fechaRevision,
            status: 'pending',
            module: 'RAT'
          });
        }
      }
    });

    setAlerts(newAlerts);
  };

  const handleResolve = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
  };

  const handleDismiss = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'dismissed' } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    const typeMatch = filter === 'all' || a.type === filter;
    const statusMatch = statusFilter === 'all' || a.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const criticalCount = alerts.filter(a => a.type === 'critical' && a.status === 'pending').length;
  const warningCount = alerts.filter(a => a.type === 'warning' && a.status === 'pending').length;
  const infoCount = alerts.filter(a => a.type === 'info' && a.status === 'pending').length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Alertas y Notificaciones</h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg">
            <i className="fas fa-exclamation-circle text-red-600"></i>
            <span className="text-sm font-medium text-red-700">{criticalCount} Críticas</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 rounded-lg">
            <i className="fas fa-exclamation-triangle text-yellow-600"></i>
            <span className="text-sm font-medium text-yellow-700">{warningCount} Advertencias</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg">
            <i className="fas fa-info-circle text-blue-600"></i>
            <span className="text-sm font-medium text-blue-700">{infoCount} Info</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as any)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">Todos</option>
              <option value="critical">Críticas</option>
              <option value="warning">Advertencias</option>
              <option value="info">Información</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="resolved">Resueltas</option>
              <option value="dismissed">Descartadas</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-check-circle text-4xl mb-3"></i>
              <p>No hay alertas pendientes</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-r-lg ${
                  alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                } ${alert.status === 'resolved' ? 'opacity-60' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        alert.type === 'critical' ? 'bg-red-200 text-red-800' :
                        alert.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {alert.category}
                      </span>
                      <span className="text-xs text-gray-500">{alert.module}</span>
                      {alert.status === 'resolved' && (
                        <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs">Resuelta</span>
                      )}
                      {alert.status === 'dismissed' && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs">Descartada</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    {alert.dueDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        <i className="fas fa-calendar mr-1"></i>
                        Vence: {new Date(alert.dueDate).toLocaleDateString('es-EC')}
                      </p>
                    )}
                  </div>
                  {alert.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Resolver
                      </button>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                      >
                        Descartar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

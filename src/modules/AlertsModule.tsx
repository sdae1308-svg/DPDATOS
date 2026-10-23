import { useState, useEffect } from 'react';
import { useEnterprise } from '../store/useEnterprise';

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  module: string;
  date: string;
  read: boolean;
}

export default function AlertsModule() {
  const { employees, incidents, risks, audits, actionPlans, arcoRequests } = useEnterprise();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    generateAlerts();
  }, [employees, incidents, risks, audits, actionPlans, arcoRequests]);

  const generateAlerts = () => {
    const newAlerts: Alert[] = [];
    const today = new Date();

    // Alertas de empleados con consentimiento pendiente
    const employeesWithoutConsent = employees.filter((e: any) => !e.consentimientoFirmado || !e.confidencialidadFirmada);
    if (employeesWithoutConsent.length > 0) {
      newAlerts.push({
        id: 'alert-consent-' + Date.now(),
        type: 'warning',
        title: 'Consentimientos Pendientes',
        message: `${employeesWithoutConsent.length} empleado(s) no han firmado el consentimiento o acuerdo de confidencialidad`,
        module: 'Empleados',
        date: today.toISOString(),
        read: false
      });
    }

    // Alertas de incidentes abiertos
    const openIncidents = incidents.filter((i: any) => i.estado === 'Abierto');
    if (openIncidents.length > 0) {
      newAlerts.push({
        id: 'alert-incidents-' + Date.now(),
        type: 'danger',
        title: 'Incidentes Abiertos',
        message: `${openIncidents.length} incidente(s) de seguridad abierto(s) requieren atención`,
        module: 'Incidentes',
        date: today.toISOString(),
        read: false
      });
    }

    // Alertas de riesgos no aceptables
    const unacceptableRisks = risks.filter((r: any) => r.nivelAceptacion === 'No aceptable');
    if (unacceptableRisks.length > 0) {
      newAlerts.push({
        id: 'alert-risks-' + Date.now(),
        type: 'danger',
        title: 'Riesgos No Aceptables',
        message: `${unacceptableRisks.length} riesgo(s) clasificado(s) como no aceptable(s)`,
        module: 'Riesgos',
        date: today.toISOString(),
        read: false
      });
    }

    // Alertas de planes de acción vencidos o próximos a vencer
    const todayStr = today.toISOString().split('T')[0];
    actionPlans.forEach((plan: any) => {
      if (plan.estado !== 'Completada' && plan.fechaCompromiso) {
        const commitDate = new Date(plan.fechaCompromiso);
        const daysDiff = Math.ceil((commitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 0) {
          newAlerts.push({
            id: `alert-plan-overdue-${plan.id}`,
            type: 'danger',
            title: 'Plan de Acción Vencido',
            message: `"${plan.titulo}" venció hace ${Math.abs(daysDiff)} día(s)`,
            module: 'Plan de Acción',
            date: today.toISOString(),
            read: false
          });
        } else if (daysDiff <= 7) {
          newAlerts.push({
            id: `alert-plan-due-${plan.id}`,
            type: 'warning',
            title: 'Plan de Acción Próximo a Vencer',
            message: `"${plan.titulo}" vence en ${daysDiff} día(s)`,
            module: 'Plan de Acción',
            date: today.toISOString(),
            read: false
          });
        }
      }
    });

    // Alertas de solicitudes ARCO próximas a vencer
    arcoRequests.forEach((request: any) => {
      if (request.estado !== 'Atendida' && request.fechaLimite) {
        const limitDate = new Date(request.fechaLimite);
        const daysDiff = Math.ceil((limitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 0) {
          newAlerts.push({
            id: `alert-arco-overdue-${request.id}`,
            type: 'danger',
            title: 'Solicitud ARCO Vencida',
            message: `La solicitud ${request.codigo} venció hace ${Math.abs(daysDiff)} día(s)`,
            module: 'Derechos ARCO',
            date: today.toISOString(),
            read: false
          });
        } else if (daysDiff <= 5) {
          newAlerts.push({
            id: `alert-arco-due-${request.id}`,
            type: 'warning',
            title: 'Solicitud ARCO Próxima a Vencer',
            message: `La solicitud ${request.codigo} vence en ${daysDiff} día(s)`,
            module: 'Derechos ARCO',
            date: today.toISOString(),
            read: false
          });
        }
      }
    });

    // Alertas de hallazgos de auditoría abiertos
    const openFindings = audits.flatMap((a: any) => a.hallazgos?.filter((h: any) => h.estado === 'Abierto') || []);
    if (openFindings.length > 0) {
      newAlerts.push({
        id: 'alert-findings-' + Date.now(),
        type: 'warning',
        title: 'Hallazgos de Auditoría Abiertos',
        message: `${openFindings.length} hallazgo(s) de auditoría abierto(s)`,
        module: 'Auditoría',
        date: today.toISOString(),
        read: false
      });
    }

    setAlerts(newAlerts);
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unread') return !a.read;
    if (filter === 'read') return a.read;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger': return 'fa-exclamation-triangle text-red-600';
      case 'warning': return 'fa-exclamation-circle text-yellow-600';
      case 'info': return 'fa-info-circle text-blue-600';
      case 'success': return 'fa-check-circle text-green-600';
      default: return 'fa-bell text-gray-600';
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Centro de Alertas</h2>
            <p className="text-sm text-gray-600">Notificaciones y recordatorios del sistema</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {unreadCount} sin leer
            </span>
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <i className="fas fa-check-double mr-1"></i>Marcar todas como leídas
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Todas ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded text-sm ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Sin leer ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded text-sm ${filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Leídas ({alerts.length - unreadCount})
          </button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <i className="fas fa-bell-slash text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-500">No hay alertas {filter === 'unread' ? 'sin leer' : filter === 'read' ? 'leídas' : ''}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg border-l-4 p-4 ${getAlertBg(alert.type)} ${!alert.read ? 'shadow-sm' : 'opacity-75'}`}
            >
              <div className="flex items-start gap-3">
                <i className={`fas ${getAlertIcon(alert.type)} text-xl mt-1`}></i>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {alert.module}
                      </span>
                    </div>
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <i className="fas fa-check mr-1"></i>Marcar como leída
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(alert.date).toLocaleString('es-EC')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

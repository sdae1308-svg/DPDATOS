import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/store';
import { useEnterprise } from '../store/useEnterprise';
import { createBackup, downloadBackup, getLastBackupFromLocalStorage, loadBackupFromFile, getBackupsFromIndexedDB, deleteBackupFromIndexedDB, clearAllBackups, type BackupData } from '../utils/backupUtils';

interface LayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onNavigate: (module: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
  { id: 'company', label: 'Empresa', icon: 'fa-building' },
  { id: 'employees', label: 'Empleados', icon: 'fa-users' },
  { id: 'assets', label: 'Activos', icon: 'fa-server' },
  { id: 'rat', label: 'RAT', icon: 'fa-clipboard-list' },
  { id: 'incidents', label: 'Incidentes/Riesgos', icon: 'fa-shield-halved' },
  { id: 'audit', label: 'Auditoría', icon: 'fa-magnifying-glass-chart' },
  { id: 'maturity', label: 'Madurez', icon: 'fa-chart-simple' },
  { id: 'documents', label: 'Documentos', icon: 'fa-file-lines' },
  { id: 'admin', label: 'Administración', icon: 'fa-cog' },
  { id: 'logs', label: 'Bitácora', icon: 'fa-clock-rotate-left' },
];

export default function Layout({ children, currentModule, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupMessage, setBackupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [backupHistory, setBackupHistory] = useState<BackupData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser, logout, enterprises, activeEnterpriseId, switchEnterprise, restoreFromBackup } = useStore();
  const { company } = useEnterprise();

  // Cargar histórico de respaldos cuando se abre el modal
  useEffect(() => {
    if (showBackupModal) {
      getBackupsFromIndexedDB().then(setBackupHistory);
    }
  }, [showBackupModal]);

  // Crear respaldo manual
  const handleCreateBackup = () => {
    const state = useStore.getState();
    const backup = createBackup(state);
    downloadBackup(backup);
    setBackupMessage({ type: 'success', text: 'Respaldo descargado exitosamente' });
    setTimeout(() => setBackupMessage(null), 3000);
  };

  // Recuperar desde archivo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const backup = await loadBackupFromFile(file);
      if (confirm(`¿Restaurar desde archivo?\nFecha: ${new Date(backup.timestamp).toLocaleString('es-EC')}\n\nEsto reemplazará TODOS los datos actuales.`)) {
        restoreFromBackup(backup.data);
        setBackupMessage({ type: 'success', text: 'Respaldo restaurado. Recargando...' });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err: any) {
      setBackupMessage({ type: 'error', text: err.message || 'Error al cargar el archivo' });
      setTimeout(() => setBackupMessage(null), 4000);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Recuperar desde localStorage
  const handleRestoreFromLocalStorage = () => {
    const lastBackup = getLastBackupFromLocalStorage();
    if (!lastBackup) {
      setBackupMessage({ type: 'error', text: 'No hay respaldo previo en el navegador' });
      setTimeout(() => setBackupMessage(null), 3000);
      return;
    }
    if (confirm(`¿Restaurar desde respaldo local?\nFecha: ${new Date(lastBackup.timestamp).toLocaleString('es-EC')}\n\nEsto reemplazará TODOS los datos actuales.`)) {
      restoreFromBackup(lastBackup.data);
      setBackupMessage({ type: 'success', text: 'Respaldo restaurado. Recargando...' });
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  // Restaurar desde el histórico
  const handleRestoreFromHistory = async (backup: BackupData) => {
    if (confirm(`¿Restaurar este respaldo?\nFecha: ${new Date(backup.timestamp).toLocaleString('es-EC')}\nOrigen: ${backup.source === 'auto-close' ? 'Cierre de app' : backup.source === 'auto-interval' ? 'Automático (5 min)' : 'Manual'}\n\nEsto reemplazará TODOS los datos actuales.`)) {
      restoreFromBackup(backup.data);
      setBackupMessage({ type: 'success', text: 'Respaldo restaurado. Recargando...' });
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  // Descargar desde el histórico
  const handleDownloadFromHistory = (backup: BackupData) => {
    downloadBackup(backup);
  };

  // Eliminar del histórico
  const handleDeleteFromHistory = async (id: number) => {
    if (confirm('¿Eliminar este respaldo del histórico?')) {
      await deleteBackupFromIndexedDB(id);
      setBackupHistory(prev => prev.filter(b => (b as any).id !== id));
    }
  };

  // Limpiar todo el histórico
  const handleClearHistory = async () => {
    if (confirm('¿Eliminar TODOS los respaldos del histórico? Esta acción no se puede deshacer.')) {
      await clearAllBackups();
      setBackupHistory([]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-60' : 'w-14'} bg-slate-900 text-white transition-all duration-300 flex flex-col flex-shrink-0`}>
        <div className="p-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">EC</div>
            {sidebarOpen && <div><h1 className="font-bold text-sm">ComplianceEC</h1><p className="text-[10px] text-slate-400">LOPDP Ecuador</p></div>}
          </div>
        </div>
        {sidebarOpen && enterprises.length > 1 && (
          <div className="p-2 border-b border-slate-700">
            <select value={activeEnterpriseId || ''} onChange={e => switchEnterprise(e.target.value)} className="w-full bg-slate-800 text-white text-xs rounded px-2 py-1.5 border border-slate-600">
              {enterprises.map(e => <option key={e.id} value={e.id}>{e.company.nombreComercial}</option>)}
            </select>
          </div>
        )}
        <nav className="flex-1 overflow-y-auto py-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${currentModule === item.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
              <i className={`fas ${item.icon} w-5 text-center text-sm flex-shrink-0`}></i>
              {sidebarOpen && <span className="text-xs">{item.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="p-2 border-t border-slate-700 text-xs text-slate-400">
            <p className="truncate font-medium">{company?.nombreComercial}</p>
            <p className="truncate">{currentUser?.nombre}</p>
            <p className="truncate text-slate-500">{currentUser?.role}</p>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700"><i className="fas fa-bars"></i></button>
            <h2 className="text-base font-semibold text-gray-800">{menuItems.find(m => m.id === currentModule)?.label}</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Mensaje de feedback */}
            {backupMessage && (
              <div className={`px-3 py-1.5 rounded text-xs ${backupMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <i className={`fas ${backupMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-1`}></i>
                {backupMessage.text}
              </div>
            )}
            
            {/* Botón de Respaldos */}
            <button onClick={() => setShowBackupModal(true)} className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded flex items-center gap-1" title="Respaldos y Recuperación">
              <i className="fas fa-database"></i><span className="hidden md:inline">Respaldos</span>
            </button>
            
            {/* Input oculto para cargar archivo */}
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            
            <button onClick={logout} className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1">
              <i className="fas fa-sign-out-alt"></i><span className="hidden md:inline">Salir</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center"><i className="fas fa-user text-blue-600 text-xs"></i></div>
              <span className="text-xs text-gray-600 hidden md:block">{currentUser?.nombre}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>

      {/* Modal de Respaldos */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800"><i className="fas fa-database mr-2 text-blue-600"></i>Gestión de Respaldos</h3>
                <p className="text-xs text-gray-500 mt-1">El sistema crea respaldos automáticos al cerrar la aplicación y cada 5 minutos</p>
              </div>
              <button onClick={() => setShowBackupModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
            </div>

            <div className="space-y-3">
              {/* Crear respaldo */}
              <div className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-download text-green-600"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Crear Respaldo Manual</h4>
                    <p className="text-xs text-gray-500">Descarga un archivo JSON con todos los datos del sistema</p>
                    <button onClick={handleCreateBackup} className="mt-2 px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                      <i className="fas fa-file-export mr-1"></i>Descargar Respaldo
                    </button>
                  </div>
                </div>
              </div>

              {/* Recuperar desde archivo */}
              <div className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-upload text-blue-600"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Recuperar desde Archivo</h4>
                    <p className="text-xs text-gray-500">Restaura los datos desde un archivo JSON de respaldo previo</p>
                    <button onClick={() => fileInputRef.current?.click()} className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                      <i className="fas fa-file-import mr-1"></i>Seleccionar Archivo
                    </button>
                  </div>
                </div>
              </div>

              {/* Recuperar desde localStorage */}
              <div className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-rotate-left text-purple-600"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Recuperar Último Respaldo Local</h4>
                    <p className="text-xs text-gray-500">Restaura desde el último respaldo guardado en este navegador</p>
                    {getLastBackupFromLocalStorage() ? (
                      <>
                        <p className="text-xs text-gray-400 mt-1">
                          <i className="fas fa-clock mr-1"></i>
                          Último: {new Date(getLastBackupFromLocalStorage()!.timestamp).toLocaleString('es-EC')}
                        </p>
                        <button onClick={handleRestoreFromLocalStorage} className="mt-2 px-3 py-1.5 bg-purple-600 text-white rounded text-xs hover:bg-purple-700">
                          <i className="fas fa-undo mr-1"></i>Recuperar
                        </button>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1 italic">No hay respaldos locales disponibles</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico de Respaldos */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-sm text-gray-700"><i className="fas fa-history mr-1"></i>Histórico de Respaldos ({backupHistory.length})</h4>
                {backupHistory.length > 0 && (
                  <button onClick={handleClearHistory} className="text-xs text-red-600 hover:text-red-800">
                    <i className="fas fa-trash mr-1"></i>Limpiar todo
                  </button>
                )}
              </div>
              {backupHistory.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-3">No hay respaldos en el histórico</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
                  {backupHistory.map((backup, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1.5 hover:bg-gray-100">
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{new Date(backup.timestamp).toLocaleString('es-EC')}</p>
                        <p className="text-gray-400 truncate">
                          {backup.source === 'auto-close' ? '🔒 Cierre' : backup.source === 'auto-interval' ? '⏱ Auto (5min)' : '👤 Manual'}
                          {' • '}
                          {backup.data?.enterprises?.length || 0} empresas
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => handleRestoreFromHistory(backup)} className="text-blue-600 hover:text-blue-800 p-1" title="Restaurar">
                          <i className="fas fa-undo text-xs"></i>
                        </button>
                        <button onClick={() => handleDownloadFromHistory(backup)} className="text-green-600 hover:text-green-800 p-1" title="Descargar">
                          <i className="fas fa-download text-xs"></i>
                        </button>
                        <button onClick={() => handleDeleteFromHistory((backup as any).id)} className="text-red-600 hover:text-red-800 p-1" title="Eliminar">
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                <strong>Advertencia:</strong> Al restaurar un respaldo, TODOS los datos actuales serán reemplazados. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

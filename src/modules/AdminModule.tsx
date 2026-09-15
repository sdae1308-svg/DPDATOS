import { useStore } from '../store/store';
import type { User } from '../store/store';
import { useState, useRef } from 'react';
import { createBackup, downloadBackup, getLastBackupFromLocalStorage, loadBackupFromFile } from '../utils/backupUtils';

export default function AdminModule() {
  const { users, enterprises, activeEnterpriseId, addUser, updateUser, deleteUser, createEnterprise, deleteEnterprise, switchEnterprise, restoreFromBackup } = useStore();
  const [tab, setTab] = useState<'users' | 'enterprises' | 'backup'>('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showEntForm, setShowEntForm] = useState(false);
  const [userForm, setUserForm] = useState({ username: '', password: '', nombre: '', email: '', role: 'readonly' as User['role'], empresaId: activeEnterpriseId || '', activo: true });
  const [entForm, setEntForm] = useState({ nombreComercial: '', razonSocial: '', ruc: '', ciudad: 'Quito', provincia: 'Pichincha' });
  const [backupMessage, setBackupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmRestore, setConfirmRestore] = useState<null | { source: string; data?: any }>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lastBackup = getLastBackupFromLocalStorage();

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
      setConfirmRestore({ source: `Archivo: ${file.name} (${new Date(backup.timestamp).toLocaleString('es-EC')})`, data: backup.data });
    } catch (err: any) {
      setBackupMessage({ type: 'error', text: err.message || 'Error al cargar el archivo' });
      setTimeout(() => setBackupMessage(null), 4000);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Recuperar desde localStorage
  const handleRestoreFromLocalStorage = () => {
    if (!lastBackup) {
      setBackupMessage({ type: 'error', text: 'No hay respaldo previo en el navegador' });
      setTimeout(() => setBackupMessage(null), 3000);
      return;
    }
    setConfirmRestore({ source: `Respaldo local (${new Date(lastBackup.timestamp).toLocaleString('es-EC')})`, data: lastBackup.data });
  };

  // Confirmar restauración
  const confirmRestoreAction = () => {
    if (confirmRestore?.data) {
      restoreFromBackup(confirmRestore.data);
      setBackupMessage({ type: 'success', text: 'Respaldo restaurado exitosamente. Recargando...' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    setConfirmRestore(null);
  };

  return (
    <div className="space-y-4">
      {/* Mensajes */}
      {backupMessage && (
        <div className={`rounded-lg p-3 text-sm ${backupMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          <i className={`fas ${backupMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
          {backupMessage.text}
        </div>
      )}

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded text-sm ${tab === 'users' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Usuarios</button>
        <button onClick={() => setTab('enterprises')} className={`px-4 py-2 rounded text-sm ${tab === 'enterprises' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Empresas</button>
        <button onClick={() => setTab('backup')} className={`px-4 py-2 rounded text-sm ${tab === 'backup' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>
          <i className="fas fa-database mr-1"></i>Respaldos
        </button>
      </div>

      {/* TAB: USUARIOS */}
      {tab === 'users' && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Gestión de Usuarios ({users.length})</h3>
            <button onClick={() => setShowUserForm(true)} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"><i className="fas fa-plus mr-1"></i>Nuevo</button>
          </div>
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2">Usuario</th><th className="text-left px-4 py-2">Nombre</th><th className="text-left px-4 py-2">Rol</th><th className="text-left px-4 py-2">Empresa</th><th className="text-center px-4 py-2">Estado</th><th className="text-center px-4 py-2">Acciones</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-xs">{u.username}</td>
                    <td className="px-4 py-2">{u.nombre}</td>
                    <td className="px-4 py-2"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{u.role}</span></td>
                    <td className="px-4 py-2 text-xs">{enterprises.find(e => e.id === u.empresaId)?.company.nombreComercial || '-'}</td>
                    <td className="px-4 py-2 text-center">{u.activo ? <span className="text-green-600 text-xs">Activo</span> : <span className="text-red-600 text-xs">Inactivo</span>}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => updateUser(u.id, { activo: !u.activo })} className="text-amber-600 mr-2" title="Toggle"><i className="fas fa-toggle-on"></i></button>
                      <button onClick={() => deleteUser(u.id)} className="text-red-600" title="Eliminar"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showUserForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="font-bold mb-4">Nuevo Usuario</h3>
                <div className="space-y-3">
                  <input placeholder="Username *" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                  <input placeholder="Contraseña *" type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                  <input placeholder="Nombre completo *" value={userForm.nombre} onChange={e => setUserForm({...userForm, nombre: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                  <input placeholder="Email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                  <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as User['role']})} className="w-full border rounded px-3 py-2 text-sm">
                    <option value="admin">Administrador</option><option value="compliance">Cumplimiento</option><option value="dpo">DPO</option><option value="rrhh">RRHH</option><option value="security">Seguridad</option><option value="auditor">Auditor</option><option value="readonly">Solo lectura</option>
                  </select>
                  <select value={userForm.empresaId} onChange={e => setUserForm({...userForm, empresaId: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                    {enterprises.map(e => <option key={e.id} value={e.id}>{e.company.nombreComercial}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { addUser(userForm); setShowUserForm(false); setUserForm({ username: '', password: '', nombre: '', email: '', role: 'readonly', empresaId: activeEnterpriseId || '', activo: true }); }} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Guardar</button>
                  <button onClick={() => setShowUserForm(false)} className="px-4 py-2 bg-gray-200 rounded text-sm">Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB: EMPRESAS */}
      {tab === 'enterprises' && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Empresas ({enterprises.length})</h3>
            <button onClick={() => setShowEntForm(true)} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"><i className="fas fa-plus mr-1"></i>Nueva Empresa</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enterprises.map(ent => (
              <div key={ent.id} className={`bg-white rounded-lg border p-4 ${ent.id === activeEnterpriseId ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{ent.company.nombreComercial}</h4>
                    <p className="text-xs text-gray-500">{ent.company.razonSocial}</p>
                    <p className="text-xs text-gray-400">RUC: {ent.company.ruc}</p>
                  </div>
                  {ent.id !== activeEnterpriseId && <button onClick={() => deleteEnterprise(ent.id)} className="text-red-600 text-sm"><i className="fas fa-trash"></i></button>}
                </div>
                <div className="flex gap-2 mt-3 text-xs">
                  <span className="px-2 py-0.5 bg-blue-50 rounded">{ent.employees.length} empleados</span>
                  <span className="px-2 py-0.5 bg-green-50 rounded">{ent.assets.length} activos</span>
                  <span className="px-2 py-0.5 bg-purple-50 rounded">{ent.rats.length} RAT</span>
                </div>
                {ent.id !== activeEnterpriseId && <button onClick={() => switchEnterprise(ent.id)} className="mt-2 text-xs text-blue-600 hover:underline">Cambiar a esta empresa</button>}
              </div>
            ))}
          </div>
          {showEntForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="font-bold mb-4">Nueva Empresa</h3>
                <div className="space-y-3">
                  <input placeholder="Nombre Comercial *" value={entForm.nombreComercial} onChange={e => setEntForm({...entForm, nombreComercial: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                  <input placeholder="Razón Social *" value={entForm.razonSocial} onChange={e => setEntForm({...entForm, razonSocial: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                  <input placeholder="RUC *" value={entForm.ruc} onChange={e => setEntForm({...entForm, ruc: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                  <input placeholder="Ciudad" value={entForm.ciudad} onChange={e => setEntForm({...entForm, ciudad: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                  <input placeholder="Provincia" value={entForm.provincia} onChange={e => setEntForm({...entForm, provincia: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { createEnterprise({ id: '', razonSocial: entForm.razonSocial, nombreComercial: entForm.nombreComercial, ruc: entForm.ruc, domicilioLegal: '', ciudad: entForm.ciudad, provincia: entForm.provincia, pais: 'Ecuador', sectorEconomico: '', tamanoEmpresa: '', actividadPrincipal: '', representanteLegal: '', responsableCumplimiento: '', delegadoProteccionDatos: '', telefono: '', email: '', sitioWeb: '', politicaConservacion: '', fechaActualizacion: new Date().toISOString().split('T')[0] }); setShowEntForm(false); }} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Crear</button>
                  <button onClick={() => setShowEntForm(false)} className="px-4 py-2 bg-gray-200 rounded text-sm">Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB: RESPALDOS */}
      {tab === 'backup' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-5 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2"><i className="fas fa-shield-alt"></i>Sistema de Respaldos</h3>
            <p className="text-emerald-100 text-sm mt-1">El sistema genera automáticamente un respaldo cada vez que se cierra la aplicación y cada 5 minutos.</p>
          </div>

          {/* Info del último respaldo */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><i className="fas fa-clock text-blue-500"></i>Último Respaldo Automático</h4>
            {lastBackup ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs text-gray-500">Fecha y Hora</p>
                  <p className="font-medium">{new Date(lastBackup.timestamp).toLocaleString('es-EC')}</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs text-gray-500">Empresas</p>
                  <p className="font-medium">{lastBackup.data?.enterprises?.length || 0}</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs text-gray-500">Usuarios</p>
                  <p className="font-medium">{lastBackup.data?.users?.length || 0}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No hay respaldos previos registrados en este navegador.</p>
            )}
          </div>

          {/* Acciones de respaldo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Crear respaldo manual */}
            <div className="bg-white rounded-lg border p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-download text-blue-600"></i>
              </div>
              <h4 className="font-semibold text-sm mb-1">Crear Respaldo Manual</h4>
              <p className="text-xs text-gray-500 mb-3">Descarga un archivo JSON con todos los datos del sistema.</p>
              <button onClick={handleCreateBackup} className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                <i className="fas fa-file-export mr-1"></i>Descargar Respaldo
              </button>
            </div>

            {/* Recuperar desde archivo */}
            <div className="bg-white rounded-lg border p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-upload text-purple-600"></i>
              </div>
              <h4 className="font-semibold text-sm mb-1">Recuperar desde Archivo</h4>
              <p className="text-xs text-gray-500 mb-3">Restaura el sistema desde un archivo de respaldo JSON previo.</p>
              <button onClick={() => fileInputRef.current?.click()} className="w-full px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                <i className="fas fa-file-import mr-1"></i>Seleccionar Archivo
              </button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </div>

            {/* Recuperar desde localStorage */}
            <div className="bg-white rounded-lg border p-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <i className="fas fa-undo text-emerald-600"></i>
              </div>
              <h4 className="font-semibold text-sm mb-1">Recuperar Último Respaldo</h4>
              <p className="text-xs text-gray-500 mb-3">Restaura desde el último respaldo guardado en este navegador.</p>
              <button onClick={handleRestoreFromLocalStorage} disabled={!lastBackup} className={`w-full px-3 py-2 rounded text-sm ${lastBackup ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                <i className="fas fa-history mr-1"></i>Restaurar Local
              </button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 text-sm mb-2"><i className="fas fa-info-circle mr-2"></i>Información Importante</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• El respaldo automático se genera al cerrar la pestaña/ventana del navegador.</li>
              <li>• También se genera un respaldo automático cada 5 minutos en segundo plano.</li>
              <li>• Los respaldos locales se almacenan en el navegador (localStorage) del equipo.</li>
              <li>• Se recomienda descargar respaldos manuales periódicamente y guardarlos en un lugar seguro.</li>
              <li>• Al restaurar un respaldo, se reemplazarán TODOS los datos actuales del sistema.</li>
              <li>• El archivo de respaldo es un JSON que contiene empresas, usuarios, tratamientos, incidentes, etc.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Confirmación de restauración */}
      {confirmRestore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-amber-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Confirmar Restauración</h3>
                <p className="text-xs text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
              <p className="text-sm text-amber-800"><strong>Origen:</strong> {confirmRestore.source}</p>
              <p className="text-xs text-amber-700 mt-2">
                <i className="fas fa-exclamation-circle mr-1"></i>
                Al confirmar, todos los datos actuales serán reemplazados por los datos del respaldo. Se recomienda crear un respaldo manual antes de continuar.
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={confirmRestoreAction} className="flex-1 px-4 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700">
                <i className="fas fa-check mr-1"></i>Confirmar Restauración
              </button>
              <button onClick={() => setConfirmRestore(null)} className="flex-1 px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useStore } from '../store/store';
import type { User } from '../store/store';
import { useState } from 'react';

export default function AdminModule() {
  const { users, enterprises, activeEnterpriseId, addUser, updateUser, deleteUser, createEnterprise, deleteEnterprise, switchEnterprise } = useStore();
  const [tab, setTab] = useState<'users' | 'enterprises'>('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showEntForm, setShowEntForm] = useState(false);
  const [userForm, setUserForm] = useState({ username: '', password: '', nombre: '', email: '', role: 'readonly' as User['role'], empresaId: activeEnterpriseId || '', activo: true });
  const [entForm, setEntForm] = useState({ nombreComercial: '', razonSocial: '', ruc: '', ciudad: 'Quito', provincia: 'Pichincha' });

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded text-sm ${tab === 'users' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Usuarios</button>
        <button onClick={() => setTab('enterprises')} className={`px-4 py-2 rounded text-sm ${tab === 'enterprises' ? 'bg-white shadow text-blue-700' : 'text-gray-600'}`}>Empresas</button>
      </div>

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
    </div>
  );
}

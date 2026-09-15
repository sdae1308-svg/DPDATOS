import React, { useState } from 'react';
import { useStore } from '../store/store';
import { useEnterprise } from '../store/useEnterprise';

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
  const { currentUser, logout, enterprises, activeEnterpriseId, switchEnterprise } = useStore();
  const { company } = useEnterprise();

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
          <div className="flex items-center gap-3">
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
    </div>
  );
}

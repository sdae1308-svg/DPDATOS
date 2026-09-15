import React, { useState } from 'react';
import { useStore } from '../store/store';

interface LayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onNavigate: (module: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard General', icon: 'fa-chart-line' },
  { id: 'company', label: 'Datos de la Empresa', icon: 'fa-building' },
  { id: 'employees', label: 'Empleados', icon: 'fa-users' },
  { id: 'assets', label: 'Activos de Información', icon: 'fa-server' },
  { id: 'rat', label: 'RAT', icon: 'fa-clipboard-list' },
  { id: 'incidents', label: 'Incidentes y Riesgos', icon: 'fa-shield-halved' },
  { id: 'audit', label: 'Auditoría', icon: 'fa-magnifying-glass-chart' },
  { id: 'maturity', label: 'Madurez', icon: 'fa-chart-simple' },
  { id: 'documents', label: 'Documentos', icon: 'fa-file-lines' },
  { id: 'logs', label: 'Bitácora', icon: 'fa-clock-rotate-left' },
];

export default function Layout({ children, currentModule, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser, currentRole, company } = useStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">EC</div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-sm">ComplianceEC</h1>
                <p className="text-[10px] text-slate-400">LOPDP Ecuador</p>
              </div>
            )}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                currentModule === item.id
                  ? 'bg-blue-600 text-white border-r-2 border-blue-300'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center text-sm`}></i>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="p-3 border-t border-slate-700 text-xs text-slate-400">
            <p className="truncate">{company.nombreComercial}</p>
            <p className="truncate">Usuario: {currentUser}</p>
            <p className="truncate">Rol: {currentRole}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
              <i className={`fas ${sidebarOpen ? 'fa-bars' : 'fa-bars'} text-lg`}></i>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(m => m.id === currentModule)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <i className="fas fa-bell text-gray-400 cursor-pointer hover:text-gray-600"></i>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-blue-600 text-xs"></i>
              </div>
              <span className="text-sm text-gray-600 hidden md:block">{currentUser}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

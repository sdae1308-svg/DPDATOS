import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoCompany, demoEmployees, demoAssets, demoRATs, demoIncidents, demoRisks, demoAudits, demoDocuments, demoMaturity } from '../data/demoData';
import type { Company, Employee, Asset, RAT, Incident, Risk, Audit, Document, MaturityDimension } from '../data/demoData';

// ============ TIPOS MULTIEMPRESA ============

export interface User {
  id: string;
  username: string;
  password: string;
  nombre: string;
  email: string;
  role: 'admin' | 'compliance' | 'dpo' | 'rrhh' | 'security' | 'auditor' | 'readonly';
  empresaId: string;
  activo: boolean;
  fechaCreacion: string;
}

export interface Enterprise {
  id: string;
  company: Company;
  employees: Employee[];
  assets: Asset[];
  rats: RAT[];
  incidents: Incident[];
  risks: Risk[];
  audits: Audit[];
  documents: Document[];
  maturity: MaturityDimension[];
  fechaCreacion: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  detail: string;
}

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  
  // Multi-empresa
  enterprises: Enterprise[];
  activeEnterpriseId: string | null;
  
  // Logs
  logs: LogEntry[];

  // Auth Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'fechaCreacion'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Enterprise Actions
  createEnterprise: (company: Company) => void;
  switchEnterprise: (id: string) => void;
  deleteEnterprise: (id: string) => void;
  updateCompany: (data: Company) => void;

  // Data Actions (scoped to active enterprise)
  addEmployee: (e: Employee) => void;
  updateEmployee: (id: string, e: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addAsset: (a: Asset) => void;
  updateAsset: (id: string, a: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  addRAT: (r: RAT) => void;
  updateRAT: (id: string, r: Partial<RAT>) => void;
  deleteRAT: (id: string) => void;
  addIncident: (i: Incident) => void;
  updateIncident: (id: string, i: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  addRisk: (r: Risk) => void;
  updateRisk: (id: string, r: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;
  addAudit: (a: Audit) => void;
  updateAudit: (id: string, a: Partial<Audit>) => void;
  deleteAudit: (id: string) => void;
  addDocument: (d: Document) => void;
  updateDocument: (id: string, d: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  updateMaturity: (dims: MaturityDimension[]) => void;

  // Logs
  addLog: (action: string, module: string, detail: string) => void;

  // Helpers
  getActiveEnterprise: () => Enterprise | null;
  resetToDemo: () => void;
}

// Datos demo iniciales
const defaultEnterprise: Enterprise = {
  id: 'ENT-001',
  company: demoCompany,
  employees: demoEmployees,
  assets: demoAssets,
  rats: demoRATs,
  incidents: demoIncidents,
  risks: demoRisks,
  audits: demoAudits,
  documents: demoDocuments,
  maturity: demoMaturity,
  fechaCreacion: new Date().toISOString()
};

const defaultUsers: User[] = [
  { id: 'USR-001', username: 'admin', password: 'admin123', nombre: 'Administrador General', email: 'admin@tecservifin.com.ec', role: 'admin', empresaId: 'ENT-001', activo: true, fechaCreacion: new Date().toISOString() },
  { id: 'USR-002', username: 'compliance', password: 'comp123', nombre: 'María Fernanda Andrade', email: 'andrade@tecservifin.com.ec', role: 'compliance', empresaId: 'ENT-001', activo: true, fechaCreacion: new Date().toISOString() },
  { id: 'USR-003', username: 'dpo', password: 'dpo123', nombre: 'Roberto Salazar Espinoza', email: 'salazar@tecservifin.com.ec', role: 'dpo', empresaId: 'ENT-001', activo: true, fechaCreacion: new Date().toISOString() },
];

const addLogEntry = (state: AppState, action: string, module: string, detail: string): LogEntry => ({
  id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  timestamp: new Date().toISOString(),
  userId: state.currentUser?.id || 'system',
  userName: state.currentUser?.nombre || 'Sistema',
  action,
  module,
  detail
});

const updateActiveEnterprise = (state: AppState, updater: (ent: Enterprise) => Enterprise): Enterprise[] => {
  if (!state.activeEnterpriseId) return state.enterprises;
  return state.enterprises.map(e => e.id === state.activeEnterpriseId ? updater(e) : e);
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: defaultUsers,
      enterprises: [defaultEnterprise],
      activeEnterpriseId: 'ENT-001',
      logs: [],

      // Auth
      login: (username, password) => {
        const user = get().users.find(u => u.username === username && u.password === password && u.activo);
        if (user) {
          set({ currentUser: user, activeEnterpriseId: user.empresaId });
          const state = get();
          set({ logs: [...state.logs, addLogEntry(state, 'Login', 'Auth', `Usuario ${user.nombre} inició sesión`)] });
          return true;
        }
        return false;
      },
      logout: () => {
        const state = get();
        set({ logs: [...state.logs, addLogEntry(state, 'Logout', 'Auth', `Usuario cerró sesión`)] });
        set({ currentUser: null });
      },
      addUser: (userData) => {
        const state = get();
        const id = `USR-${String(state.users.length + 1).padStart(3, '0')}`;
        const newUser = { ...userData, id, fechaCreacion: new Date().toISOString() };
        set({ users: [...state.users, newUser], logs: [...state.logs, addLogEntry(state, 'Crear', 'Usuarios', `Usuario ${newUser.nombre}`)] });
      },
      updateUser: (id, data) => {
        const state = get();
        set({ users: state.users.map(u => u.id === id ? { ...u, ...data } : u), logs: [...state.logs, addLogEntry(state, 'Editar', 'Usuarios', `Usuario ${id}`)] });
      },
      deleteUser: (id) => {
        const state = get();
        set({ users: state.users.filter(u => u.id !== id), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Usuarios', `Usuario ${id}`)] });
      },

      // Enterprise
      createEnterprise: (company) => {
        const state = get();
        const id = `ENT-${String(state.enterprises.length + 1).padStart(3, '0')}`;
        const newEnt: Enterprise = {
          id,
          company: { ...company, id: id },
          employees: [],
          assets: [],
          rats: [],
          incidents: [],
          risks: [],
          audits: [],
          documents: [],
          maturity: demoMaturity.map(m => ({ ...m, nivel: 0 })),
          fechaCreacion: new Date().toISOString()
        };
        set({ enterprises: [...state.enterprises, newEnt], logs: [...state.logs, addLogEntry(state, 'Crear', 'Empresas', `Empresa ${company.nombreComercial}`)] });
      },
      switchEnterprise: (id) => {
        const state = get();
        set({ activeEnterpriseId: id, logs: [...state.logs, addLogEntry(state, 'Cambiar', 'Empresas', `Empresa activa: ${id}`)] });
      },
      deleteEnterprise: (id) => {
        const state = get();
        set({ enterprises: state.enterprises.filter(e => e.id !== id), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Empresas', `Empresa ${id}`)] });
      },
      updateCompany: (data) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, e => ({ ...e, company: data })), logs: [...state.logs, addLogEntry(state, 'Editar', 'Empresa', 'Datos actualizados')] });
      },

      // Data Actions
      addEmployee: (e) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, employees: [...ent.employees, e] })), logs: [...state.logs, addLogEntry(state, 'Crear', 'Empleados', `Empleado ${e.nombre}`)] });
      },
      updateEmployee: (id, data) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, employees: ent.employees.map(e => e.id === id ? { ...e, ...data } : e) })), logs: [...state.logs, addLogEntry(state, 'Editar', 'Empleados', `Empleado ${id}`)] });
      },
      deleteEmployee: (id) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, employees: ent.employees.filter(e => e.id !== id) })), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Empleados', `Empleado ${id}`)] });
      },
      addAsset: (a) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, assets: [...ent.assets, a] })), logs: [...state.logs, addLogEntry(state, 'Crear', 'Activos', `Activo ${a.nombre}`)] });
      },
      updateAsset: (id, data) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, assets: ent.assets.map(a => a.id === id ? { ...a, ...data } : a) })), logs: [...state.logs, addLogEntry(state, 'Editar', 'Activos', `Activo ${id}`)] });
      },
      deleteAsset: (id) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, assets: ent.assets.filter(a => a.id !== id) })), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Activos', `Activo ${id}`)] });
      },
      addRAT: (r) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, rats: [...ent.rats, r] })), logs: [...state.logs, addLogEntry(state, 'Crear', 'RAT', `RAT ${r.nombre}`)] });
      },
      updateRAT: (id, data) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, rats: ent.rats.map(r => r.id === id ? { ...r, ...data } : r) })), logs: [...state.logs, addLogEntry(state, 'Editar', 'RAT', `RAT ${id}`)] });
      },
      deleteRAT: (id) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, rats: ent.rats.filter(r => r.id !== id) })), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'RAT', `RAT ${id}`)] });
      },
      addIncident: (i) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, incidents: [...ent.incidents, i] })), logs: [...state.logs, addLogEntry(state, 'Crear', 'Incidentes', `Incidente ${i.codigo}`)] });
      },
      updateIncident: (id, data) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, incidents: ent.incidents.map(i => i.id === id ? { ...i, ...data } : i) })), logs: [...state.logs, addLogEntry(state, 'Editar', 'Incidentes', `Incidente ${id}`)] });
      },
      deleteIncident: (id) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, incidents: ent.incidents.filter(i => i.id !== id) })), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Incidentes', `Incidente ${id}`)] });
      },
      addRisk: (r) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, risks: [...ent.risks, r] })), logs: [...state.logs, addLogEntry(state, 'Crear', 'Riesgos', `Riesgo ${r.nombre}`)] });
      },
      updateRisk: (id, data) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, risks: ent.risks.map(r => r.id === id ? { ...r, ...data } : r) })), logs: [...state.logs, addLogEntry(state, 'Editar', 'Riesgos', `Riesgo ${id}`)] });
      },
      deleteRisk: (id) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, risks: ent.risks.filter(r => r.id !== id) })), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Riesgos', `Riesgo ${id}`)] });
      },
      addAudit: (a) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, audits: [...ent.audits, a] })), logs: [...state.logs, addLogEntry(state, 'Crear', 'Auditoría', `Auditoría ${a.nombre}`)] });
      },
      updateAudit: (id, data) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, audits: ent.audits.map(a => a.id === id ? { ...a, ...data } : a) })), logs: [...state.logs, addLogEntry(state, 'Editar', 'Auditoría', `Auditoría ${id}`)] });
      },
      deleteAudit: (id) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, audits: ent.audits.filter(a => a.id !== id) })), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Auditoría', `Auditoría ${id}`)] });
      },
      addDocument: (d) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, documents: [...ent.documents, d] })), logs: [...state.logs, addLogEntry(state, 'Crear', 'Documentos', `Documento ${d.nombre}`)] });
      },
      updateDocument: (id, data) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, documents: ent.documents.map(d => d.id === id ? { ...d, ...data } : d) })), logs: [...state.logs, addLogEntry(state, 'Editar', 'Documentos', `Documento ${id}`)] });
      },
      deleteDocument: (id) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, documents: ent.documents.filter(d => d.id !== id) })), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Documentos', `Documento ${id}`)] });
      },
      updateMaturity: (dims) => {
        const state = get();
        set({ enterprises: updateActiveEnterprise(state, ent => ({ ...ent, maturity: dims })) });
      },

      addLog: (action, module, detail) => {
        const state = get();
        set({ logs: [...state.logs, addLogEntry(state, action, module, detail)] });
      },

      getActiveEnterprise: () => {
        const state = get();
        return state.enterprises.find(e => e.id === state.activeEnterpriseId) || null;
      },

      resetToDemo: () => set({
        enterprises: [defaultEnterprise],
        activeEnterpriseId: 'ENT-001',
        logs: []
      })
    }),
    { name: 'compliance-ec-multi-storage' }
  )
);

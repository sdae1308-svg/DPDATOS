import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoCompany, demoEmployees, demoAssets, demoRATs, demoIncidents, demoRisks, demoAudits, demoDocuments, demoMaturity } from '../data/demoData';
import type { Company, Employee, Asset, RAT, Incident, Risk, Audit, Document, MaturityDimension } from '../data/demoData';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  detail: string;
}

interface AppState {
  // Data
  company: Company;
  employees: Employee[];
  assets: Asset[];
  rats: RAT[];
  incidents: Incident[];
  risks: Risk[];
  audits: Audit[];
  documents: Document[];
  maturity: MaturityDimension[];
  logs: LogEntry[];
  currentUser: string;
  currentRole: string;

  // Actions
  setCompany: (c: Company) => void;
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
  addRisk: (r: Risk) => void;
  updateRisk: (id: string, r: Partial<Risk>) => void;
  addAudit: (a: Audit) => void;
  updateAudit: (id: string, a: Partial<Audit>) => void;
  addDocument: (d: Document) => void;
  updateDocument: (id: string, d: Partial<Document>) => void;
  updateMaturity: (dims: MaturityDimension[]) => void;
  addLog: (action: string, module: string, detail: string) => void;
  resetToDemo: () => void;
}

const addLogEntry = (state: AppState, action: string, module: string, detail: string): LogEntry => ({
  id: `LOG-${Date.now()}`,
  timestamp: new Date().toISOString(),
  user: state.currentUser,
  action,
  module,
  detail
});

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      company: demoCompany,
      employees: demoEmployees,
      assets: demoAssets,
      rats: demoRATs,
      incidents: demoIncidents,
      risks: demoRisks,
      audits: demoAudits,
      documents: demoDocuments,
      maturity: demoMaturity,
      logs: [],
      currentUser: 'Administrador',
      currentRole: 'admin',

      setCompany: (c) => {
        const state = get();
        set({ company: c, logs: [...state.logs, addLogEntry(state, 'Editar', 'Empresa', `Datos actualizados`)] });
      },
      addEmployee: (e) => {
        const state = get();
        set({ employees: [...state.employees, e], logs: [...state.logs, addLogEntry(state, 'Crear', 'Empleados', `Empleado ${e.nombre}`)] });
      },
      updateEmployee: (id, data) => {
        const state = get();
        set({ employees: state.employees.map(e => e.id === id ? { ...e, ...data } : e), logs: [...state.logs, addLogEntry(state, 'Editar', 'Empleados', `Empleado ${id}`)] });
      },
      deleteEmployee: (id) => {
        const state = get();
        set({ employees: state.employees.filter(e => e.id !== id), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Empleados', `Empleado ${id}`)] });
      },
      addAsset: (a) => {
        const state = get();
        set({ assets: [...state.assets, a], logs: [...state.logs, addLogEntry(state, 'Crear', 'Activos', `Activo ${a.nombre}`)] });
      },
      updateAsset: (id, data) => {
        const state = get();
        set({ assets: state.assets.map(a => a.id === id ? { ...a, ...data } : a), logs: [...state.logs, addLogEntry(state, 'Editar', 'Activos', `Activo ${id}`)] });
      },
      deleteAsset: (id) => {
        const state = get();
        set({ assets: state.assets.filter(a => a.id !== id), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'Activos', `Activo ${id}`)] });
      },
      addRAT: (r) => {
        const state = get();
        set({ rats: [...state.rats, r], logs: [...state.logs, addLogEntry(state, 'Crear', 'RAT', `RAT ${r.nombre}`)] });
      },
      updateRAT: (id, data) => {
        const state = get();
        set({ rats: state.rats.map(r => r.id === id ? { ...r, ...data } : r), logs: [...state.logs, addLogEntry(state, 'Editar', 'RAT', `RAT ${id}`)] });
      },
      deleteRAT: (id) => {
        const state = get();
        set({ rats: state.rats.filter(r => r.id !== id), logs: [...state.logs, addLogEntry(state, 'Eliminar', 'RAT', `RAT ${id}`)] });
      },
      addIncident: (i) => {
        const state = get();
        set({ incidents: [...state.incidents, i], logs: [...state.logs, addLogEntry(state, 'Crear', 'Incidentes', `Incidente ${i.codigo}`)] });
      },
      updateIncident: (id, data) => {
        const state = get();
        set({ incidents: state.incidents.map(i => i.id === id ? { ...i, ...data } : i), logs: [...state.logs, addLogEntry(state, 'Editar', 'Incidentes', `Incidente ${id}`)] });
      },
      addRisk: (r) => {
        const state = get();
        set({ risks: [...state.risks, r], logs: [...state.logs, addLogEntry(state, 'Crear', 'Riesgos', `Riesgo ${r.nombre}`)] });
      },
      updateRisk: (id, data) => {
        const state = get();
        set({ risks: state.risks.map(r => r.id === id ? { ...r, ...data } : r), logs: [...state.logs, addLogEntry(state, 'Editar', 'Riesgos', `Riesgo ${id}`)] });
      },
      addAudit: (a) => {
        const state = get();
        set({ audits: [...state.audits, a], logs: [...state.logs, addLogEntry(state, 'Crear', 'Auditoría', `Auditoría ${a.nombre}`)] });
      },
      updateAudit: (id, data) => {
        const state = get();
        set({ audits: state.audits.map(a => a.id === id ? { ...a, ...data } : a), logs: [...state.logs, addLogEntry(state, 'Editar', 'Auditoría', `Auditoría ${id}`)] });
      },
      addDocument: (d) => {
        const state = get();
        set({ documents: [...state.documents, d], logs: [...state.logs, addLogEntry(state, 'Crear', 'Documentos', `Documento ${d.nombre}`)] });
      },
      updateDocument: (id, data) => {
        const state = get();
        set({ documents: state.documents.map(d => d.id === id ? { ...d, ...data } : d), logs: [...state.logs, addLogEntry(state, 'Editar', 'Documentos', `Documento ${id}`)] });
      },
      updateMaturity: (dims) => set({ maturity: dims }),
      addLog: (action, module, detail) => {
        const state = get();
        set({ logs: [...state.logs, addLogEntry(state, action, module, detail)] });
      },
      resetToDemo: () => set({
        company: demoCompany,
        employees: demoEmployees,
        assets: demoAssets,
        rats: demoRATs,
        incidents: demoIncidents,
        risks: demoRisks,
        audits: demoAudits,
        documents: demoDocuments,
        maturity: demoMaturity,
        logs: []
      })
    }),
    { name: 'compliance-ec-storage' }
  )
);

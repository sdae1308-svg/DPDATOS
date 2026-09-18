import { useStore } from './store';
import type { Enterprise } from './store';

export function useEnterprise() {
  const store = useStore();
  const enterprise = store.getActiveEnterprise();
  
  if (!enterprise) {
    return {
      company: null,
      employees: [],
      assets: [],
      rats: [],
      incidents: [],
      risks: [],
      audits: [],
      documents: [],
      maturity: [],
      // Actions
      updateCompany: () => {},
      addEmployee: () => {},
      updateEmployee: () => {},
      deleteEmployee: () => {},
      addAsset: () => {},
      updateAsset: () => {},
      deleteAsset: () => {},
      addRAT: () => {},
      updateRAT: () => {},
      deleteRAT: () => {},
      addIncident: () => {},
      updateIncident: () => {},
      deleteIncident: () => {},
      addRisk: () => {},
      updateRisk: () => {},
      deleteRisk: () => {},
      addAudit: () => {},
      updateAudit: () => {},
      deleteAudit: () => {},
      addDocument: () => {},
      updateDocument: () => {},
      deleteDocument: () => {},
      updateMaturity: () => {},
    };
  }

  return {
    company: enterprise.company,
    employees: enterprise.employees,
    assets: enterprise.assets,
    rats: enterprise.rats,
    incidents: enterprise.incidents,
    risks: enterprise.risks,
    audits: enterprise.audits,
    documents: enterprise.documents,
    maturity: enterprise.maturity,
    // Actions
    updateCompany: store.updateCompany,
    addEmployee: store.addEmployee,
    updateEmployee: store.updateEmployee,
    deleteEmployee: store.deleteEmployee,
    addAsset: store.addAsset,
    updateAsset: store.updateAsset,
    deleteAsset: store.deleteAsset,
    addRAT: store.addRAT,
    updateRAT: store.updateRAT,
    deleteRAT: store.deleteRAT,
    addIncident: store.addIncident,
    updateIncident: store.updateIncident,
    deleteIncident: store.deleteIncident,
    addRisk: store.addRisk,
    updateRisk: store.updateRisk,
    deleteRisk: store.deleteRisk,
    addAudit: store.addAudit,
    updateAudit: store.updateAudit,
    deleteAudit: store.deleteAudit,
    addDocument: store.addDocument,
    updateDocument: store.updateDocument,
    deleteDocument: store.deleteDocument,
    updateMaturity: store.updateMaturity,
  };
}

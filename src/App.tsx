import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './modules/Dashboard';
import CompanyModule from './modules/CompanyModule';
import EmployeesModule from './modules/EmployeesModule';
import AssetsModule from './modules/AssetsModule';
import RATModule from './modules/RATModule';
import IncidentsModule from './modules/IncidentsModule';
import AuditModule from './modules/AuditModule';
import MaturityModule from './modules/MaturityModule';
import DocumentsModule from './modules/DocumentsModule';
import LogsModule from './modules/LogsModule';

export default function App() {
  const [currentModule, setCurrentModule] = useState('dashboard');

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard': return <Dashboard />;
      case 'company': return <CompanyModule />;
      case 'employees': return <EmployeesModule />;
      case 'assets': return <AssetsModule />;
      case 'rat': return <RATModule />;
      case 'incidents': return <IncidentsModule />;
      case 'audit': return <AuditModule />;
      case 'maturity': return <MaturityModule />;
      case 'documents': return <DocumentsModule />;
      case 'logs': return <LogsModule />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentModule={currentModule} onNavigate={setCurrentModule}>
      {renderModule()}
    </Layout>
  );
}

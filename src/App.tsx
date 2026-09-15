import { useState } from 'react';
import { useStore } from './store/store';
import Login from './components/Login';
import Layout from './components/Layout';
import { Dashboard, CompanyModule, EmployeesModule, AssetsModule, RATModule, IncidentsModule, AuditModule, MaturityModule, DocumentsModule, LogsModule } from './modules/AllModules';
import AdminModule from './modules/AdminModule';

export default function App() {
  const { currentUser } = useStore();
  const [currentModule, setCurrentModule] = useState('dashboard');

  if (!currentUser) return <Login />;

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
      case 'admin': return <AdminModule />;
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

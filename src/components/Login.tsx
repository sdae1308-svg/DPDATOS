import { useState } from 'react';
import { useStore } from '../store/store';

export default function Login() {
  const { login } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) setError('Usuario o contraseña incorrectos');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shield-halved text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold">ComplianceEC</h1>
          <p className="text-blue-200 text-sm mt-1">Sistema de Cumplimiento LOPDP Ecuador</p>
          <p className="text-blue-300 text-xs mt-2">Multiempresa | Multiusuario</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>}
          <div>
            <label className="text-sm font-medium text-gray-700">Usuario</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ingrese su usuario" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ingrese su contraseña" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <i className="fas fa-sign-in-alt mr-2"></i>Iniciar Sesión
          </button>
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
            <p className="font-medium mb-1">Usuarios demo:</p>
            <p>• admin / admin123 (Administrador)</p>
            <p>• compliance / comp123 (Oficial de Cumplimiento)</p>
            <p>• dpo / dpo123 (Delegado Protección Datos)</p>
          </div>
        </form>
      </div>
    </div>
  );
}

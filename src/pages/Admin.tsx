import React from 'react';
import { useEffect, useState } from 'react';
import { ClipboardList, LogOut } from 'lucide-react';

export default function Admin() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAuthorized(isAdmin);
    
    if (!isAdmin) {
      window.location.href = '/';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-teal-600" />
              <h1 className="ml-3 text-2xl font-semibold text-gray-900">
                Painel Administrativo
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Questionários Recentes</h2>
          <div className="text-gray-600">
            Os dados dos questionários serão exibidos aqui quando integrados com um backend.
          </div>
        </div>
      </main>
    </div>
  );
}
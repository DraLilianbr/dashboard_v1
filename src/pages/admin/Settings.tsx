import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie as configurações do sistema.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Configurações Gerais
        </h2>
        <p className="text-gray-600">
          Configurações em desenvolvimento.
        </p>
      </div>
    </div>
  );
}
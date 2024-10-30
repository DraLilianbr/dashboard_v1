import React, { useState } from 'react';
import { Patient, RegistrationModalProps } from '../types';
import { KeyRound } from 'lucide-react';

export default function RegistrationModal({ isOpen, onClose, onSubmit }: RegistrationModalProps) {
  const [patient, setPatient] = useState<Patient>({
    name: '',
    birthDate: '',
    phone: '',
    email: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Por favor, aceite os termos para continuar.');
      return;
    }
    onSubmit(patient);
  };

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      window.location.href = '/admin';
    } else {
      alert('Senha incorreta');
    }
  };

  if (!isOpen) return null;

  if (showAdminLogin) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-6">
            <KeyRound className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Acesso Administrativo</h2>
          <form onSubmit={handleAdminAccess} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setShowAdminLogin(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold mb-6">Cadastro do Paciente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={patient.name}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              required
              value={patient.birthDate}
              onChange={(e) => setPatient({ ...patient, birthDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              required
              value={patient.phone}
              onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={patient.email}
              onChange={(e) => setPatient({ ...patient, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div className="mt-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">
                Aceito os termos de uso e autorizo o uso das minhas informações para fins de tratamento,
                de acordo com a Lei Geral de Proteção de Dados (LGPD). Reconheço que minhas respostas
                serão utilizadas para fins de diagnóstico e tratamento de acupuntura.
              </span>
            </label>
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setShowAdminLogin(true)}
              className="px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Admin
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md"
              >
                Começar Anamnese
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
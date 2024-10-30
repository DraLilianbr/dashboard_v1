import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  BarChart3,
  Receipt,
} from 'lucide-react';
import Overview from './Overview';
import Patients from './Patients';
import Appointments from './Appointments';
import Questionnaires from './Questionnaires';
import Reports from './Reports';
import Receipts from './Receipts';
import Settings from './Settings';

export default function AdminDashboard() {
  const location = useLocation();
  
  const navigation = [
    { name: 'Visão Geral', href: '/admin', icon: BarChart3 },
    { name: 'Pacientes', href: '/admin/patients', icon: Users },
    { name: 'Agendamentos', href: '/admin/appointments', icon: Calendar },
    { name: 'Questionários', href: '/admin/questionnaires', icon: ClipboardList },
    { name: 'Relatórios', href: '/admin/reports', icon: FileText },
    { name: 'Recibos', href: '/admin/receipts', icon: Receipt },
    { name: 'Configurações', href: '/admin/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white border-r border-gray-200">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  Clínica de Acupuntura
                </h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-teal-50 text-teal-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <Icon
                        className={`${
                          isActive ? 'text-teal-600' : 'text-gray-400'
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <LogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Sair
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/questionnaires" element={<Questionnaires />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/receipts" element={<Receipts />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
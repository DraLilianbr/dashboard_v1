import React, { useState } from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Primeira Consulta' | 'Retorno';
  status: 'Agendado' | 'Confirmado' | 'Cancelado' | 'Concluído';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Maria Silva',
    date: '2024-03-14',
    time: '09:00',
    type: 'Primeira Consulta',
    status: 'Confirmado'
  },
  {
    id: '2',
    patientName: 'João Santos',
    date: '2024-03-14',
    time: '10:30',
    type: 'Retorno',
    status: 'Agendado'
  }
];

const statusColors = {
  Agendado: 'bg-yellow-100 text-yellow-800',
  Confirmado: 'bg-green-100 text-green-800',
  Cancelado: 'bg-red-100 text-red-800',
  Concluído: 'bg-blue-100 text-blue-800'
};

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Agendamentos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie todas as consultas e retornos dos pacientes.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
            <Plus className="h-4 w-4 mr-2" />
            Nova Consulta
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Consultas do Dia
          </h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {mockAppointments.map((appointment) => (
                <li key={appointment.id} className="py-5">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {appointment.patientName}
                      </p>
                      <div className="flex items-center mt-1">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          {format(new Date(`${appointment.date}T${appointment.time}`), 
                            "dd 'de' MMMM', às' HH:mm", 
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                        {appointment.status}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Próximas Consultas
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(`${appointment.date}T${appointment.time}`), 
                        "dd/MM/yyyy' às 'HH:mm"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { SubmitModalProps } from '../types';
import { CheckCircle } from 'lucide-react';

export default function SubmitModal({ isOpen, onClose, onConfirm }: SubmitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-teal-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Confirmar Envio
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Você está prestes a enviar todas as suas respostas. Tem certeza que deseja continuar?
          </p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Voltar
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700"
            >
              Confirmar Envio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
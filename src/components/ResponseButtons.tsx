import React from 'react';
import { ResponseButtonsProps } from '../types';

export default function ResponseButtons({ options, onResponse }: ResponseButtonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl mx-auto mt-6">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onResponse(option)}
          className="px-6 py-3 text-sm sm:text-base bg-white border-2 border-teal-600 text-teal-700 rounded-lg
                   hover:bg-teal-50 active:bg-teal-100 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
import React from 'react';

interface ProgressDotsProps {
  currentIndex: number;
  totalVideos: number;
}

export default function ProgressDots({ currentIndex, totalVideos }: ProgressDotsProps) {
  return (
    <div className="flex justify-center items-center gap-1.5 mt-4 flex-wrap max-w-2xl mx-auto px-4">
      {Array.from({ length: totalVideos }, (_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentIndex
              ? 'bg-teal-600 scale-125'
              : index < currentIndex
              ? 'bg-teal-400'
              : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
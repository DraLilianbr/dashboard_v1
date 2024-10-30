import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { VideoPlayerProps } from '../types';
import ProgressDots from './ProgressDots';
import SubmitModal from './SubmitModal';

export default function VideoPlayer({
  currentVideo,
  onNext,
  onPrevious,
  totalVideos,
  currentIndex,
  response,
  onResponseChange,
  onSubmitQuestionnaire,
}: VideoPlayerProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const isLastVideo = currentIndex === totalVideos - 1;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative">
        <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden shadow-xl">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={currentVideo.url}
            title={currentVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="mt-6 text-center">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {currentVideo.title}
        </h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-md">
            <div
              className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / totalVideos) * 100}%`,
              }}
            ></div>
          </div>
          <ProgressDots
            currentIndex={currentIndex}
            totalVideos={totalVideos}
          />
          <p className="text-sm text-gray-600">
            Vídeo {currentIndex + 1} de {totalVideos}
          </p>
        </div>
      </div>

      {currentVideo.type === 'question' && (
        <div className="mt-6 max-w-2xl mx-auto">
          <textarea
            value={response}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder="Digite sua resposta aqui..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none h-32"
          />
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        {isLastVideo ? (
          <div className="flex gap-4">
            <button
              onClick={onPrevious}
              className="btn btn-primary flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar Questionário
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className={`btn btn-primary flex items-center gap-2 ${
                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>
            <button
              onClick={onNext}
              className="btn btn-primary flex items-center gap-2"
            >
              Próximo
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={onSubmitQuestionnaire}
      />
    </div>
  );
}
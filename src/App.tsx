import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import VideoPlayer from './components/VideoPlayer';
import RegistrationModal from './components/RegistrationModal';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import { videos } from './data/videos';
import { Patient } from './types';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [showRegistration, setShowRegistration] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleResponseChange = (response: string) => {
    setResponses(prev => ({
      ...prev,
      [currentIndex]: response
    }));
  };

  const handleRegistrationSubmit = (patientData: Patient) => {
    setPatient(patientData);
    setShowRegistration(false);
  };

  const handleSubmitQuestionnaire = () => {
    const questionnaireData = {
      patient,
      responses,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Submitting questionnaire:', questionnaireData);
    alert('Questionário enviado com sucesso! Obrigado por participar.');
  };

  const AnamnesisSurvey = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSubmit={handleRegistrationSubmit}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-start">
            <Stethoscope className="h-8 w-8 text-teal-600" />
            <h1 className="ml-3 text-2xl font-semibold text-gray-900">
              Anamnese de Acupuntura
            </h1>
          </div>
          {patient && (
            <div className="mt-2 text-sm text-gray-600">
              Paciente: {patient.name}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <VideoPlayer
            currentVideo={videos[currentIndex]}
            onNext={handleNext}
            onPrevious={handlePrevious}
            totalVideos={videos.length}
            currentIndex={currentIndex}
            response={responses[currentIndex] || ''}
            onResponseChange={handleResponseChange}
            onSubmitQuestionnaire={handleSubmitQuestionnaire}
          />
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Clínica de Acupuntura. Todos os direitos reservados.</p>
      </footer>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnamnesisSurvey />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
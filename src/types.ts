export interface Video {
  id: number;
  title: string;
  url: string;
  type: 'intro' | 'question' | 'outro';
}

export interface VideoPlayerProps {
  currentVideo: Video;
  onNext: () => void;
  onPrevious: () => void;
  totalVideos: number;
  currentIndex: number;
  response: string;
  onResponseChange: (response: string) => void;
  onSubmitQuestionnaire: () => void;
}

export interface Patient {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
}

export interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: Patient) => void;
}

export interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
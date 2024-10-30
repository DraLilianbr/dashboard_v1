export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  date: string;
  time: string;
  type: 'first_visit' | 'follow_up';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Questionnaire {
  id: number;
  patient_id: number;
  submitted_at: string | null;
  status: 'complete' | 'incomplete';
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireResponse {
  id: number;
  questionnaire_id: number;
  question_number: number;
  response: string;
  created_at: string;
  updated_at: string;
}

export interface Receipt {
  id: number;
  patient_id: number;
  appointment_id: number | null;
  amount: number;
  payment_method: string;
  status: 'paid' | 'pending' | 'cancelled';
  issued_at: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  patients: Patient;
  appointments: Appointment;
  questionnaires: Questionnaire;
  questionnaire_responses: QuestionnaireResponse;
  receipts: Receipt;
}
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: number;
  title: string;
  description?: string;
  reminder_time: string;
  category: string;
  is_active: boolean;
}

export interface HistoryItem {
  id: string;
  created_at: string | null;
  message_preview: string;
  response_preview: string;
  is_emergency: boolean;
  type: 'symptom' | 'prescription';
}

export interface Medicine {
  name: string;
  purpose: string;
  dosage: string;
  side_effects: string;
  warnings: string;
}

export interface LoginData {
  username?: string;
  email?: string;
  password?: string;
}

export type LoginRequestData = LoginData | FormData;

export interface RegisterData {
  username: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface ReminderData {
  title: string;
  category: string;
  reminder_time: string;
  description?: string;
}

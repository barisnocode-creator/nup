export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  system: boolean;
  order: number;
  placeholder?: string;
  options?: string[];
}

export interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_note: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  form_data: Record<string, string> | null;
  consent_given: boolean;
  internal_note?: string | null;
}

export interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
  breaks: { start: string; end: string }[];
}

export interface AppointmentSettings {
  is_enabled: boolean;
  timezone: string;
  slot_duration_minutes: number;
  buffer_minutes: number;
  working_days: number[];
  working_hours_start: string;
  working_hours_end: string;
  lunch_break_start: string | null;
  lunch_break_end: string | null;
  max_advance_days: number;
  day_schedules: Record<string, DaySchedule> | null;
  form_fields: FormField[] | null;
  consent_text: string | null;
  consent_required: boolean;
}

export interface BlockedSlot {
  id: string;
  blocked_date: string;
  reason: string | null;
  block_type: string;
  block_start_time: string | null;
  block_end_time: string | null;
}

export interface AgendaNote {
  id: string;
  project_id: string;
  user_id: string;
  note_date: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export type CalendarView = 'monthly' | 'weekly' | 'daily' | 'agenda';
export type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled';

export const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
export const DAY_NAMES_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
export const DAY_KEYS = ['0', '1', '2', '3', '4', '5', '6'];

export const TIMEZONES = [
  'Europe/Istanbul', 'Europe/London', 'Europe/Berlin', 'Europe/Paris',
  'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Asia/Tokyo',
];

export const DURATION_OPTIONS = [
  { value: '15', label: '15 dk' }, { value: '30', label: '30 dk' },
  { value: '45', label: '45 dk' }, { value: '60', label: '60 dk' },
  { value: '90', label: '90 dk' }, { value: '120', label: '120 dk' },
];

export const BUFFER_OPTIONS = [
  { value: '0', label: 'Yok' }, { value: '5', label: '5 dk' },
  { value: '10', label: '10 dk' }, { value: '15', label: '15 dk' },
];

export const FIELD_TYPES = [
  { value: 'text', label: 'Metin' }, { value: 'email', label: 'E-posta' },
  { value: 'tel', label: 'Telefon' }, { value: 'textarea', label: 'Uzun Metin' },
  { value: 'select', label: 'Seçim Listesi' },
];

export function getDefaultDaySchedules(): Record<string, DaySchedule> {
  const schedules: Record<string, DaySchedule> = {};
  for (let i = 0; i <= 6; i++) {
    schedules[String(i)] = {
      enabled: i >= 1 && i <= 5, start: '09:00', end: '18:00',
      breaks: i >= 1 && i <= 5 ? [{ start: '12:00', end: '13:00' }] : [],
    };
  }
  return schedules;
}

//PROFESSIONALS
export type ProfessionalFormValues = {
  user: {
    name: string;
    email?: string;
    phone?: string;
  };
  color: string;
  allowOverlap: boolean;
};

export interface WorkingHour {
  dayOfWeek: number; 
  startTime: string; 
  endTime: string;   
}

export interface TimeOff {
  _id?: string;
  start: string; 
  end: string;   
  reason?: string;
}

export interface Professional {
  _id: string;
  userId: User; 
  business: string; 
  services?: { _id: string; name: string }[]; 
  color?: string;
  allowOverlap?: boolean;
  workingHours?: WorkingHour[];
  timeOff?: TimeOff[];
}

export interface ProfessionalPayload {
  services?: string[];
  color?: string;
  allowOverlap?: boolean;
  workingHours?: WorkingHour[];
  timeOff?: TimeOff[];
}

export interface ProfessionalUserPayload {
  name: string;
  email?: string;
  phone?: string;
}



// APPOINTMENTS
export type AppointmentFormValues = {
  clientId: string;
  professionalId: string;
  serviceId: string;
  startLocal: string;
  notes?: string;
};

export interface Appointment {
  _id: string;
  business: string;
  service: any;       // puede venir populado o como id, lo manejamos en el front
  professional: any;
  client: any;
  start: string;      // ISO
  end?: string;       // ISO
  status: "pending" | "confirmed" | "cancelled" | "completed";
  source?: "manual" | "online";
  notes?: string;
}

export interface AppointmentPayload {
  service: string;
  professional: string;
  client: string;
  start: string;  // ISO
  end?: string;   // ISO
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  source?: "manual" | "online";
  notes?: string;
}


// CLIENTS
export type ClientFormValues = {
  name: string;
  email?: string;
  phone?: string;
};

export interface Client {
  _id: string;
  business: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface ClientPayload {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

// SERVICES
export interface Service {
  _id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  category?: string;
  color?: string;
  allowOverlap?: boolean;
  maxConcurrentAppointments?: number;
  isActive: boolean
}

export interface ServicePayload {
  name: string;
  description?: string;
  durationMinutes: number;
  price?: number;
  category?: string;
  color?: string;
  allowOverlap?: boolean;
  maxConcurrentAppointments?: number;
}

export type ServiceFormValues = {
  name: string;
  durationMinutes: number;
  price?: number | null;
  allowOverlap: boolean;
  maxConcurrentAppointments: number;
};


// BUSINESSES

export type BusinessForm = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  timezone: string;
  isActive: boolean;
};

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type TimeRange = { startTime: string; endTime: string };

export type DaySchedule = {
  enabled: boolean;
  ranges: TimeRange[];
};

export type OpeningHours = Record<DayKey, DaySchedule>;

export type Business = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  timezone: string;
  isActive: boolean;

  appointmentIntervalMin: number;
  openingHours: OpeningHours;
};

export type BusinessPayload = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  timezone: string;
  isActive: boolean;
  appointmentIntervalMin: number;
  openingHours: OpeningHours;
};



// USERS

export interface User {
  _id: string;
  role: string;
  name: string; 
  isBookable:string;
  isActive: string;
  email: string;
  phone: string;
}
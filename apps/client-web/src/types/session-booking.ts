export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface AvailableDate {
  date: string;
  time_slots: TimeSlot[];
}

export interface AvailabilityData {
  coach_id: string;
  location: string;
  available_dates: AvailableDate[];
}

export interface BookSessionData {
  coach: string;
  type: string;
  date: Date;
  time: string;
}

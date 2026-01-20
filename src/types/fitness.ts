export type UserRole = 'partner1' | 'partner2';

export interface User {
  id: UserRole;
  name: string;
  color: string;
}

export interface Workout {
  id: string;
  date: string;
  type: 'run' | 'strength' | 'cross-training' | 'rest';
  title: string;
  duration: number; // in minutes
  distance?: number; // in km
  notes?: string;
  completed: boolean; // deprecated - use completedBy
  completedBy: UserRole[];
  createdBy?: UserRole;
}

export interface MarathonWeek {
  week: number;
  focus: string;
  totalDistance: number;
  workouts: {
    day: string;
    type: string;
    distance?: number;
    description: string;
  }[];
}

export interface WeeklyStats {
  totalWorkouts: number;
  totalDistance: number;
  totalDuration: number;
  completedWorkouts: number;
  partner1Completed?: number;
  partner2Completed?: number;
}

export interface MarathonProgress {
  id: string;
  completedWorkouts: string[];
  lastUpdated: string;
}

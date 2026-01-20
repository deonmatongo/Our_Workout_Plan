export interface Workout {
  id: string;
  date: string;
  type: 'run' | 'strength' | 'cross-training' | 'rest';
  title: string;
  duration: number; // in minutes
  distance?: number; // in km
  notes?: string;
  completed: boolean;
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
}

export type UserRole = 'partner1' | 'partner2';

export interface Workout {
  id: string;
  date: string;
  type: 'run' | 'strength' | 'cross-training' | 'rest';
  title: string;
  duration: number;
  distance?: number;
  notes?: string;
  completed: boolean;
  completedBy: UserRole[];
  createdBy?: UserRole;
}

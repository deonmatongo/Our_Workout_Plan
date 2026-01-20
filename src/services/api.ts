import { Workout } from '@/types/fitness';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const workoutApi = {
  async getAll(): Promise<Workout[]> {
    const response = await fetch(`${API_BASE_URL}/workouts`);
    if (!response.ok) throw new Error('Failed to fetch workouts');
    return response.json();
  },

  async create(workout: Omit<Workout, 'id'>): Promise<Workout> {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    });
    if (!response.ok) throw new Error('Failed to create workout');
    return response.json();
  },

  async update(id: string, updates: Partial<Workout>): Promise<Workout> {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update workout');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete workout');
  },
};

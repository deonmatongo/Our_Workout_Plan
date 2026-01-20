import { useState, useEffect } from 'react';
import { Workout, WeeklyStats } from '@/types/fitness';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { workoutApi } from '@/services/api';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await workoutApi.getAll();
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id'>) => {
    try {
      const newWorkout = await workoutApi.create(workout);
      setWorkouts((prev) => [...prev, newWorkout]);
    } catch (error) {
      console.error('Failed to add workout:', error);
      throw error;
    }
  };

  const updateWorkout = async (id: string, updates: Partial<Workout>) => {
    try {
      const updatedWorkout = await workoutApi.update(id, updates);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === id ? updatedWorkout : w))
      );
    } catch (error) {
      console.error('Failed to update workout:', error);
      throw error;
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await workoutApi.delete(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error('Failed to delete workout:', error);
      throw error;
    }
  };

  const toggleComplete = async (id: string) => {
    const workout = workouts.find((w) => w.id === id);
    if (workout) {
      await updateWorkout(id, { completed: !workout.completed });
    }
  };

  const getWorkoutsForDate = (date: Date): Workout[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return workouts.filter((w) => w.date === dateStr);
  };

  const getWeeklyStats = (date: Date = new Date()): WeeklyStats => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

    const weekWorkouts = workouts.filter((w) => {
      const workoutDate = parseISO(w.date);
      return isWithinInterval(workoutDate, { start: weekStart, end: weekEnd });
    });

    return {
      totalWorkouts: weekWorkouts.length,
      totalDistance: weekWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0),
      totalDuration: weekWorkouts.reduce((sum, w) => sum + w.duration, 0),
      completedWorkouts: weekWorkouts.filter((w) => w.completed).length,
    };
  };

  const getTotalStats = () => {
    return {
      totalWorkouts: workouts.length,
      totalDistance: workouts.reduce((sum, w) => sum + (w.distance || 0), 0),
      totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
      completedWorkouts: workouts.filter((w) => w.completed).length,
    };
  };

  return {
    workouts,
    loading,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    toggleComplete,
    getWorkoutsForDate,
    getWeeklyStats,
    getTotalStats,
  };
};

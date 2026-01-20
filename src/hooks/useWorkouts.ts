import { useState, useEffect } from 'react';
import { Workout, WeeklyStats, UserRole } from '@/types/fitness';
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
      // Ensure completedBy array exists for all workouts
      const normalizedData = data.map(w => ({
        ...w,
        completedBy: w.completedBy || (w.completed ? ['partner1', 'partner2'] : [])
      }));
      setWorkouts(normalizedData);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id'>) => {
    try {
      const newWorkout = await workoutApi.create({
        ...workout,
        completedBy: workout.completedBy || [],
      });
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

  const toggleComplete = async (id: string, user: UserRole) => {
    const workout = workouts.find((w) => w.id === id);
    if (workout) {
      const completedBy = workout.completedBy || [];
      const newCompletedBy = completedBy.includes(user)
        ? completedBy.filter(u => u !== user)
        : [...completedBy, user];
      
      await updateWorkout(id, { 
        completedBy: newCompletedBy,
        completed: newCompletedBy.length > 0 // Keep for backward compatibility
      });
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
      completedWorkouts: weekWorkouts.filter((w) => w.completedBy && w.completedBy.length > 0).length,
      partner1Completed: weekWorkouts.filter((w) => w.completedBy?.includes('partner1')).length,
      partner2Completed: weekWorkouts.filter((w) => w.completedBy?.includes('partner2')).length,
    };
  };

  const getTotalStats = () => {
    return {
      totalWorkouts: workouts.length,
      totalDistance: workouts.reduce((sum, w) => sum + (w.distance || 0), 0),
      totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
      completedWorkouts: workouts.filter((w) => w.completedBy && w.completedBy.length > 0).length,
      partner1Completed: workouts.filter((w) => w.completedBy?.includes('partner1')).length,
      partner2Completed: workouts.filter((w) => w.completedBy?.includes('partner2')).length,
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

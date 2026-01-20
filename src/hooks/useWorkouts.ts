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
      console.log('Loading workouts from Supabase...');
      const data = await workoutApi.getAll();
      console.log('Loaded workouts:', data);
      // Ensure completedBy array exists for all workouts
      const normalizedData = data.map(w => ({
        ...w,
        completedBy: w.completedBy || (w.completed ? ['partner1', 'partner2'] : [])
      }));
      setWorkouts(normalizedData);
      console.log('Workouts normalized and set:', normalizedData.length);
    } catch (error) {
      console.error('Failed to load workouts:', error);
      alert('Failed to load workouts from database. Make sure you have run the SQL schema in Supabase. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id'>) => {
    try {
      console.log('Adding workout:', workout);
      const newWorkout = await workoutApi.create({
        ...workout,
        completedBy: workout.completedBy || [],
      });
      console.log('Workout added successfully:', newWorkout);
      setWorkouts((prev) => [...prev, newWorkout]);
    } catch (error) {
      console.error('Failed to add workout:', error);
      alert('Failed to add workout. Make sure you have run the SQL schema in Supabase. Check console for details.');
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
      console.log('Deleting workout:', id);
      await workoutApi.delete(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      console.log('Workout deleted successfully');
    } catch (error) {
      console.error('Failed to delete workout:', error);
      alert('Failed to delete workout. Check console for details.');
      throw error;
    }
  };

  const toggleComplete = async (id: string, user: UserRole) => {
    console.log('toggleComplete called:', { id, user });
    const workout = workouts.find((w) => w.id === id);
    if (!workout) {
      console.error('Workout not found:', id);
      return;
    }
    
    console.log('Current workout:', workout);
    const completedBy = workout.completedBy || [];
    const newCompletedBy = completedBy.includes(user)
      ? completedBy.filter(u => u !== user)
      : [...completedBy, user];
    
    console.log('Updating completedBy:', { old: completedBy, new: newCompletedBy });
    
    try {
      await updateWorkout(id, { 
        completedBy: newCompletedBy,
        completed: newCompletedBy.length > 0
      });
      console.log('Successfully toggled completion');
    } catch (error) {
      console.error('Failed to toggle completion:', error);
      alert('Failed to mark workout as complete. Make sure you have run the SQL schema in Supabase. Check console for details.');
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

import { useState, useEffect } from 'react';
import { Workout, WeeklyStats } from '@/types/fitness';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

const STORAGE_KEY = 'fitness-workouts';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: crypto.randomUUID(),
    };
    setWorkouts((prev) => [...prev, newWorkout]);
  };

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const toggleComplete = (id: string) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
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
    addWorkout,
    updateWorkout,
    deleteWorkout,
    toggleComplete,
    getWorkoutsForDate,
    getWeeklyStats,
    getTotalStats,
  };
};

import { Workout, MarathonProgress } from '@/types/fitness';
import { supabase } from '@/lib/supabase';

export const workoutApi = {
  async getAll(): Promise<Workout[]> {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch workouts: ${error.message}`);
    
    // Transform snake_case to camelCase
    return (data || []).map(workout => ({
      id: workout.id,
      date: workout.date,
      type: workout.type,
      title: workout.title,
      duration: workout.duration,
      distance: workout.distance,
      notes: workout.notes,
      completed: workout.completed,
      completedBy: workout.completed_by || [],
      createdBy: workout.created_by,
    }));
  },

  async create(workout: Omit<Workout, 'id'>): Promise<Workout> {
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        date: workout.date,
        type: workout.type,
        title: workout.title,
        duration: workout.duration,
        distance: workout.distance,
        notes: workout.notes,
        completed: workout.completed,
        completed_by: workout.completedBy || [],
        created_by: workout.createdBy,
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create workout: ${error.message}`);
    
    return {
      id: data.id,
      date: data.date,
      type: data.type,
      title: data.title,
      duration: data.duration,
      distance: data.distance,
      notes: data.notes,
      completed: data.completed,
      completedBy: data.completed_by || [],
      createdBy: data.created_by,
    };
  },

  async update(id: string, updates: Partial<Workout>): Promise<Workout> {
    const updateData: any = {};
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.duration !== undefined) updateData.duration = updates.duration;
    if (updates.distance !== undefined) updateData.distance = updates.distance;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.completedBy !== undefined) updateData.completed_by = updates.completedBy;
    if (updates.createdBy !== undefined) updateData.created_by = updates.createdBy;

    const { data, error } = await supabase
      .from('workouts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update workout: ${error.message}`);
    
    return {
      id: data.id,
      date: data.date,
      type: data.type,
      title: data.title,
      duration: data.duration,
      distance: data.distance,
      notes: data.notes,
      completed: data.completed,
      completedBy: data.completed_by || [],
      createdBy: data.created_by,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(`Failed to delete workout: ${error.message}`);
  },
};

export const marathonProgressApi = {
  async get(): Promise<MarathonProgress> {
    const { data, error } = await supabase
      .from('marathon_progress')
      .select('*')
      .eq('id', 'default')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch marathon progress: ${error.message}`);
    }
    
    if (!data) {
      // Return default if not found
      return {
        id: 'default',
        completedWorkouts: [],
        lastUpdated: new Date().toISOString(),
      };
    }
    
    return {
      id: data.id,
      completedWorkouts: data.completed_workouts || [],
      lastUpdated: data.last_updated,
    };
  },

  async update(progress: MarathonProgress): Promise<MarathonProgress> {
    const { data, error } = await supabase
      .from('marathon_progress')
      .upsert({
        id: progress.id,
        completed_workouts: progress.completedWorkouts,
        last_updated: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update marathon progress: ${error.message}`);
    
    return {
      id: data.id,
      completedWorkouts: data.completed_workouts || [],
      lastUpdated: data.last_updated,
    };
  },
};

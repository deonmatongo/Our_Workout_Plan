import express, { Request, Response } from 'express';
import { readWorkouts, writeWorkouts } from '../utils/fileStorage';
import { Workout } from '../types/fitness';

export const workoutRouter = express.Router();

workoutRouter.get('/', async (req: Request, res: Response) => {
  try {
    const workouts = await readWorkouts<Workout>();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read workouts' });
  }
});

workoutRouter.post('/', async (req: Request, res: Response) => {
  try {
    const workouts = await readWorkouts<Workout>();
    const newWorkout: Workout = {
      ...req.body,
      id: crypto.randomUUID(),
    };
    workouts.push(newWorkout);
    await writeWorkouts(workouts);
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

workoutRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const workouts = await readWorkouts<Workout>();
    const index = workouts.findIndex((w) => w.id === req.params.id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }
    
    workouts[index] = { ...workouts[index], ...req.body };
    await writeWorkouts(workouts);
    res.json(workouts[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

workoutRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const workouts = await readWorkouts<Workout>();
    const filtered = workouts.filter((w) => w.id !== req.params.id);
    
    if (filtered.length === workouts.length) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }
    
    await writeWorkouts(filtered);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

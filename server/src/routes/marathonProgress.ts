import { Router } from 'express';
import { readFromFile, writeToFile } from '../utils/fileStorage';
import { MarathonProgress } from '../types/fitness';

const router = Router();
const MARATHON_FILE = 'marathonProgress.json';

// Get marathon progress
router.get('/', async (req, res) => {
  try {
    const data = await readFromFile<{ progress: MarathonProgress }>(MARATHON_FILE);
    res.json(data.progress || { id: 'default', completedWorkouts: [], lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read marathon progress' });
  }
});

// Update marathon progress
router.put('/', async (req, res) => {
  try {
    const progress: MarathonProgress = {
      ...req.body,
      lastUpdated: new Date().toISOString(),
    };
    
    await writeToFile(MARATHON_FILE, { progress });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update marathon progress' });
  }
});

export default router;

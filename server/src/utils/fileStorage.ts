import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const WORKOUTS_FILE = path.join(DATA_DIR, 'workouts.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function ensureFile(filePath: string, defaultData: any = []) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
  }
}

export async function readWorkouts<T>(): Promise<T[]> {
  await ensureDataDir();
  await ensureFile(WORKOUTS_FILE);
  
  const data = await fs.readFile(WORKOUTS_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function writeWorkouts<T>(workouts: T[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(WORKOUTS_FILE, JSON.stringify(workouts, null, 2));
}

// Generic file storage functions
export async function readFromFile<T>(filename: string, defaultData: T = {} as T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await ensureFile(filePath, defaultData);
  
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function writeToFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

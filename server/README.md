# Our_Workout_Plan Backend Server API

Backend server for Our_Workout_Plan that stores workout data in JSON files.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create a new workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout

## Data Storage

All workout data is stored in `server/data/workouts.json`. This file is automatically created when the server starts.

## Production

Build and run:
```bash
npm run build
npm start
```

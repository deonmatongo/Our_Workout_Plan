# Marathon Muse

A marathon training calendar app with workout tracking.

## Project Structure

This project consists of two parts:
- **Frontend**: React + Vite + TypeScript app (root directory)
- **Backend**: Express API with JSON file storage (server directory)

## Setup

### Backend Setup

1. Navigate to the server directory and install dependencies:
```sh
cd server
npm install
```

2. Start the backend server:
```sh
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate back to the root directory and install dependencies:
```sh
cd ..
npm install
```

2. Create a `.env` file (or use the existing one):
```sh
VITE_API_URL=http://localhost:3001/api
```

3. Start the frontend development server:
```sh
npm run dev
```

The frontend will run on `http://localhost:5173`

## Running the Full Application

You need to run both the backend and frontend servers:

**Terminal 1 - Backend:**
```sh
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```sh
npm run dev
```

## Technologies

This project is built with:

**Frontend:**
- React
- TypeScript
- Vite
- shadcn-ui
- Tailwind CSS
- date-fns

**Backend:**
- Node.js
- Express
- TypeScript
- JSON file storage

## Features

- 📅 Interactive calendar view
- 🏃 Workout tracking (runs, strength training, cross-training, rest days)
- 📊 Weekly and total statistics
- ✅ Mark workouts as completed
- 💾 Persistent data storage in JSON files
- 🎨 Modern, responsive UI

## Data Storage

All workout data is stored in `server/data/workouts.json`. This file is automatically created when the backend server starts for the first time.

## Development

The application uses a client-server architecture:
- Frontend communicates with backend via REST API
- Backend persists data to JSON files
- CORS enabled for local development

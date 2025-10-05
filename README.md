# Travel PWA

A collaborative travel planning Progressive Web App built with React 19 and Firebase for real-time 2-user collaboration.

## Features

- Google Sign-In authentication
- 2-user real-time collaboration
- Flight comparison and voting system
- Daily itinerary planning
- 6-character invite code sharing (24-hour expiration)
- PWA support with offline capabilities
- Automatic update notifications

## Tech Stack

- Frontend: React 19, CSS3
- Backend: Firebase Realtime Database
- Authentication: Firebase Authentication (Google Sign-In)
- Hosting: Firebase Hosting
- PWA: Workbox Service Worker

## Setup

### Install Dependencies

```bash
npm install
```

### Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Google Sign-In) and Realtime Database
3. Copy `.env.example` to `.env` and fill in your Firebase credentials

## Development

```bash
# Start development server (default port 3000)
npm start

# Custom port
PORT=5175 npm start
```

## Build and Deploy

```bash
# Build production
npm run build

# Deploy to Firebase
firebase deploy
```

## Project Structure

```
src/
├── components/          # React components
│   ├── App.js          # Main app orchestrator
│   ├── Login.js        # Google Sign-In UI
│   ├── PlanSelection.js # Plan creation/join UI
│   ├── common/         # Reusable UI components
│   ├── flights/        # Flight booking components
│   ├── dailyPlan/      # Daily planning components
│   └── tabs/           # Tab page components
├── styles/             # CSS stylesheets
├── contexts/           # React Context (AuthContext)
├── config/             # Firebase configuration
├── constants/          # App-wide constants
└── utils/              # Utility functions
```

## Database Structure

```
travelPlans/
  {planId}/
    ownerUid: string
    users: { [uid]: true }
    startDate: string
    endDate: string
    flights: { [id]: {...} }
    locations: { [day]: [...] }

invites/
  {code}/
    planId: string
    status: "pending" | "used"
    expiresAt: number

users/
  {uid}/
    planId: string
```

## License

Private Project

# Track App Web Frontend

React web application for GPS tracking system.

## Tech Stack

- React 19 + TypeScript
- Vite 5.4
- Axios for API calls

## Setup

Install dependencies:
```bash
npm install
```

## Run

Development mode:
```bash
npm run dev
```

App runs at: `http://localhost:5173`

Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   └── TestAPI.tsx      # API testing component
├── lib/
│   └── request.ts       # Axios HTTP client
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## API Configuration

Backend API URL is configured in `src/lib/request.ts`:
- Default: `http://localhost:8000/api`
- Override with: `VITE_API_BASE_URL` environment variable

## Features

- Hot Module Replacement (HMR)
- TypeScript support
- API integration with backend
- Responsive design

## Notes

- Vite version downgraded to 5.4.0 for Node.js 20.18.1 compatibility
- Uses `--host` flag for network accessibility

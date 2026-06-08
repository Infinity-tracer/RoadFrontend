# RoadPulse Frontend

Modern React frontend for the RoadPulse road safety platform.

## Features

- Pitch-level professional UI design
- Side-by-side video/image comparison
- Interactive slider comparison view
- Three processing modules:
  - Road Damage Detection
  - Privacy Blur
  - Combined Analysis
- Responsive design
- Dark theme optimized

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

## Deployment to Vercel

1. Push to GitHub
2. Import to Vercel
3. Deploy (auto-configured)

Update `API_BASE` in `src/App.jsx` with your backend URL:
```javascript
const API_BASE = 'https://your-api.onrender.com';
```

## Stack

- React 18
- Vite
- TailwindCSS
- Framer Motion
- Lucide Icons

## Environment

For local development with backend:
```bash
# Backend running at localhost:8000
npm run dev
```

Vite proxy handles `/api` and `/outputs` routes automatically.

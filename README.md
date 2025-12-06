# EchoMed Africa - Frontend

React + TypeScript + Vite frontend for the EchoMed telemedicine platform.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: Context API
- **API Client**: Axios
- **Real-time**: Socket.io Client
- **Authentication**: Supabase Auth

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json
```

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment variables**:

   - Copy `.env.example` to `.env`
   - Update `VITE_API_URL` with your backend URL
   - Update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your Supabase credentials

3. **Run development server**:

   ```bash
   npm run dev
   ```

   Opens at `http://localhost:5173`

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Vercel Deployment

1. **Install Vercel CLI** (optional):

   ```bash
   npm install -g vercel
   ```

2. **Build the project**:

   ```bash
   npm run build
   ```

3. **Deploy to Vercel**:

   - Push your code to GitHub
   - Go to [Vercel](https://vercel.com) and import your repository
   - Set environment variables in Vercel project settings:
     - `VITE_API_URL`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy!

   Or use the CLI:

   ```bash
   vercel
   ```

## Features

### Patient Features

- User registration and authentication
- Find and book doctors
- Video consultations
- Prescription management
- Chat with doctors

### Doctor Features

- Doctor registration with specialization
- Manage availability
- Accept/reject consultations
- Video consultations
- Prescribe medication
- Patient chat

### Admin Features

- Platform statistics
- User management
- System monitoring

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

ISC

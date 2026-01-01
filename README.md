# SmartSupport Frontend

A modern Next.js 14+ frontend application for the SmartSupport AI-powered ticket classification system, optimized for Vercel deployment.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** TanStack Query (React Query) v5
- **HTTP Client:** Axios
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running locally at `http://localhost:8000` (or configure `NEXT_PUBLIC_API_URL`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Configure your backend URL and API key in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=your-api-key-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (redirects to dashboard)
│   ├── providers.tsx      # TanStack Query provider
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configurations
│   ├── api/              # API client functions
│   ├── axios.ts          # Axios instance
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
│   └── api.ts            # API types (mirroring backend schemas)
└── public/               # Static assets
```

## API Configuration

The frontend communicates with the FastAPI backend through:

- **Development:** Uses `NEXT_PUBLIC_API_URL` from `.env.local`
- **Production:** Update `NEXT_PUBLIC_API_URL` in Vercel environment variables

API requests are proxied through Next.js rewrites (`/api/python/*`) to avoid CORS issues during development.

## Building for Production

```bash
npm run build
```

The build output is optimized for Vercel's serverless platform. Ensure all TypeScript errors are resolved before deploying.

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import the project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository

3. Configure environment variables in Vercel:
   - `NEXT_PUBLIC_API_URL`: Your production backend URL
   - `NEXT_PUBLIC_API_KEY`: Your API key for backend authentication

4. Deploy! Vercel will automatically:
   - Detect Next.js framework
   - Run `npm run build`
   - Deploy to production

### Vercel Configuration

The project includes a `vercel.json` file with:
- CORS headers for API routes
- Build and install commands
- Regional deployment settings

## Development Notes

- All components use TypeScript strict mode
- API types mirror the FastAPI Pydantic models for type safety
- TanStack Query handles async state management and caching
- Loading states and Suspense boundaries are implemented for better UX with slow ML backend responses
- Multi-language support (TR/EN) with localStorage persistence

## Security

⚠️ **Important:** Never commit `.env` or `.env.local` files to Git. These files contain sensitive API keys and are automatically ignored by `.gitignore`.

## License

Private - SmartSupport Global

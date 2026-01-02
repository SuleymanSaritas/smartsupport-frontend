# SmartSupport Frontend Dashboard

A modern, responsive, and production-ready web dashboard for the **SmartSupport AI System**. Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, this interface provides real-time interaction with the NLP backend, visualizing ticket classifications, PII masking, and confidence scores.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38b2ac) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ed)

## ✨ Features

- **🤖 Interactive AI Analysis**: Submit support tickets and receive instant classification results via a clean, accessible UI.
- **🔄 Real-time Polling**: Implements intelligent polling mechanisms to handle asynchronous backend processing (Celery tasks) seamlessly.
- **📊 Probability Visualization**: Displays "Top 3" intent predictions with confidence bars and percentages, parsing complex JSON data from the backend.
- **🌍 Multi-lingual Support**: Full support for **English** and **Turkish** interfaces, with persistent language preference stored in local storage.
- **🛡️ PII Masking Display**: Visualizes how sensitive data (Credit Cards, Phones, Emails) is sanitized by the backend before processing.
- **📱 Responsive Design**: Fully responsive UI built with **Shadcn UI** and **Tailwind CSS**, optimized for both desktop and mobile.
- **⚡ Optimistic UI**: Uses **React Query** for efficient caching, background updates, and smooth data fetching without page reloads.

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
- **State Management & Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Containerization**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- SmartSupport Backend API running (usually on port 8000)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/smartsupport-frontend.git
cd smartsupport-frontend
npm install

### 2. Environment Variables

Create a `.env.local` file in the root directory to configure the API connection. You can use the provided example file:

```bash
cp .env.local.example .env.local

```

**Environment Variables Reference:**

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL of the running Python Backend API |

### 3. Running Locally

Start the development server:

```bash
npm run dev

```

Visit `http://localhost:3000` in your browser.

---

## 🐳 Running with Docker

This project is fully containerized and can be orchestrated alongside the backend using Docker Compose.

### Build and Run Standalone

To build the image and run it connecting to a backend on the host machine:

```bash
# Build the image
docker build -t smartsupport-frontend .

# Run the container (Connects to host backend)
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://host.docker.internal:8000 smartsupport-frontend

```

### Using Docker Compose

If running as part of the full stack (Frontend + Backend), use the `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

```

## 📂 Project Structure

```bash
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard views
│   │   ├── page.tsx        # Dashboard aggregation page
│   │   ├── loading.tsx     # Suspense loading states
│   │   └── error.tsx       # Error boundaries
│   ├── layout.tsx          # Root layout & providers
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Dashboard specific components
│   │   ├── create-ticket-form.tsx  # Ticket submission & polling logic
│   │   ├── ticket-history-list.tsx # History visualization & intent badges
│   │   ├── ml-results-dialog.tsx   # Detailed analysis modal
│   │   └── language-switcher.tsx   # i18n toggle component
│   └── ui/                 # Reusable UI components (Shadcn)
├── lib/
│   ├── api/                # API integration layers
│   │   ├── tickets.ts      # Ticket endpoints & status polling
│   │   └── dashboard.ts    # Dashboard stats fetching
│   └── translations.ts     # i18n dictionaries (EN/TR)
├── contexts/               # React Contexts (Language, etc.)
└── hooks/                  # Custom React Hooks (use-toast, etc.)

```

## 🧩 Key Components

### Ticket Creation & Polling (`create-ticket-form.tsx`)

Handles the submission of raw text support tickets. It initiates a robust polling loop (`pollTicketStatus`) that checks the backend task status every 2 seconds until the Celery worker completes the heavy NLP inference, handling timeouts and errors gracefully.

### History & Visualization (`ticket-history-list.tsx`)

Renders the list of processed tickets. It parses the `prediction_details` JSON to visualize the confidence distribution among the top 3 predicted intents using progress bars. It also dynamically adapts the UI based on the selected language.

### Internationalization (`language-context.tsx`)

A lightweight, context-based i18n solution that allows instant language switching between English and Turkish without page reloads. It persists the user's preference in LocalStorage to maintain consistency across sessions.

# SmartSupport Frontend Dashboard A modern, responsive, and production-ready web dashboard for the **SmartSupport AI System**. Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, this interface provides real-time interaction with the NLP backend, visualizing ticket classifications, PII masking, and confidence scores. ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38b2ac) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ed) --- ## ✨ Features * **🤖 Interactive AI Analysis**: Submit support tickets and receive instant classification results via a clean, accessible UI. * **🔄 Real-time Polling**: Implements intelligent polling mechanisms to handle asynchronous backend processing (Celery tasks) seamlessly. * **📊 Probability Visualization**: Displays "Top 3" intent predictions with confidence bars and percentages, parsing complex JSON data from the backend. * **🌍 Multi-lingual Support**: Full support for **English** and **Turkish** interfaces, with persistent language preference stored in local storage. * **🛡️ PII Masking Display**: Visualizes how sensitive data (Credit Cards, Phones, Emails) is sanitized by the backend before processing. * **📱 Responsive Design**: Fully responsive UI built with **Shadcn UI** and **Tailwind CSS**, optimized for both desktop and mobile. * **⚡ Optimistic UI**: Uses **React Query** for efficient caching, background updates, and smooth data fetching without page reloads. --- ## 🛠 Tech Stack * **Framework**: [Next.js 14](https://nextjs.org/) (App Router) * **Language**: [TypeScript](https://www.typescriptlang.org/) * **Styling**: [Tailwind CSS](https://tailwindcss.com/) * **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives) * **State Management & Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest) * **HTTP Client**: [Axios](https://axios-http.com/) * **Icons**: [Lucide React](https://lucide.dev/) * **Containerization**: Docker & Docker Compose --- ## 🚀 Getting Started ### Prerequisites * Node.js 18+ * SmartSupport Backend API running (usually on port 8000) ### 1. Installation
bash
git clone https://github.com/yourusername/smartsupport-frontend.git
cd smartsupport-frontend
npm install
### 2. Environment Variables Create a .env.local file in the root directory:
bash
cp .env.local.example .env.local
**Environment Variables Reference** | Variable | Default | Description | | --------------------- | ----------------------- | ------------------------------------- | | NEXT_PUBLIC_API_URL | http://localhost:8000 | URL of the running Python Backend API | ### 3. Running Locally
bash
npm run dev
Visit: http://localhost:3000 --- ## 🐳 Running with Docker ### Build and Run Standalone
bash
docker build -t smartsupport-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://host.docker.internal:8000 \
  smartsupport-frontend
### Using Docker Compose
yaml
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
--- ## 📂 Project Structure
bash
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── create-ticket-form.tsx
│   │   ├── ticket-history-list.tsx
│   │   ├── ml-results-dialog.tsx
│   │   └── language-switcher.tsx
│   └── ui/
├── lib/
│   ├── api/
│   │   ├── tickets.ts
│   │   └── dashboard.ts
│   └── translations.ts
├── contexts/
└── hooks/
--- ## 🧩 Key Components ### Ticket Creation & Polling (create-ticket-form.tsx) Handles submission of raw support tickets and manages a polling loop that checks backend task status every 2 seconds until Celery completes NLP inference. Includes timeout and error handling. ### History & Visualization (ticket-history-list.tsx) Displays processed tickets and visualizes confidence distributions of top-3 intent predictions using progress bars. Fully language-aware. ### Internationalization (language-context.tsx) Context-based i18n system enabling instant EN/TR switching without reload. User preference is persisted in LocalStorage.
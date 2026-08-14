# EchoMail Frontend

React + Vite + TanStack Router frontend for the **EchoMail** email marketing platform.

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** — build tooling
- **TanStack Router** — file-based routing
- **TanStack React Query** — server state management
- **Tailwind CSS 4** — styling
- **Framer Motion** — animations
- **Zustand** — client state (auth, theme)
- **BlockNote** — rich-text email editor
- **Recharts** — dashboard analytics charts
- **Lucide React** — icons
- **Axios** — HTTP client
- **Zod** — schema validation
- **react-hot-toast** — notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Install

```bash
npm install
```

### Environment

Copy `.env.example` or create a `.env` file:

```bash
VITE_API_URL=https://your-domain.com/echomail/api/v1
```

For local development with the Laravel backend running on `localhost:8000`:

```
VITE_API_URL=http://localhost:8000/api/v1
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build

```bash
npm run build
```

Output goes to `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/         # Shared UI components
│   ├── AuthContainer.tsx   # Login/register layout wrapper
│   ├── Editor.tsx          # BlockNote rich-text editor
│   ├── LoadingScreen.tsx   # Global loading spinner
│   ├── Logo.tsx            # EchoMail logo component
│   ├── Sidebar.tsx         # Dashboard sidebar navigation
│   ├── ThemeToggle.tsx     # Dark/light mode toggle
│   └── Topbar.tsx          # Dashboard top bar
├── constants/
│   └── brand.ts            # Brand config (colors, contact, socials)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (axios instance, etc.)
├── pages/
│   ├── Welcome.tsx         # Public landing page
│   ├── JoinNewsletter.tsx  # Subscriber signup page
│   ├── auth/               # Login / Register
│   └── dashboard/          # Admin dashboard pages
│       ├── Dashboard.tsx       # Overview + analytics
│       ├── Campaigns.tsx       # Campaign list
│       ├── CreateCampaigns.tsx # Campaign builder
│       ├── Contacts.tsx        # Subscriber management
│       ├── Newsletters.tsx     # Newsletter management
│       ├── Templates.tsx       # Email templates
│       └── Settings.tsx        # Account settings
├── routes/             # TanStack Router file-based routes
├── services/           # API service functions
├── stores/             # Zustand stores (auth, theme)
├── types/              # TypeScript type definitions
├── utils/              # Helpers (theme, cn, etc.)
├── App.tsx
└── main.tsx
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login` | Admin login |
| `/register` | Admin registration |
| `/join-newsletters` | Public newsletter signup |
| `/dashboard` | Admin dashboard overview |
| `/dashboard/campaigns` | Campaign list |
| `/dashboard/create-campaigns` | Create / edit campaigns |
| `/dashboard/contacts` | Subscriber management |
| `/dashboard/newsletters` | Newsletter management |
| `/dashboard/templates` | Email templates |
| `/dashboard/settings` | Account settings |

## Features

- **Campaign Builder** — Create and schedule email campaigns with a rich-text editor
- **Send Modes** — Send immediately or schedule for later
- **Subscriber Management** — Import, export, and manage contacts with double opt-in
- **Newsletter Signup** — Public-facing subscriber registration page
- **Email Templates** — Reusable templates for campaigns
- **Analytics Dashboard** — Open rates, click tracking, and campaign performance charts
- **Dark Mode** — Full dark/light theme support with persistence
- **Responsive Design** — Mobile-friendly layout across all pages
- **Rich-Text Editor** — BlockNote-powered email content editor

## Deployment

This frontend is deployed on **Vercel** with automatic builds from the `main` branch.

Set the `VITE_API_URL` environment variable in the Vercel project settings to point to your backend API.

## License

Private — EchoMail

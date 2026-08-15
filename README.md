# EchoMail - Email Marketing Platform

A full-stack email marketing platform with campaign management, subscriber automation, A/B testing, analytics, and a modern dashboard.

## Tech Stack

### Frontend (`LevelUp/`)
- **React 19** + TypeScript
- **Vite 7** - build tooling
- **TanStack Router** - file-based routing
- **TanStack React Query v5** - server state
- **Tailwind CSS 4** - styling
- **Framer Motion** - animations
- **Zustand** - client state (auth, theme)
- **BlockNote** - rich-text email editor
- **Recharts** - dashboard charts
- **Lucide React** - icons
- **Axios** - HTTP client
- **react-hot-toast** - notifications

### Backend (`EchoMail_be/`)
- **Laravel 11** (PHP 8.3)
- **SQLite** (default) / MySQL
- **Laravel Sanctum** - API authentication
- **Laravel Queue** - email job processing
- **BlockNote JSON** - email content format

## Getting Started

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer

### Frontend Setup
```bash
cd LevelUp
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev             # http://localhost:5173
```

### Backend Setup
```bash
cd EchoMail_be
composer install
cp .env.example .env    # configure DB, MAIL, TICK_TOKEN
php artisan key:generate
php artisan migrate --seed
php artisan serve       # http://localhost:8000
```

### Seed Data
```bash
php artisan migrate:fresh --seed
```

**Demo Login:**
- Email: `demo@echomail.com`
- Password: `Demo@12345`

**Admin Login:**
- Email: `admin@admin.com`
- Password: `Admin@12345`

## Features

### Campaign Management
- Create campaigns with rich-text BlockNote editor
- Send immediately or schedule for later (one-time, daily, weekly, monthly)
- Recipient selection: All contacts, Newsletter subscribers, Contact groups, Manual email list
- Live recipient count preview
- Template loading from saved templates
- Campaign duplication
- Test send to verify before launching

### Email Preview
- **Gmail** preview with authentic Google UI (red M logo, Primary/Updates/Promotions tabs, star/archive buttons)
- **Outlook** preview with Microsoft UI (blue header bar, ribbon toolbar, Segoe UI font)
- **Apple Mail** preview with macOS UI (SF Pro font, traffic light dots, blue action buttons)
- **Mobile** preview with iPhone Mail app UI (status bar, home indicator)
- **All Clients** grid view showing all 3 desktop clients side by side

### A/B Testing
- Create 2-4 variants for subject lines or email content
- Set test percentage (10-50% of recipients)
- Select a winner manually after results
- Winner automatically updates the campaign

### Analytics Dashboard
- **Monthly Activity** - bar chart showing sent/opens/clicks over 6 months
- **Campaign Status** - pie chart (sent/draft/failed)
- **Engagement Funnel** - visual funnel with animated progress bars (Sent -> Opened -> Clicked)
- **Recent Campaigns** - table with per-campaign performance metrics (open rate, click rate)
- Key metrics cards: Total Campaigns, Emails Sent, Avg Open Rate, Avg Click Rate

### Automation Workflows
- Create drip campaigns with step-based workflows
- Step types: Wait, Send Email, Add Tag, Condition, End
- Triggers: Subscriber Joins, Manual Enroll, Date Based
- Activate/pause automations
- Enroll subscribers manually
- Track enrollment progress

### Subscriber Management
- **Contacts** - CRUD, search, filter by group/source, bulk delete, CSV import/export
- **Newsletter Subscribers** - double opt-in, status tracking (active/pending/unsubscribed)
- **Contact Groups** - create groups with colors, assign contacts to groups
- **CSV Import** - drag-drop upload with preview, group assignment, template download

### Unsubscribe
- Branded unsubscribe page at `/unsubscribe/{token}`
- Backend redirect from email links to frontend page
- Animated confirmation with re-subscribe prompt

### Email Templates
- Create, edit, delete reusable templates
- Personalization variables: `{{first_name}}`, `{{last_name}}`, `{{full_name}}`
- Load templates into campaign editor

### Settings
- Profile management
- Password change
- Two-factor authentication (2FA)
- Webhook management (CRUD, test ping, delivery logs)

### UI/UX
- Full **dark mode** with system preference detection
- Responsive design (mobile + desktop)
- Collapsible sidebar
- Animated page transitions
- Toast notifications

## Project Structure

```
LevelUp/
├── src/
│   ├── components/
│   │   ├── AbTestModal.tsx          # A/B test creation modal
│   │   ├── AuthContainer.tsx        # Login/register layout
│   │   ├── EmailPreview.tsx         # Gmail/Outlook/Apple Mail preview
│   │   ├── Editor.tsx               # BlockNote rich-text editor
│   │   ├── Logo.tsx                 # EchoMail logo
│   │   ├── Sidebar.tsx              # Dashboard navigation
│   │   ├── ThemeToggle.tsx          # Dark/light toggle
│   │   └── Topbar.tsx               # Dashboard header
│   ├── constants/
│   │   ├── brand.ts                 # Brand config
│   │   ├── campaign.ts              # Campaign options
│   │   ├── contact.ts               # Contact options
│   │   └── newsletter.ts            # Newsletter options
│   ├── hooks/
│   │   ├── useAbTests.ts            # A/B test hooks
│   │   ├── useAutomations.ts        # Automation hooks
│   │   ├── useAuth.ts               # Auth hooks
│   │   ├── useCampaigns.ts          # Campaign hooks
│   │   ├── useContacts.ts           # Contact hooks
│   │   ├── useNewsletter.ts         # Newsletter hooks
│   │   └── useTemplates.ts          # Template hooks
│   ├── pages/
│   │   ├── Welcome.tsx              # Landing page
│   │   ├── JoinNewsletter.tsx       # Public signup
│   │   ├── Unsubscribe.tsx          # Unsubscribe page
│   │   ├── auth/                    # Login, OTP, 2FA, etc.
│   │   └── dashboard/
│   │       ├── Analytics.tsx        # Analytics dashboard
│   │       ├── Automations.tsx      # Automation management
│   │       ├── Campaigns.tsx        # Campaign list
│   │       ├── Contacts.tsx         # Contact management
│   │       ├── CreateCampaigns.tsx  # Campaign builder
│   │       ├── Dashboard.tsx        # Overview dashboard
│   │       ├── Newsletters.tsx      # Subscriber management
│   │       ├── Settings.tsx         # Account settings
│   │       └── Templates.tsx        # Email templates
│   ├── services/api/                # API service functions
│   ├── stores/                      # Zustand stores
│   ├── types/                       # TypeScript types
│   └── utils/                       # Helpers
└── index.html                       # Meta tags, favicons, structured data

EchoMail_be/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AutomationController.php
│   │   ├── CampaignAbTestController.php
│   │   ├── CampaignController.php
│   │   ├── ContactController.php
│   │   ├── NewsletterController.php
│   │   └── ...
│   ├── Mail/                        # Mailable classes
│   ├── Models/
│   │   ├── Automation.php
│   │   ├── AutomationStep.php
│   │   ├── AutomationEnrollment.php
│   │   ├── CampaignAbTest.php
│   │   ├── CampaignAbVariant.php
│   │   ├── Campaign.php
│   │   ├── CampaignRecipient.php
│   │   ├── Contact.php
│   │   ├── NewsletterSubscriber.php
│   │   └── ...
│   └── Console/Commands/
│       ├── DispatchScheduledCampaigns.php
│       └── SendWeeklySummary.php
├── database/
│   ├── migrations/                  # All database migrations
│   └── seeders/
│       ├── AdminUserSeeder.php
│       ├── CampaignTemplateSeeder.php
│       ├── DemoSeeder.php           # Full demo data
│       ├── AutomationSeeder.php     # Automation workflows
│       └── AnalyticsSeeder.php      # Rich analytics data
├── resources/views/emails/          # Email Blade templates
├── routes/
│   ├── api.php                      # API routes
│   └── web.php                      # Web routes (tracking, unsubscribe)
└── config/app.php                   # tick_token, frontend_url
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login` | Admin login |
| `/join-newsletters` | Public newsletter signup |
| `/unsubscribe/{token}` | Unsubscribe page |
| `/dashboard` | Dashboard overview |
| `/analytics` | Campaign analytics |
| `/campaigns` | Campaign list |
| `/create-campaigns` | Campaign builder |
| `/contacts` | Contact management |
| `/automations` | Automation workflows |
| `/templates` | Email templates |
| `/newsletters` | Subscriber management |
| `/settings` | Account settings |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/login` | Login |
| POST | `/api/v1/logout` | Logout |
| GET | `/api/v1/profile` | Get profile |
| PUT | `/api/v1/profile` | Update profile |
| POST | `/api/v1/change-password` | Change password |
| POST | `/api/v1/toggle-two-factor` | Toggle 2FA |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/campaigns` | List campaigns |
| POST | `/api/v1/campaigns` | Create campaign |
| GET | `/api/v1/campaigns/stats` | Campaign statistics |
| POST | `/api/v1/campaigns/{uuid}/send` | Send campaign |
| POST | `/api/v1/campaigns/{uuid}/retry` | Retry failed |
| POST | `/api/v1/campaigns/{uuid}/duplicate` | Duplicate campaign |
| GET | `/api/v1/campaigns/{uuid}/recipients` | List recipients |
| GET | `/api/v1/campaigns/{uuid}/export` | Export recipients CSV |

### A/B Testing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/campaigns/{uuid}/ab-tests` | List A/B tests |
| POST | `/api/v1/campaigns/{uuid}/ab-tests` | Create A/B test |
| POST | `/api/v1/campaigns/{uuid}/ab-tests/{id}/start` | Start test |
| POST | `/api/v1/campaigns/{uuid}/ab-tests/{id}/select-winner` | Select winner |

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/contacts` | List contacts |
| POST | `/api/v1/contacts` | Create contact |
| POST | `/api/v1/contacts/import-csv` | Import CSV |
| GET | `/api/v1/contacts/export` | Export contacts |
| GET | `/api/v1/contacts/groups` | List groups |
| POST | `/api/v1/contacts/groups` | Create group |

### Newsletter
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/newsletter/subscribe` | Subscribe (public) |
| GET | `/api/v1/newsletter/unsubscribe/{token}` | Unsubscribe |
| GET | `/api/v1/newsletter/subscribers` | List subscribers |
| GET | `/api/v1/newsletter/stats` | Newsletter stats |

### Automations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/automations` | List automations |
| POST | `/api/v1/automations` | Create automation |
| GET | `/api/v1/automations/stats` | Automation stats |
| POST | `/api/v1/automations/{uuid}/activate` | Activate |
| POST | `/api/v1/automations/{uuid}/pause` | Pause |
| POST | `/api/v1/automations/{uuid}/enroll` | Enroll subscriber |

### Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/templates` | List templates |
| POST | `/api/v1/templates` | Create template |
| PUT | `/api/v1/templates/{uuid}` | Update template |
| DELETE | `/api/v1/templates/{uuid}` | Delete template |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/webhooks` | List webhooks |
| POST | `/api/v1/webhooks` | Create webhook |
| POST | `/api/v1/webhooks/{id}/test` | Test webhook |
| GET | `/api/v1/webhooks/{id}/deliveries` | Delivery logs |

## Email Tracking

- **Open Tracking** - 1x1 transparent GIF pixel inserted in email footer
- **Click Tracking** - all `<a>` links wrapped with redirect URL
- Per-recipient timestamps for opens and clicks
- Aggregate stats synced to campaign record

## Deployment

### Frontend (Vercel)
- Auto-deploys from `main` branch
- Set `VITE_API_URL` in Vercel environment variables

### Backend (Shared Hosting)
```bash
git pull origin main
php artisan migrate
php artisan view:clear
php artisan config:clear
```

### Cron Job
Set up external cron (e.g., cron-job.org) to hit every minute:
```
https://your-domain.com/echomail/tick/98bab8d038d7e0526870652cd2eac28644c9c8c7
```

## Seeders

| Seeder | Description |
|--------|-------------|
| `AdminUserSeeder` | Creates admin user (admin@admin.com) |
| `CampaignTemplateSeeder` | Creates email templates |
| `DemoSeeder` | Full demo data: 18 contacts, 6 groups, 12 subscribers, 8 campaigns, webhooks, audit logs |
| `AutomationSeeder` | 3 automation workflows with steps and enrollments |
| `AnalyticsSeeder` | Rich analytics data: 10 campaigns with realistic open/click patterns |

## License

Private - EchoMail

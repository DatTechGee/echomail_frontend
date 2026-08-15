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

---

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

---

## User Guide - How to Use Every Feature

### 1. Dashboard Overview (`/dashboard`)

After logging in, you land on the **Dashboard** which shows:
- **Total Campaigns** - count of all campaigns
- **Emails Sent** - total emails delivered
- **Avg Open Rate** - average open rate across campaigns
- **Avg Click Rate** - average click rate across campaigns
- **Campaign Activity** - bar chart of sent/opens/clicks over time
- **Recent Campaigns** - table of latest campaigns with performance

---

### 2. Creating a Campaign (`/create-campaigns`)

**Step 1: Name Your Campaign**
- Enter a campaign name in the top input field (e.g., "Summer Sale 2025")

**Step 2: Compose Your Email**
- Use the **BlockNote rich-text editor** to write your email
- Format with bold, italic, headings, lists, links, images
- **Personalization variables** available:
  - `{{first_name}}` - subscriber's first name
  - `{{last_name}}` - subscriber's last name
  - `{{full_name}}` - subscriber's full name

**Step 3: Set the Subject Line**
- Enter your email subject line
- Use personalization: `"Hey {{first_name}}, check this out!"`

**Step 4: Choose Recipients**
Pick who receives the campaign:
| Option | Description |
|--------|-------------|
| All Contacts | Send to every contact in your database |
| Newsletter Subscribers | Send to active newsletter subscribers |
| Contact Groups | Select one or more specific groups |
| Manual List | Enter email addresses manually (comma-separated) |

The **live recipient count** updates as you select options.

**Step 5: Preview Your Email**
- Click the **Preview** button to see how your email looks
- Switch between **Gmail**, **Outlook**, **Apple Mail**, and **Mobile** views
- Use the **All Clients** grid to compare all views at once

**Step 6: Schedule or Send**
| Option | Description |
|--------|-------------|
| Send Now | Delivers immediately |
| Schedule | Pick a date and time for future delivery |
| Recurring | Set daily, weekly, or monthly recurring sends |

**Step 7: A/B Test (Optional)**
- Click the **A/B Test** button in the campaign builder
- Choose test type: **Subject Line** or **Email Content**
- Create 2-4 variants
- Set test percentage (10-50% of recipients get the test)
- After results, select a winner - the campaign auto-updates

**Step 8: Send a Test**
- Use **Send Test** to send a preview email to yourself before launching

---

### 3. Managing Campaigns (`/campaigns`)

The campaigns list shows all your campaigns with:
- **Status** (Draft, Sent, Scheduled, Failed)
- **Open Rate** and **Click Rate**
- **Actions** for each campaign:

| Action | What It Does |
|--------|-------------|
| View | See campaign details and recipient stats |
| Send | Launch a draft campaign |
| Duplicate | Clone a campaign to reuse its content |
| Retry | Resend a failed campaign |
| Delete | Remove the campaign |
| Export | Download recipients as CSV |

---

### 4. Analytics (`/analytics`)

The analytics page provides deep insights:

**Key Metrics Cards:**
- Total Campaigns, Emails Sent, Avg Open Rate, Avg Click Rate

**Monthly Activity Chart:**
- Bar chart showing sent, opens, and clicks for the last 6 months

**Campaign Status Pie Chart:**
- Visual breakdown of Sent, Draft, Scheduled, and Failed campaigns

**Engagement Funnel:**
- Visual funnel: **Sent** -> **Opened** -> **Clicked**
- Shows conversion rates at each stage
- Animated progress bars

**Recent Campaigns Table:**
- Per-campaign performance: recipients, opens, clicks, open rate, click rate
- Sortable columns

---

### 5. Automation Workflows (`/automations`)

Automations let you create **drip campaigns** - automated email sequences triggered by subscriber actions.

#### Creating an Automation

**Step 1: Click "New Automation"**

**Step 2: Fill in the Details**
| Field | Description |
|-------|-------------|
| Name | Give your automation a name (e.g., "Welcome Series") |
| Description | Optional description of what it does |
| Trigger | When the automation starts |

**Available Triggers:**
| Trigger | When It Fires |
|---------|--------------|
| Subscriber Joins | When a new subscriber joins your list |
| Manual Enroll | You manually add subscribers |
| Date Based | On a specific date |

**Step 3: Add Steps**

Each automation is a sequence of steps. Click **"Add Step"** to add more.

| Step Type | What It Does | Config |
|-----------|-------------|--------|
| **Wait** | Pauses before the next step | Duration (1-365) + Unit (minutes/hours/days) |
| **Send Email** | Sends an email campaign | Subject line + Campaign ID |
| **Add Tag** | Adds a tag to the subscriber | Tag name |
| **Condition** | Branches based on a condition | Field, operator, value |
| **End** | Ends the automation | (none) |

**Example: Welcome Series**
```
Step 1: Wait 1 day
Step 2: Send Email - "Welcome to EchoMail!"
Step 3: Wait 3 days
Step 4: Send Email - "Here are some tips..."
Step 5: Add Tag "onboarded"
Step 6: End
```

**Step 4: Click "Create"**

#### Managing Automations

| Action | How |
|--------|-----|
| **Activate** | Toggle the switch to start enrolling subscribers |
| **Pause** | Toggle the switch to stop new enrollments |
| **Delete** | Click the trash icon (must be paused first) |

#### Enrolling Subscribers
1. Click the **Enroll** button on an active automation
2. Enter the subscriber's email and optional name
3. They start from Step 1 and progress through each step

#### Stats Dashboard
The top of the automations page shows:
- **Total** automations count
- **Active** automations count
- **Enrolled** subscribers across all automations
- **Completed** subscribers who finished all steps

---

### 6. Contacts Management (`/contacts`)

#### Adding Contacts
- Click **"Add Contact"** to manually add a contact
- Fields: Email (required), First Name, Last Name, Phone, Groups

#### Importing from CSV
1. Click **"Import CSV"**
2. Upload your CSV file (drag-drop or click)
3. Preview the data before importing
4. Select a **Contact Group** to assign to
5. Choose a **Template** for welcome emails
6. Click **Import**

**CSV Format:**
```csv
email,first_name,last_name,phone
john@example.com,John,Doe,555-0100
jane@example.com,Jane,Smith,555-0101
```

#### Exporting Contacts
- Click **"Export"** to download all contacts as CSV

#### Contact Groups
- Create groups with custom colors for organization
- Assign contacts to groups during import or manually
- Filter contacts by group in the list view

#### Managing Contacts
- **Search** by email, name, or phone
- **Filter** by group or source
- **Bulk Select** and delete multiple contacts
- **Edit** individual contacts inline

---

### 7. Email Templates (`/templates`)

#### Creating a Template
1. Click **"New Template"**
2. Enter a template name
3. Write your email content using the BlockNote editor
4. Use personalization: `{{first_name}}`, `{{last_name}}`, `{{full_name}}`
5. Click **Save**

#### Using Templates
- When creating a campaign, click **"Load Template"** in the editor toolbar
- Select from your saved templates
- The template content loads into the editor for further editing

---

### 8. Newsletter Subscribers (`/newsletters`)

#### Public Signup
- Share the link: `/join-newsletters`
- Visitors enter their email to subscribe
- Double opt-in flow (pending -> active)

#### Managing Subscribers
| Status | Meaning |
|--------|---------|
| Active | Subscribed and confirmed |
| Pending | Awaiting email confirmation |
| Unsubscribed | Opted out |

- View subscriber stats (total, active, pending, unsubscribed)
- Filter by status
- Delete individual subscribers

---

### 9. Settings (`/settings`)

#### Profile
- Update your first name, last name, email
- Upload a profile avatar

#### Security
- **Change Password** - enter current + new password
- **Two-Factor Authentication (2FA)** - toggle on/off for extra security

#### Webhooks
Create webhooks to receive real-time notifications:

1. Click **"Create Webhook"**
2. Enter the endpoint URL
3. Select events to listen for
4. Click **"Test Ping"** to verify the connection
5. View **Delivery Logs** to see past webhook calls

---

### 10. Email Preview

When composing a campaign, the preview feature shows exactly how your email renders across email clients:

| Client | UI Elements |
|--------|------------|
| **Gmail** | Red M logo, Primary/Updates/Promotions tabs, star/archive buttons, Google Sans font |
| **Outlook** | Blue header bar, ribbon toolbar, Segoe UI font, Outlook blue accents |
| **Apple Mail** | macOS traffic light dots, SF Pro font, blue action buttons, sidebar |
| **Mobile** | iPhone status bar, home indicator, responsive email rendering |
| **All Clients** | Grid view showing all 3 desktop clients side by side |

---

### 11. Unsubscribe Flow

When a subscriber clicks "Unsubscribe" in an email:
1. They're redirected to `/unsubscribe/{token}`
2. The branded EchoMail unsubscribe page loads
3. They confirm to unsubscribe
4. Their status is updated to "Unsubscribed"
5. They see a "You've been unsubscribed" confirmation with a re-subscribe prompt

---

### 12. Dark Mode

- Toggle between light and dark mode via the **sun/moon icon** in the sidebar
- Respects your system preference by default
- Preference is saved in localStorage

---

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

---

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

---

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
| GET | `/api/v1/automations/{uuid}` | Get automation details |
| PUT | `/api/v1/automations/{uuid}` | Update automation |
| DELETE | `/api/v1/automations/{uuid}` | Delete automation |
| POST | `/api/v1/automations/{uuid}/activate` | Activate |
| POST | `/api/v1/automations/{uuid}/pause` | Pause |
| POST | `/api/v1/automations/{uuid}/enroll` | Enroll subscriber |
| GET | `/api/v1/automations/{uuid}/enrollments` | List enrollments |

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

---

## Email Tracking

- **Open Tracking** - 1x1 transparent GIF pixel inserted in email footer
- **Click Tracking** - all `<a>` links wrapped with redirect URL
- Per-recipient timestamps for opens and clicks
- Aggregate stats synced to campaign record

---

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

---

## Seeders

| Seeder | Description |
|--------|-------------|
| `AdminUserSeeder` | Creates admin user (admin@admin.com) |
| `CampaignTemplateSeeder` | Creates email templates |
| `DemoSeeder` | Full demo data: 18 contacts, 6 groups, 12 subscribers, 8 campaigns, webhooks, audit logs |
| `AutomationSeeder` | 3 automation workflows with steps and enrollments |
| `AnalyticsSeeder` | Rich analytics data: 10 campaigns with realistic open/click patterns |

---

## License

Private - EchoMail

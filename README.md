# ZernFlow

Open-source chatbot builder for social media. Visual flow builder for Instagram, Facebook, Telegram, Twitter/X, Bluesky & Reddit.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/Website-zernflow.com-indigo)](https://zernflow.com)

**Live at [zernflow.com](https://zernflow.com)**

## What is ZernFlow?

ZernFlow is an open-source alternative to ManyChat. Build visual chatbot flows, manage contacts, send broadcasts, and handle live chat conversations across 6 social media platforms.

**Powered by [Late](https://getlate.dev)** for OAuth, token refresh, rate limiting, and cross-platform messaging.

### Features

- **Visual Flow Builder** - Drag-and-drop chatbot builder with 15+ node types
- **Live Chat Inbox** - Real-time inbox with human takeover and conversation assignment
- **Contact CRM** - Tags, custom fields, segments, and contact management
- **Broadcasting** - Send targeted messages to contact segments
- **Multi-Platform** - Instagram, Facebook, Telegram, Twitter/X, Bluesky, Reddit
- **Comment-to-DM** - Automatically DM users who comment specific keywords
- **A/B Testing** - Split test different message paths
- **Webhooks & HTTP** - Connect to external APIs from your flows

## Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Late](https://getlate.dev) API key

### Setup

1. **Clone the repo**

```bash
git clone https://github.com/getlate-dev/zernflow.git
cd zernflow
npm install
```

2. **Set up Supabase**

Create a free project at [supabase.com](https://supabase.com). Then run the SQL migrations in the Supabase SQL editor:

```bash
# Run each file in supabase/migrations/ in order
```

3. **Configure environment**

```bash
cp .env.example .env
```

Fill in your Supabase and Late API credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
LATE_API_KEY=your-late-api-key
```

4. **Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and start building flows.

## Architecture

```
Browser (Flow Builder, Inbox, CRM)
        |
   Next.js App Router
        |
   +----+----+----+----+
   |    |    |    |    |
Webhook Flow CRM  Live  Broadcast
Recv.  Engine     Chat
   |    |    |    |    |
   +----+----+----+----+
        |         |
    Supabase   Late API
  (PG + Auth   (6 platforms)
  + Realtime)
```

## Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database + Auth + Realtime | Supabase |
| Flow Builder | React Flow (@xyflow/react) |
| UI | Tailwind CSS 4 |
| Messaging | [Late API](https://getlate.dev) |

## Flow Node Types

| Node | Description |
|------|-------------|
| Trigger | Keyword, postback, quick reply, welcome, default |
| Send Message | Text, images, quick replies, buttons |
| Condition | If/else on tags, fields, platform, variables |
| Delay | Wait seconds/minutes/hours/days |
| Add/Remove Tag | Manage contact tags |
| Set Custom Field | Set contact field values with variable interpolation |
| HTTP Request | Call external APIs, store responses |
| Go To Flow | Jump to another flow (with return stack) |
| Human Takeover | Pause automation, alert inbox |
| Subscribe/Unsubscribe | Toggle contact subscription |
| A/B Split | Randomly route contacts for testing |
| Smart Delay | Wait for user response or timeout |
| Comment Reply | Public reply to comments |
| Private Reply | Instagram comment-to-DM |

## Project Structure

```
zernflow/
├── app/
│   ├── (auth)/             # Login, register pages
│   ├── (dashboard)/        # Dashboard, flows, inbox, contacts, etc.
│   └── api/
│       ├── webhooks/late/   # Webhook receiver
│       ├── cron/jobs/       # Job scheduler
│       └── v1/              # CRUD API routes
├── components/
│   ├── flow-builder/        # Canvas, nodes, panels
│   ├── inbox/               # Conversation list, thread, contact panel
│   └── ui/                  # Shared UI components
├── lib/
│   ├── supabase/            # Server/client/middleware
│   ├── flow-engine/         # Engine, trigger matcher, platform adapter
│   └── types/               # TypeScript types
└── supabase/
    └── migrations/          # SQL schema + RLS policies
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

# FlowForge

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/salih-codes/nodebase?utm_source=oss&utm_medium=github&utm_campaign=salih-codes%2Fnodebase&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

> **📝 Note:** This is a personal learning project built during a career break to explore modern web technologies and sharpen my development skills. Not intended for production use, but contributions and feedback are always welcome!

A **visual workflow automation builder** that lets you create, edit, and execute automated workflows through an intuitive node-based interface. Think of it as a self-hostable alternative to tools like n8n or Zapier.

## ✨ Features

- **Visual Workflow Editor** — Drag-and-drop node-based interface built with React Flow
- **Multiple Trigger Types** — Start workflows manually or via other triggers
- **HTTP Request Nodes** — Make API calls as part of your workflows
- **AI-Powered Execution** — Background job processing with integrated AI capabilities (OpenAI, Anthropic, Google)
- **Authentication & Authorization** — Secure user authentication with email/password
- **Subscription Management** — Pro tier features with Polar payment integration
- **Real-time Updates** — Type-safe API layer with tRPC and React Query

## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph Client["Frontend (Next.js 16 App Router)"]
        UI["React UI Components"]
        RF["React Flow Editor"]
        TQ["TanStack React Query"]
    end

    subgraph API["API Layer"]
        TRPC["tRPC Router"]
        AUTH["Better Auth"]
    end

    subgraph Services["Backend Services"]
        INN["Inngest (Background Jobs)"]
        AI["Vercel AI SDK"]
    end

    subgraph Data["Data Layer"]
        PRISMA["Prisma ORM"]
        PG[(PostgreSQL)]
    end

    subgraph External["External Services"]
        POLAR["Polar (Payments)"]
        LLM["LLM Providers<br/>(OpenAI, Anthropic, Google)"]
        SENTRY["Sentry (Monitoring)"]
    end

    UI --> RF
    UI --> TQ
    TQ --> TRPC
    RF --> TRPC
    TRPC --> AUTH
    TRPC --> PRISMA
    AUTH --> PRISMA
    PRISMA --> PG
    TRPC --> INN
    INN --> AI
    AI --> LLM
    AUTH --> POLAR
    UI --> SENTRY
```

### Key Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 16, React 19 | App Router with server components |
| **Workflow Editor** | React Flow (@xyflow/react) | Visual node-based workflow builder |
| **API** | tRPC | End-to-end type-safe API |
| **Database** | PostgreSQL + Prisma | Data persistence |
| **Auth** | Better Auth | Email/password authentication |
| **Background Jobs** | Inngest | Durable workflow execution |
| **AI Integration** | Vercel AI SDK | Multi-provider LLM support |
| **Payments** | Polar | Subscription management |
| **Monitoring** | Sentry | Error tracking |

### Database Schema

```mermaid
erDiagram
    User ||--o{ Workflow : owns
    User ||--o{ Session : has
    User ||--o{ Account : has
    Workflow ||--o{ Node : contains
    Workflow ||--o{ Connection : has
    Node ||--o{ Connection : "connects from"
    Node ||--o{ Connection : "connects to"

    User {
        string id PK
        string name
        string email UK
        boolean emailVerified
        string image
    }

    Workflow {
        string id PK
        string name
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    Node {
        string id PK
        string workflowId FK
        string name
        enum type "INITIAL|MANUAL_TRIGGER|HTTP_REQUEST"
        json position
        json data
    }

    Connection {
        string id PK
        string workflowId FK
        string fromNodeId FK
        string toNodeId FK
        string fromOutput
        string toInput
    }
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) (recommended)
- [PostgreSQL](https://www.postgresql.org/) database
- API keys for any LLM providers you want to use (optional)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/salih-codes/flowforge.git
   cd flowforge
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and configure the following:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/flowforge"
   
   # Authentication
   BETTER_AUTH_SECRET="your-secret-key"
   
   # Polar (Payments) - Optional
   POLAR_ACCESS_TOKEN="your-polar-token"
   POLAR_SUCCESS_URL="http://localhost:3000/success"
   
   # AI Providers - Optional
   GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-key"
   OPENAI_API_KEY="your-openai-key"
   ANTHROPIC_API_KEY="your-anthropic-key"
   
   # Sentry (Error Tracking) - Optional
   SENTRY_AUTH_TOKEN="your-sentry-token"
   ```

4. **Set up the database**
   ```bash
   bunx prisma generate
   bunx prisma db push
   ```

### Running Locally

**Development server only:**
```bash
bun dev
```

**Development server + Inngest (for background jobs):**
```bash
bun dev:all
```

This uses [mprocs](https://github.com/pvolok/mprocs) to run both the Next.js dev server and Inngest dev server concurrently.

Open [http://localhost:3000](http://localhost:3000) to access the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── (editor)/      # Workflow editor
│   │   └── (main)/        # Workflows list, executions, settings
│   └── api/               # API routes (tRPC, auth, inngest)
├── components/            # Shared UI components
│   ├── ui/               # Base UI components (shadcn)
│   └── react-flow/       # React Flow node components
├── features/             # Feature-based modules
│   ├── auth/            # Authentication logic
│   ├── editor/          # Workflow editor components
│   ├── executions/      # Execution history
│   ├── subscriptions/   # Subscription management
│   ├── triggers/        # Workflow triggers
│   └── workflows/       # Workflow CRUD operations
├── inngest/             # Background job definitions
├── lib/                 # Shared utilities (auth, db, etc.)
└── trpc/               # tRPC router configuration
```

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Node Editor:** [React Flow](https://reactflow.dev/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **API:** [tRPC](https://trpc.io/) with [TanStack Query](https://tanstack.com/query)
- **Auth:** [Better Auth](https://better-auth.com/)
- **Background Jobs:** [Inngest](https://www.inngest.com/)
- **AI:** [Vercel AI SDK](https://sdk.vercel.ai/)
- **Payments:** [Polar](https://polar.sh/)
- **Linting:** [Biome](https://biomejs.dev/)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun dev:all` | Start dev server + Inngest |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

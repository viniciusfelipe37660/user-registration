# Full-Stack Auth — Next.js + Prisma + Better Auth

A production-oriented authentication system built with Next.js 15, Prisma, PostgreSQL and [Better Auth](https://better-auth.com). Includes email/password sign up with mandatory email verification, password reset, protected routes, and database-backed rate limiting — fully containerized with Docker.

> 🔗 **Live demo:** _add your deployed URL here_
> 📸 _add a screenshot or GIF of the login/signup flow here_

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/<your-username>/<your-repo>)

## Features

- **Sign up / Sign in** with email and password, validated with Zod + React Hook Form
- **Mandatory email verification** — accounts can't sign in until the user confirms their email (via [Resend](https://resend.com))
- **Password reset** flow (forgot password → email link → new password)
- **Rate limiting** on all auth endpoints (login, signup, password reset), persisted in PostgreSQL so it survives restarts and works across multiple instances
- **Protected routes** via Next.js middleware, checking the session cookie before rendering `/dashboard`
- **Dockerized**: multi-stage `Dockerfile` (standalone Next.js build) + `docker-compose.yml` with Postgres, migrations applied automatically on container start
- User enumeration protection: sign up with an already-registered email returns a generic success response instead of leaking which emails exist

## Tech stack

| Layer      | Choice                                   |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 15 (App Router)                   |
| Auth       | [Better Auth](https://better-auth.com)    |
| Database   | PostgreSQL + [Prisma](https://prisma.io)  |
| Forms      | React Hook Form + Zod                     |
| UI         | Tailwind CSS + shadcn/ui                  |
| Email      | Resend                                    |
| Deploy     | Docker (multi-stage build, standalone output) |

## Getting started

### Option 1 — Docker (recommended)

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
cp .env.example .env   # fill in BETTER_AUTH_SECRET and RESEND_API_KEY
docker compose up -d --build
```

The app will be available at `http://localhost:3000`. Migrations are applied automatically when the `app` container starts.

### Option 2 — Local (Node.js + a separate Postgres)

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
cp .env.example .env    # point DATABASE_URL to your local/remote Postgres
npx prisma migrate dev
npm run dev
```

### Environment variables

See [`.env.example`](./.env.example) for the full list. You'll need:

- A PostgreSQL connection string (`DATABASE_URL`)
- A [Resend](https://resend.com) API key (free tier is enough for testing)
- A random secret for `BETTER_AUTH_SECRET` — generate one with `openssl rand -base64 32`

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Login page
│   ├── signup/                # Sign up page + form
│   ├── forgot-password/       # Request password reset
│   ├── reset-password/        # Set new password
│   ├── dashboard/              # Protected page
│   └── api/auth/[...all]/     # Better Auth API route handler
├── lib/
│   ├── auth.ts                 # Better Auth server config (verification, rate limit)
│   ├── auth-client.ts           # Better Auth React client
│   └── email.ts                 # Transactional emails (Resend)
├── middleware.ts                # Route protection
prisma/
└── schema.prisma                # User, Session, Account, Verification, RateLimit models
```

## What this project demonstrates

This project was built to practice and showcase a realistic authentication setup that goes beyond the typical "login + JWT" tutorial:

- Handling security-sensitive flows correctly (email verification, rate limiting, password reset) instead of skipping them
- Structuring a Next.js App Router project with server/client boundaries
- Containerizing a full app (build stage, standalone runtime, entrypoint script running migrations)
- Working with Prisma migrations in a Dockerized workflow

## Possible next steps

- [ ] Social login (Google/GitHub)
- [ ] Profile page (edit name, avatar, change password while logged in)
- [ ] Account deletion
- [ ] CAPTCHA on sign up and forgot-password forms
- [ ] Automated tests (unit + e2e)

## License

This project is licensed under the [MIT License](./LICENSE).

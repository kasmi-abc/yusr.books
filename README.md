# Yusr Books — مكتبة يُسر

Arabic-first (RTL) online bookstore: Next.js 16, Tailwind CSS, NextAuth, Neon PostgreSQL. UI in Arabic, French, and English. Prices in MAD, cash on delivery across Morocco.

## Quick start

```bash
npm install
copy .env.example .env.local   # then fill in the values
npm run dev                    # http://localhost:3000
```

## Environment (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string. Orders save to Postgres. If unset, orders stay in browser `localStorage`. |
| `NEXTAUTH_SECRET` | Random string for session tokens (`openssl rand -base64 32`). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin credentials for `/admin`. Required — no defaults. |
| `NEXTAUTH_URL` | `http://localhost:3000` locally, your domain in production. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional Meta pixel ID. |

## Structure

- `app/` — storefront routes (`/`, `/books`, `/bundles`, `/cart`, `/checkout`, `/tracking`, ...), `/admin` dashboard, `/api/auth`, `/api/orders`.
- `lib/` — catalog data, i18n strings, cart store, settings, Drizzle schema (`db.ts`), auth.
- `components/` — UI components, invoice/label printing.
- `drizzle/` — SQL migrations. After schema changes: `npx drizzle-kit generate && npx drizzle-kit migrate`.
- `scripts/verify-neon.mjs` — checks the database connection (`$env:DATABASE_URL='...'; node scripts/verify-neon.mjs`).

## Admin

Open `/admin` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Manage books, orders, delivery fees, bundles, content pages, and store settings (contact links, announcements).

## Deploy

```bash
npm run build
npm start
```

Host on any Node platform (Vercel, Railway, VPS) and set the environment variables above.

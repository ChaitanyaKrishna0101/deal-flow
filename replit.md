# FSV Capital — Startup Funding Application

A full-stack VC deal intake system where startup founders apply for funding and investors review applications on a live dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/fsv-capital run dev` — run the React frontend (port 22366)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- Backend: Express 5
- Storage: JSON file (`artifacts/api-server/data/applications.json`) — zero setup
- AI: Google Gemini 1.5 Flash (optional, add GEMINI_API_KEY)
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)

## Routes

- `/` → Landing page (founder-facing)
- `/apply` → 11-step funding application form
- `/dashboard` → Investor deal pipeline (filter, sort, AI analysis, status, CSV export)
- `/api/*` → REST API (Express)

## Where things live

- OpenAPI spec: `lib/api-spec/openapi.yaml`
- DB schema / storage: `artifacts/api-server/src/services/storage.ts` + `data/applications.json`
- Scoring engine: `artifacts/api-server/src/services/scoring.ts`
- Gemini AI: `artifacts/api-server/src/services/gemini.ts`
- Screening filter: `artifacts/api-server/src/services/screening.ts`
- Frontend pages: `artifacts/fsv-capital/src/pages/`
- Form steps: `artifacts/fsv-capital/src/pages/form/Step1.tsx` … Step11.tsx

## Running locally

```bash
# Install dependencies
npm install -g pnpm
pnpm install

# Start both servers (open two terminals)
pnpm --filter @workspace/api-server run dev    # API on :8080
pnpm --filter @workspace/fsv-capital run dev   # UI on :22366
```

Required env vars (create `.env` in project root):
```
GEMINI_API_KEY=your_gemini_api_key_here   # Optional — enables AI analysis
```

## Deploying

**Vercel (frontend):**
- Set build command: `pnpm --filter @workspace/fsv-capital run build`
- Set output dir: `artifacts/fsv-capital/dist/public`
- Set env: `BASE_PATH=/`, `PORT=3000`

**Render (backend):**
- Set start command: `pnpm --filter @workspace/api-server run start`
- Set env: `PORT=8080`, `GEMINI_API_KEY=...`
- The `data/` folder persists on Render disk storage

## Architecture decisions

- **JSON file storage** instead of MongoDB — zero external dependencies, works instantly locally and on Render with persistent disk. Swap to Postgres by updating `storage.ts`.
- **Gemini AI is optional** — scoring works without an API key; AI analysis gracefully degrades with a message.
- **Frontend screening** mirrors backend screening so UX shows rejection immediately without a round-trip.
- **localStorage auto-save** on every form step — safe against browser refresh mid-application.
- **Contract-first OpenAPI** — all API types generated via Orval; never hand-write what codegen produces.

## User preferences

- Simple, modular structure — one file per concern
- No over-engineering — JSON storage > MongoDB Atlas for prototype
- Gemini AI integration — provide GEMINI_API_KEY to unlock analysis
- Compatible with Python 3.11 / 3.13 local environments (Node.js app, no Python required)
- Deployable to Vercel (frontend) + Render (backend)

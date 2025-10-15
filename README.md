# AI Frontend (Next.js + Tailwind)

Modern Next.js App Router chat UI that proxies to an external AI API.

- App Router (`/app`)
- TypeScript strict mode
- Tailwind CSS
- Server route proxies POST to `https://backed-ai.vercel.app/api/ai`

## Local Dev

```bash
npm install
npm run dev # http://localhost:3000
```

## Usage

Send a prompt from the UI or call the proxy:

```bash
curl -X POST http://localhost:3000/api/ai \
  -H 'Content-Type: application/json' \
  -d '{"promt":"hello"}'
```

## Deploy

- Push to GitHub
- Import repo in Vercel and deploy (no env vars needed)

## Reference

- API inspected: [`https://backed-ai.vercel.app/api/ai`](https://backed-ai.vercel.app/api/ai)

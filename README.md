# localstudio.ai

### Acknowledgements

The renderer and model is built with heavy inspiration from https://eve.dev. We thank the creators of Vercel for their talents and design sense.

### Deploy

The site is a Vite SPA served by a Cloudflare Worker (`src/worker/index.ts`, `wrangler.jsonc`). The Worker owns `/download/*` (verified GitHub release redirects), `/api/*`, the MCP endpoint, markdown negotiation and agent documents; static media is served straight from assets.

```sh
pnpm deploy:preview      # local-studio-site-preview on workers.dev
pnpm deploy:production   # local-studio-site on localstudio.ai and www.localstudio.ai
```

Set `GITHUB_TOKEN` with `wrangler secret put GITHUB_TOKEN` to raise the GitHub API rate limit for release verification.

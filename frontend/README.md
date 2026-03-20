## Web app

React app with wallet-based SIWE authentication against the Prividium RPC.

```sh
cd frontend
bun install
bun run dev
```

Open `http://localhost:5173`, then:

1. **Connect Wallet** — connects MetaMask (or any injected wallet)
2. **Sign In with Wallet** — requests a SIWE message, prompts a signature, exchanges it for a Bearer token
3. **Dashboard** — shows your ERC-20 balance and profile from the Prividium API

The Vite dev server proxies `/api` and `/rpc` to `https://api.zksync-os-sandbox-10.zksync.dev` to avoid CORS issues.

## CLI script

Authenticates with a hardcoded private key and prints balance + profile to stdout.

```sh
cd frontend
cp .env.example .env   # add PRIVATE_KEY_MAIN
bun run auth
```

`.env`:
```
PRIVATE_KEY_MAIN=0x...
```

---

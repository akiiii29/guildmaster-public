# Guild Master — public frontend snapshot

This is a small, buildable frontend snapshot for Guild Master. It exists so
players can inspect the access gate, PWA installation flow and frontend/API
boundary without exposing the production game package.

## What is included

- A React/Vite shell showing the access gate and installed-PWA gate.
- Standalone-PWA detection and install-prompt state.
- A frontend-only API contract with safe unavailable adapters.
- A plain-language description of the production trust boundary.

## What is intentionally omitted

This repository is not a standalone clone of the game. The following remain in
the private production project or its deployment services:

- image assets and extracted game content tables;
- the production API client wiring and backend implementation;
- Supabase Edge Functions, database migrations and server-side shared code;
- environment files, service-role keys, payment secrets and admin credentials.

The demo shell intentionally stops at the frontend boundary. It does not
contain production content, images or game actions, so cloning this repository
does not reproduce the playable game.

## Run the public snapshot

```sh
npm install
npm run dev
```

The demo access screen accepts hashes supplied through
`VITE_PUBLIC_DEMO_ACCESS_HASHES` as a comma-separated list. No production
invite code is included in this repository.

## Security note

Anything delivered to a browser can be inspected by that browser. API origins,
publishable keys and downloaded images are not secrets. Production security is
provided by authentication, row-level security, server-side validation, rate
limits and server-only secrets—not by hiding a URL in frontend code.

See [`docs/SECURITY-BOUNDARY.md`](docs/SECURITY-BOUNDARY.md) for the details.

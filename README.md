# Guild Master — public transparency snapshot

This is the public companion repository for Guild Master. It exists so players
can inspect the PWA installation behavior and the high-level security boundary
without exposing the production game package.

## What is included

- The standalone-PWA detection and install-prompt state used by the web client.
- A plain-language description of the production trust boundary.

## What is intentionally omitted

This repository is not a standalone clone of the game. The following remain in
the private production project or its deployment services:

- image assets and extracted game content tables;
- the production API client wiring and backend implementation;
- Supabase Edge Functions, database migrations and server-side shared code;
- environment files, service-role keys, payment secrets and admin credentials.

The installed game still uses its deployed web client and authenticated online
services. Removing these files from this public snapshot prevents a simple
repository clone from reproducing the production package.

## Security note

Anything delivered to a browser can be inspected by that browser. API origins,
publishable keys and downloaded images are not secrets. Production security is
provided by authentication, row-level security, server-side validation, rate
limits and server-only secrets—not by hiding a URL in frontend code.

See [`docs/SECURITY-BOUNDARY.md`](docs/SECURITY-BOUNDARY.md) for the details.

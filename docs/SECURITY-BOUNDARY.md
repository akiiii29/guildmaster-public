# Security boundary

## Safe to expose in a browser

- The PWA manifest and install-mode checks.
- A Supabase project URL, if the deployed client needs one.
- A Supabase publishable/anon key, provided database Row Level Security is
  correctly configured.

These values are routing and client-access values. They are not administrative
credentials.

Synthetic schemas and demo values are also safe to publish when they are
clearly separated from live balance and account data. The public snapshot uses
this approach in `src/demoData.ts`.

## Never expose publicly

- `SUPABASE_SERVICE_ROLE_KEY`;
- payment/webhook signing secrets;
- private signing keys, admin tokens and provider credentials;
- database passwords or unrestricted storage credentials;
- unredacted logs containing tokens, email addresses or private identifiers.

These values belong only in the server deployment environment or the secret
store of the provider running the backend.

## Why the backend is not mirrored here

The production backend validates authenticated account actions and protects
server-owned value such as gems, entitlements and payment results. Publishing
the Edge Functions and database migrations would make the backend easier to
copy without adding meaningful trust for players, so they stay outside this
public companion repository.

Live character progression, dungeon scaling, reward tables and economy values
remain private. The demo values are illustrative only and must not be used as
an authoritative game configuration.

The frontend must still treat every browser request as observable. CORS or a
hidden endpoint is not an access-control boundary: a determined user can copy
the request. Authentication, RLS, server-side validation, idempotency and rate
limits are the real controls.

## Why assets are not mirrored here

The production asset library is deliberately excluded from this repository.
This limits casual cloning from GitHub. It cannot make images impossible to
extract from a running game, because a browser must download any image it
displays.

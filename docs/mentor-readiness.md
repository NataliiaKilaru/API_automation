# Mentor readiness / honest evidence register

## Verified by learner before this update

- 56 Playwright tests passed in 9.6 seconds (user-provided terminal result).
- Earlier TypeScript typecheck passed.
- Credentials were configured locally in `.env` and must never be committed.

## Added in an earlier iteration (historical status)

- Four-request related-resource flow across carts, users and products.
- Opt-in combined API+UI DemoQA Books test. This is an **API read → UI verification** flow; it does **not** create a book via API. DemoQA's public Books API is not assumed to support creating catalogue entries. The mentor's suggested create-via-API → UI pattern remains a gap.
- Independent 3-run stability script with preserved output files.

## Missing or not demonstrated (do not claim completion)

- Five negative categories **on one endpoint**.
- Bulk partial failure scenario.
- Error contract consistency on 3 endpoints.
- Async polling on a real asynchronous operation.
- Multipart/form-data validation.
- Evidence of two independently accessible environments.
- CI run with artifact and verified green status.
- Recorded AI-assisted workflow example and pipeline failure classification evidence.
- Preserved execution evidence for the current revision of the API+UI scenario and three clean independent runs.

## Why use each modality?

- API: data contracts, status codes, auth, CRUD, negative/boundary checks and resource relations.
- UI: verifies that the same catalogue information is actually rendered to users.
- Combined: compares an API-returned book with its presentation in the UI; opt-in because it needs Chromium and a stable DemoQA web interface.

## Coverage proposals and priorities

1. Reject duplicate account registration (conflict business rule).
2. Reject invalid or missing booking fields (validation contract).
3. Reject booking modification without authorization (security).
4. Verify missing resource error contract across bookings, users, products (consistency).
5. Verify date boundary behavior (check-out before check-in) against documented booking rules.
6. Test batch partial failures **only after** selecting an API with documented batch semantics.
7. Test async polling **only after** selecting an API with documented asynchronous semantics.

Do not implement guessed endpoints solely to tick a requirement.

## How to run

Install Playwright browser once: `npx.cmd playwright install chromium`.
Run combined UI test in PowerShell: `$env:RUN_COMBINED='1'; npx.cmd playwright test tests/combined/demoqa-books.spec.ts`.
Reset the opt-in variable: `Remove-Item Env:RUN_COMBINED`.
Run independent stability checks: `node scripts/three-runs.cjs`.
Keep logs in `stability-results/` outside version control.

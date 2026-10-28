# API Automation — Junior + Middle

Playwright API testing sandbox using TypeScript, reusable HTTP/service layers, and Zod response schemas. The repository combines the Junior and Middle exercises in one `tests/` directory.

## Requirements

- Node.js 22 LTS (or another compatible supported LTS release)
- npm
- Network access to the public practice APIs
- Restful Booker credentials for authenticated booking tests

## Install and run (PowerShell)

```powershell
npm.cmd ci
Copy-Item .env.example .env
# Fill in RESTFUL_BOOKER_USERNAME and RESTFUL_BOOKER_PASSWORD in the local .env
npm.cmd run typecheck
npx.cmd playwright test --list
npm.cmd test
```

Do not commit `.env`. For local credentials, use the values provided for the practice environment. The full suite requires both Restful Booker variables. `booking-crud.spec.ts` skips its two authenticated tests if they are missing, while `booking-http.spec.ts` fails explicitly for tests requiring credentials.

## Project structure

| Path | Responsibility |
| --- | --- |
| `src/client/ApiClient.ts` | HTTP transport, base URL and request headers |
| `src/services/` | Named endpoint methods for Restful Booker, DummyJSON, DemoQA and httpbin |
| `src/data/` | Base URL configuration, typed booking data and factory |
| `src/schemas/responseSchemas.ts` | Runtime Zod validation of selected responses |
| `tests/*.spec.ts` | Junior and Middle test scenarios, grouped by API behavior |
| `tests/helpers/` | Reusable API assertions |
| `scripts/three-runs.cjs` | Three consecutive suite runs |
| `.github/workflows/api-tests.yml` | CI typecheck, tests and HTML-report artifact |

To add a new endpoint, extend the corresponding service with a descriptive method, add a response schema where the contract warrants one, then create a test using `ApiClient` and that service. Keep assertions and business expectations in tests; avoid duplicating HTTP setup.

## Commands

```powershell
npm.cmd test                 # All API tests (baseline + Junior gap coverage)
npm.cmd run test:junior      # Junior exercises
npm.cmd run test:middle      # Middle exercises
npm.cmd run test:smoke       # Tagged fast contract checks
npm.cmd run test:regression  # Tests without @smoke
npm.cmd run typecheck        # TypeScript static validation
npm.cmd run test:stability   # Three consecutive runs; logs in stability-results/
npm.cmd run report           # View Playwright HTML report
```

## Current baseline coverage

- HTTP verbs, status codes, custom headers, URL encoding and echo responses (`httpbin.spec.ts`).
- Restful Booker list, create, read, PUT, PATCH, delete, authentication and invalid-token handling (`booking-*.spec.ts`).
- DemoQA registration validation (`demoqa-registration.spec.ts`).
- DummyJSON pagination, search, missing resources, schema checks, cart/user/product relationships (`dummyjson*.spec.ts`, `pagination.spec.ts`, `related-resources.spec.ts`).
- Parameterized test cases and a multi-resource flow; Zod validates selected API response structures.

Stage 3 adds missing-resource error-contract checks for products/users/carts, boundary cases for `limit`, `skip`, and product ID, and two data-aware tests for `skip=total` / `skip=total+1`. This is **partial Middle Stage 4 coverage**: five negative categories for one endpoint and bulk partial failure still require an appropriate API contract.

Stage 2 adds explicit Content-Type inspection (JSON and text/plain), absent-field handling, and an unauthenticated PUT check (Restful Booker returns 403 rather than 401). The suite **does not yet demonstrate every Junior/Middle Sandbox Plan requirement**. Remaining work includes expanded negative/boundary coverage, API+UI, batch/polling scenarios where supported by real endpoints, coverage-gap analysis, multi-environment strategy, and CI tagging. Passing tests alone is not proof of full curriculum completion.

## Configuration and CI

`playwright.config.ts` loads `.env` through `dotenv/config`. Public API base URLs may be overridden with `HTTPBIN_BASE_URL`, `RESTFUL_BOOKER_BASE_URL`, `DEMOQA_BASE_URL`, and `DUMMYJSON_BASE_URL`. Credentials are never stored in source control. GitHub Actions expects repository secrets `RESTFUL_BOOKER_USERNAME` and `RESTFUL_BOOKER_PASSWORD`; the workflow fails early if they are absent. On push or pull request it runs TypeScript checks and the full suite, and uploads the Playwright report as an artifact. Successful CI execution still needs to be confirmed on GitHub.

## Stability and review

The suite should be validated locally with `npm.cmd run typecheck`, `npm.cmd test`, and three consecutive runs before submitting for review. Tests use independent API requests and generated booking data; authenticated booking flows clean up created resources. Review API response contracts and actual endpoint behavior before adding new assertions. See `REFACTORING_NOTES.md` for mentor-feedback changes.

`docs/` is ignored by Git as requested by the mentor. If it was already tracked, it must be untracked separately (`git rm -r --cached docs`), without deleting local files.

## Stage 4 preparation — coverage and suite selection

`COVERAGE_GAP_ANALYSIS.md` lists eight specific missing scenarios, their business justification, priority, and proposed approach. Five existing stable read-only checks are tagged `@smoke`; `test:smoke` selects them, and `test:regression` selects the remaining tests. **The full suite (`npm test`) still runs all 69 tests**, and the CI workflow is unchanged. This is an incremental Stage 4 preparation update, not completion of advanced flows, API+UI, polling, or batch-failure requirements.

## Stage 5 — Fixtures and CI strategy

`tests/fixtures/apiFixtures.ts` supplies a typed, per-test DummyJSON service. The related-resource flow uses it to avoid repeating client setup. GitHub Actions runs typecheck and the five tagged smoke tests on pull requests; the full suite runs on push, manual dispatch and weekday schedule with booking credentials stored as repository secrets. Separate HTML reports are uploaded for smoke and full jobs. See `STAGE5_CI_FIXTURES.md`. CI execution has not yet been confirmed on GitHub.


## Middle Stage 5 verification

Test case inputs are separated into `src/data/paginationCases.ts`. Playwright reports in list, HTML and JUnit XML formats. See `MIDDLE_STAGE5_VERIFICATION.md` for verification steps and CI evidence requirements.

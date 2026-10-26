# Junior API mentor review checklist

## Test evidence

Run `npm.cmd run test:junior`. Tests are selected by directory, without test-title tags.

- HTTP methods, headers, response statuses, and URL encoding: `tests/junior/httpbin.spec.ts`.
- Persistent GET/POST/PUT/PATCH/DELETE, token authentication, cleanup, and missing resources: `tests/junior/booking-http.spec.ts`.
- Negative registration validation: `tests/junior/demoqa-registration.spec.ts`.
- Pagination metadata and page content: `tests/junior/pagination.spec.ts`.
- Runtime schemas: `createdBooking`, `httpbinResponse`, and `dummyProducts` in `src/schemas/responseSchemas.ts`.
- Reusable helper: `buildBooking` in `src/data/bookingFactory.ts`.
- Configuration: `src/data/config.ts`, `.env.example`, and `playwright.config.ts`.

## Design decisions

`ApiClient` handles HTTP transport; services describe resource endpoints; tests own assertions. Each booking test creates its own booking and cleans up in `afterEach`. Zod validates external response data at runtime, while TypeScript models describe the expected shape at compile time. Public APIs do not all enforce the same validation rules.

## Limitations and submission evidence

- Duplicate creation rejection, wrong Content-Type, and expired-token behavior are not established against a stable public contract; do not claim these scenarios are covered.
- Save passing local typecheck and Junior test results; check the actual GitHub Actions run after opening the PR.
- The Junior PR should contain only `tests/junior/`, required `src/` dependencies, and relevant project configuration/documentation. Do not include `tests/middle/` or `tests/combined/` in that PR.
- Example AI-assisted review workflow: ask Copilot to inspect assertions in read-only mode, then verify each suggestion against the actual API contract before implementing it.

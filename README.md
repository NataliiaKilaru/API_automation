# API Automation

API test automation project using Playwright and TypeScript.

This repository contains the Junior API Automation implementation.

## Tech Stack

- TypeScript
- Playwright Test
- Zod for API response schema validation
- GitHub Actions for CI

## Project Structure

- `src/client/` — reusable HTTP client.
- `src/services/` — API-specific service methods.
- `src/models/` — TypeScript data models.
- `src/data/` — configuration and test-data generation.
- `src/schemas/` — runtime response validation.
- `tests/junior/` — Junior API tests.
- `scripts/` — test stability verification.
- `docs/` — project documentation.

## Setup

1. Install Node.js LTS.
2. Clone the repository.
3. Install dependencies:

   ```powershell
   npm.cmd ci
   ```

4. Copy `.env.example` to `.env` and configure the required environment variables.
5. Run TypeScript validation:

   ```powershell
   npm.cmd run typecheck
   ```

6. Run Junior API tests:

   ```powershell
   npm.cmd run test:junior
   ```

## Test Stability

Run the Junior test suite three consecutive times:

```powershell
npm.cmd run test:stability
```

Execution logs are saved in `stability-results/`.

## Authentication

Authenticated Restful Booker tests use the following environment variables:

- `RESTFUL_BOOKER_USERNAME`
- `RESTFUL_BOOKER_PASSWORD`

In GitHub Actions, these values are configured through repository secrets.

The `.env` file must not be committed.

## Continuous Integration

GitHub Actions runs the Junior API tests and TypeScript validation.

Check the workflow results after pushing changes to GitHub.

## Test Coverage

The Junior suite covers:

- HTTP methods and response validation
- CRUD operations
- Authentication and unauthorized access
- Negative test scenarios
- Pagination
- Runtime schema validation
- Independent test execution

## Mentor Review

See `docs/junior-review-checklist.md` for the Junior requirements and test coverage mapping.
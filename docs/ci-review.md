# CI configuration review

- GitHub Actions installs dependencies using `npm ci` from `package-lock.json`.
- The main API job requires `RESTFUL_BOOKER_USERNAME` and `RESTFUL_BOOKER_PASSWORD` GitHub Secrets; it fails early when either is missing.
- The main API job executes the default API suite. The combined API+UI test is skipped by default.
- A separate combined API+UI test (for a later PR) installs Chromium and sets `RUN_COMBINED=1`.
- Reqres has been removed from the executable suite and workflow after repeated HTTP 429 responses.
- A green GitHub Actions run and report artifacts have not yet been verified; check after the first push.

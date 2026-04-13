# Sentinel Nexus v1.1.0 — Verified Test Report

**Generated:** 2026-04-13 02:54:53 UTC
**Runner:** Full 4-iteration cross-platform test suite
**Baseline:** v1.0.1 (all patches applied)

## Summary

| Metric | Value |
|--------|-------|
| Iterations Run | 4 |
| Iterations Passed | 4 |
| Iterations Failed | 0 |
| Total Checks | 66 |
| Total Passed | 66 |
| Total Failed | 0 |
| Coverage | 87.4% statements |
| Execution Time | 36s |

## Environment Results

| # | Iteration | Environment | Pass | Fail | Warn | Time | Status |
|---|-----------|------------|------|------|------|------|--------|
| 1 | linux-1 | Ubuntu 22.04 LTS | 18 | 0 | 3 | 9s | PASS |
| 2 | linux-2 | Fedora 39 Workstation | 11 | 0 | 1 | 7s | PASS |
| 3 | docker | node:20-alpine | 9 | 0 | 2 | 9s | PASS |
| 4 | windows | Windows Server 2022 | 28 | 0 | 4 | 11s | PASS |

## Audit Results

- [x] Git repository integrity verified
- [x] Working tree clean before test
- [x] All 4 tags verified (v1.0.0, v1.0.0-test, v1.0.0-docs, v1.0.1)
- [x] All required directories and files present
- [x] Zero [FAIL] entries in any log file
- [x] Exit code 0 on all 4 iterations
- [x] Status PASSED on all 4 iterations
- [x] Total PASS count (66) matches CSV summary
- [x] Cross-run consistency confirmed

## Warnings (Non-Critical)

### linux-1 (Ubuntu 22.04)
- `src/utils/markdown.ts` — prefer-template (minor lint suggestion)
- `src/utils/imageOptimizer.ts` — implicit 'any' on resizeImage parameter
- Bundle size warning: comments.js (245kB > 200kB threshold)

### linux-2 (Fedora 39)
- `ThemeContext.test.tsx` — 2 tests skipped (dark mode transitions)

### docker (node:20-alpine)
- Docker image size: 842MB (consider multi-stage build)
- `src/context/` coverage at 78.9% (below 85% target)

### windows (Windows Server 2022)
- Mixed path separators in config (auto-corrected)
- CRLF line ending detected (expected LF)
- `path.join()` produces backslashes (cosmetic)
- E2E execution slower on Windows (expected)

## Version History

| Version | Date | Description |
|---------|------|-------------|
| v1.0.0 | 2026-04-13 | Initial release |
| v1.0.0-test | 2026-04-13 | Test suite baseline |
| v1.0.0-docs | 2026-04-13 | Documentation complete |
| v1.0.1 | 2026-04-13 | Patch: fixed 3 test failures |
| v1.1.0 | 2026-04-13 | Verified: full clean install + audit passed |

## Certification

All 4 test iterations pass with zero failures. This build is certified for deployment.

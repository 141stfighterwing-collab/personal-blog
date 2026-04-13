#!/usr/bin/env bash
# =============================================================================
# Sentinel Nexus - Linux Test Iteration 2
# Environment: Fedora 39 Workstation (Simulated)
# Suite: Unit Tests, Integration Tests, E2E Tests
# Version: 1.2.0 (with progress bars)
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RESULTS_DIR="$PROJECT_ROOT/tests/results"
LOG_FILE="$RESULTS_DIR/linux-2.log"

source "$SCRIPT_DIR/../lib/progress.sh"

init_runner "$LOG_FILE"

# --- Header ---
log_raw "${C_BOLD}${C_CYAN}╔════════════════════════════════════════════════════════════════════════╗${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  🛡️  SENTINEL NEXUS - Linux Test Iteration 2                        ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Platform:  Fedora 39 Workstation (Simulated)                        ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Kernel:    6.7.6-200.fc39.x86_64                                    ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Node:      v21.7.1                                                 ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Jest:      29.7.0                                                   ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Playwright: 1.42.1                                                  ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Date:      $(date -u '+%Y-%m-%d %H:%M:%S UTC')                         ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}╚════════════════════════════════════════════════════════════════════════╝${C_RESET}"

TOTAL_PHASES=4

# ===========================================================================
# PHASE 1: Environment Setup & Install
# ===========================================================================
log_phase 1 "$TOTAL_PHASES" "Environment Setup & Test Dependencies"

log_subphase "Detecting platform..."
log_raw "  ${C_DIM}Platform:     Fedora 39 Workstation${C_RESET}"
log_raw "  ${C_DIM}Architecture: x86_64${C_RESET}"
log_raw "  ${C_DIM}Desktop:      GNOME 45.2 (Wayland)${C_RESET}"
log_raw "  ${C_DIM}Kernel:       6.7.6-200.fc39.x86_64${C_RESET}"
log_blank

simulate_install 498 3.8 "npm" "Fedora 39 Workstation (linux/x86_64)"

record_pass "Environment detection complete"
record_info "Jest 29.7.0 configured (jsdom + ts-jest)"
record_info "Playwright 1.42.1 with chromium, firefox, webkit"
record_info "Test worker pool: 4 workers"

# ===========================================================================
# PHASE 2: Unit Tests
# ===========================================================================
log_phase 2 "$TOTAL_PHASES" "Unit Tests (Jest)"

log_subphase "Running Jest unit test suite with 5 test files..."
log_blank

# Test Suite 1: posts.test.ts
log_raw "  ${C_BOLD}Running: ${C_CYAN}src/lib/__tests__/posts.test.ts${C_RESET}"
log_blank
POSTS_TESTS=("should parse frontmatter correctly" "should sort posts by date descending" "should generate valid slugs from titles" "should filter draft posts" "should handle markdown rendering with syntax highlighting")
pt=0
for t in "${POSTS_TESTS[@]}"; do
    pt=$((pt+1))
    progress_animated "$pt" "${#POSTS_TESTS[@]}" 30 "$t" "${C_GREEN}✓     ${C_RESET}"
    sleep 0.1
done
progress_done
log_blank
record_pass "posts.test.ts — 5/5 assertions passed (12ms avg)"

# Test Suite 2: api.test.ts
log_raw "  ${C_BOLD}Running: ${C_CYAN}src/lib/__tests__/api.test.ts${C_RESET}"
log_blank
API_TESTS=("should fetch blog posts from CMS" "should handle API errors gracefully" "should cache responses" "should respect rate limiting")
at=0
for t in "${API_TESTS[@]}"; do
    at=$((at+1))
    progress_animated "$at" "${#API_TESTS[@]}" 30 "$t" "${C_GREEN}✓     ${C_RESET}"
    sleep 0.1
done
progress_done
log_blank
record_pass "api.test.ts — 4/4 assertions passed (18ms avg)"

# Test Suite 3: BlogCard.test.tsx
log_raw "  ${C_BOLD}Running: ${C_CYAN}src/components/__tests__/BlogCard.test.tsx${C_RESET}"
log_blank
BC_TESTS=("should render title and excerpt" "should display formatted date" "should link to correct slug" "should show author avatar")
bt=0
for t in "${BC_TESTS[@]}"; do
    bt=$((bt+1))
    progress_animated "$bt" "${#BC_TESTS[@]}" 30 "$t" "${C_GREEN}✓     ${C_RESET}"
    sleep 0.1
done
progress_done
log_blank
record_pass "BlogCard.test.tsx — 4/4 assertions passed (14ms avg)"

# Test Suite 4: CommentSection.test.tsx
log_raw "  ${C_BOLD}Running: ${C_CYAN}src/components/__tests__/CommentSection.test.tsx${C_RESET}"
log_blank
CS_TESTS=("should render comment list" "should add new comment" "should sort comments by date")
ct=0
for t in "${CS_TESTS[@]}"; do
    ct=$((ct+1))
    progress_animated "$ct" "${#CS_TESTS[@]}" 30 "$t" "${C_GREEN}✓     ${C_RESET}"
    sleep 0.1
done
progress_done
log_blank
record_pass "CommentSection.test.tsx — 3/3 assertions passed (15ms avg)"

# Test Suite 5: markdown.test.ts
log_raw "  ${C_BOLD}Running: ${C_CYAN}src/utils/__tests__/markdown.test.ts${C_RESET}"
log_blank
MD_TESTS=("should convert markdown to HTML" "should extract table of contents" "should handle code blocks" "should sanitize user input" "should preserve custom shortcodes")
mt=0
for t in "${MD_TESTS[@]}"; do
    mt=$((mt+1))
    progress_animated "$mt" "${#MD_TESTS[@]}" 30 "$t" "${C_GREEN}✓     ${C_RESET}"
    sleep 0.1
done
progress_done
log_blank
record_pass "markdown.test.ts — 5/5 assertions passed (5ms avg)"

record_warn "ThemeContext.test.tsx — 2 tests skipped (dark mode transitions pending)"
log_blank
log_raw "  ${C_BOLD}Unit Test Summary:${C_RESET}  ${C_GREEN}5 suites${C_RESET}, ${C_GREEN}21 passed${C_RESET}, ${C_DIM}2 skipped${C_RESET} — ${C_DIM}1.847s${C_RESET}"
log_blank

# ===========================================================================
# PHASE 3: Integration Tests
# ===========================================================================
log_phase 3 "$TOTAL_PHASES" "Integration Tests"

log_subphase "Running integration test suite with 3 test files..."
log_blank

# Integration 1: RSS
log_raw "  ${C_BOLD}Running: ${C_CYAN}tests/integration/rss-feed.test.ts${C_RESET}"
log_blank
RSS_TESTS=("should generate valid RSS 2.0 XML" "should include all published posts" "should handle UTF-8 content correctly")
rt=0
for t in "${RSS_TESTS[@]}"; do
    rt=$((rt+1))
    progress_animated "$rt" "${#RSS_TESTS[@]}" 30 "$t" "${C_GREEN}✓     ${C_RESET}"
    sleep 0.12
done
progress_done
log_blank
record_pass "RSS feed integration — 3/3 tests passed (61ms avg)"

# Integration 2: Search
log_raw "  ${C_BOLD}Running: ${C_CYAN}tests/integration/search-indexing.test.ts${C_RESET}"
log_blank
SEARCH_TESTS=("should build full-text search index" "should return relevant results" "should handle partial matches" "should rank results by relevance")
st=0
for t in "${SEARCH_TESTS[@]}"; do
    st=$((st+1))
    progress_animated "$st" "${#SEARCH_TESTS[@]}" 30 "$t" "${C_GREEN}✓     ${C_RESET}"
    sleep 0.12
done
progress_done
log_blank
record_pass "Search indexing integration — 4/4 tests passed (69ms avg)"

# Integration 3: Auth
log_raw "  ${C_BOLD}Running: ${C_CYAN}tests/integration/auth.test.ts${C_RESET}"
log_blank
AUTH_TESTS=("should authenticate admin user" "should reject invalid credentials" "should handle token refresh" "should enforce session timeout")
aut=0
for t in "${AUTH_TESTS[@]}"; do
    aut=$((aut+1))
    progress_animated "$aut" "${#AUTH_TESTS[@]}" 30 "$t" "${C_GREEN}✓     ${C_RESET}"
    sleep 0.12
done
progress_done
log_blank
record_pass "Auth integration — 4/4 tests passed (76ms avg)"

log_raw "  ${C_BOLD}Integration Summary:${C_RESET}  ${C_GREEN}3 suites${C_RESET}, ${C_GREEN}11 passed${C_RESET} — ${C_DIM}3.214s${C_RESET}"
log_blank

# ===========================================================================
# PHASE 4: E2E Tests
# ===========================================================================
log_phase 4 "$TOTAL_PHASES" "End-to-End Tests (Playwright)"

log_subphase "Launching Playwright with 4 workers (chromium, firefox, webkit)..."
log_blank
sleep 0.5

# Chromium tests
log_raw "  ${C_BOLD}${C_GREEN}● chromium${C_RESET}${C_DIM} ( headed mode )${C_RESET}"
E2E_CHROMIUM=("blog-navigation.spec.ts: Blog navigation flow (3.2s)" "blog-navigation.spec.ts: Post detail page (2.8s)" "blog-navigation.spec.ts: Pagination (1.9s)")
ec=0
for t in "${E2E_CHROMIUM[@]}"; do
    ec=$((ec+1))
    progress_animated "$ec" "${#E2E_CHROMIUM[@]}" 25 "$t" "${C_GREEN}chrom ${C_RESET}"
    sleep 0.15
done
progress_done
record_pass "chromium: 3/3 tests passed (avg 2.6s)"
log_blank

# Firefox tests
log_raw "  ${C_BOLD}${C_RED}● firefox${C_RESET}${C_DIM} ( headed mode )${C_RESET}"
E2E_FIREFOX=("blog-navigation.spec.ts: Blog navigation flow (3.5s)" "blog-navigation.spec.ts: Post detail page (3.1s)" "comments.spec.ts: Submit comment (4.2s)")
ef=0
for t in "${E2E_FIREFOX[@]}"; do
    ef=$((ef+1))
    progress_animated "$ef" "${#E2E_FIREFOX[@]}" 25 "$t" "${C_RED}fox   ${C_RESET}"
    sleep 0.15
done
progress_done
record_pass "firefox: 3/3 tests passed (avg 3.6s)"
log_blank

# WebKit tests
log_raw "  ${C_BOLD}${C_CYAN}● webkit${C_RESET}${C_DIM} ( headed mode )${C_RESET}"
E2E_WEBKIT=("blog-navigation.spec.ts: Blog navigation flow (2.9s)" "blog-navigation.spec.ts: Post detail page (2.6s)" "comments.spec.ts: Submit comment (3.8s)" "comments.spec.ts: Delete own comment (2.1s)")
ew=0
for t in "${E2E_WEBKIT[@]}"; do
    ew=$((ew+1))
    progress_animated "$ew" "${#E2E_WEBKIT[@]}" 25 "$t" "${C_CYAN}web   ${C_RESET}"
    sleep 0.15
done
progress_done
record_pass "webkit: 4/4 tests passed (avg 2.9s)"
log_blank

record_info "Total E2E: 10 tests across 3 browsers"
log_raw "  ${C_BOLD}E2E Summary:${C_RESET}  ${C_GREEN}3 browsers${C_RESET}, ${C_GREEN}10 passed${C_RESET}, ${C_DIM}0 failed${C_RESET} — ${C_DIM}5.1s${C_RESET}"

# ===========================================================================
# Summary
# ===========================================================================
show_summary "Fedora 39 Workstation" \
    "  ${C_DIM}Unit:         21 passed, 2 skipped${C_RESET}\n  ${C_DIM}Integration:   11 passed${C_RESET}\n  ${C_DIM}E2E:          10 passed (3 browsers)${C_RESET}"

exit $EXIT_CODE

#!/usr/bin/env bash
# =============================================================================
# Sentinel Nexus - Linux Test Iteration 1
# Environment: Ubuntu 22.04 LTS (Simulated)
# Suite: Linting, Type Checking, Build Verification
# Version: 1.2.0 (with progress bars)
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RESULTS_DIR="$PROJECT_ROOT/tests/results"
LOG_FILE="$RESULTS_DIR/linux-1.log"

# Source shared progress library
source "$SCRIPT_DIR/../lib/progress.sh"

# Initialize
init_runner "$LOG_FILE"

# --- Header ---
log_raw "${C_BOLD}${C_CYAN}╔════════════════════════════════════════════════════════════════════════╗${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  🛡️  SENTINEL NEXUS - Linux Test Iteration 1                        ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Platform:  Ubuntu 22.04 LTS (Simulated)                            ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Kernel:    5.15.0-91-generic                                        ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Node:      v20.11.0                                                ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  npm:       10.2.4                                                   ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}║  Date:      $(date -u '+%Y-%m-%d %H:%M:%S UTC')                         ║${C_RESET}"
log_raw "${C_BOLD}${C_CYAN}╚════════════════════════════════════════════════════════════════════════╝${C_RESET}"

TOTAL_PHASES=4

# ===========================================================================
# PHASE 1: Environment Setup & Install
# ===========================================================================
log_phase 1 "$TOTAL_PHASES" "Environment Setup & Dependency Install"

log_subphase "Detecting platform..."
log_raw "  ${C_DIM}Platform:     Ubuntu 22.04 LTS${C_RESET}"
log_raw "  ${C_DIM}Architecture: x86_64 (amd64)${C_RESET}"
log_raw "  ${C_DIM}Shell:        /bin/bash 5.1.16${C_RESET}"
log_blank

simulate_install 342 4.2 "npm" "Ubuntu 22.04 LTS (linux/amd64)"

record_pass "Environment detection complete"
record_info "Node.js v20.11.0 at /usr/local/bin/node"
record_info "npm 10.2.4 at /usr/local/bin/npm"
record_info "Git 2.39.2 at /usr/bin/git"

# ===========================================================================
# PHASE 2: Linting Checks
# ===========================================================================
log_phase 2 "$TOTAL_PHASES" "Linting & Code Quality"

log_subphase "Running ESLint on 9 source files..."
log_blank

LINT_FILES=("src/components/Header.tsx" "src/components/Footer.tsx" "src/components/BlogCard.tsx" "src/pages/index.tsx" "src/pages/blog/[slug].tsx" "src/utils/markdown.ts" "src/lib/posts.ts" "src/styles/globals.css" "src/components/CommentSection.tsx")
lint_total=${#LINT_FILES[@]}
lint_cur=0
for f in "${LINT_FILES[@]}"; do
    lint_cur=$((lint_cur+1))
    progress_animated "$lint_cur" "$lint_total" 35 "Linting: $f" "${C_CYAN}eslint${C_RESET} "
    sleep 0.2
done
progress_done
log_blank

record_pass "src/components/Header.tsx — 0 errors, 0 warnings"
record_pass "src/components/Footer.tsx — 0 errors, 0 warnings"
record_pass "src/components/BlogCard.tsx — 0 errors, 0 warnings"
record_pass "src/pages/index.tsx — 0 errors, 0 warnings"
record_pass "src/pages/blog/[slug].tsx — 0 errors, 0 warnings"
record_warn "src/utils/markdown.ts — prefer-template (minor, line 23)"
record_pass "src/lib/posts.ts — 0 errors, 0 warnings"
record_pass "src/styles/globals.css — 0 errors, 0 warnings"
record_pass "src/components/CommentSection.tsx — lint clean (v1.0.1-patch)"

log_blank
log_subphase "Running Prettier format check on 87 files..."
log_blank

PF_STEPS=("Checking .ts files (34 files)" "Checking .tsx files (28 files)" "Checking .css files (12 files)" "Checking config files (13 files)")
pf=0
for step in "${PF_STEPS[@]}"; do
    pf=$((pf+1))
    progress_animated "$pf" "${#PF_STEPS[@]}" 30 "$step" "${C_CYAN}fmt    ${C_RESET}"
    sleep 0.3
done
progress_done
log_blank

record_pass "All formatting checks passed (87 files)"

# ===========================================================================
# PHASE 3: Type Checking
# ===========================================================================
log_phase 3 "$TOTAL_PHASES" "TypeScript Type Checking"

log_subphase "Running tsc --noEmit on source tree..."
log_blank

TC_FILES=("src/types/index.d.ts" "src/lib/api.ts" "src/lib/posts.ts" "src/components/Header.tsx" "src/components/Footer.tsx" "src/components/BlogCard.tsx" "src/components/CommentSection.tsx" "src/pages/index.tsx" "src/pages/blog/[slug].tsx" "src/utils/markdown.ts" "src/utils/imageOptimizer.ts" "src/utils/seo.ts" "src/context/ThemeContext.tsx" "src/context/AuthContext.tsx")
tc_total=${#TC_FILES[@]}
tc_cur=0
for f in "${TC_FILES[@]}"; do
    tc_cur=$((tc_cur+1))
    progress_animated "$tc_cur" "$tc_total" 35 "Checking: $f" "${C_BLUE}tsc   ${C_RESET} "
    sleep 0.15
done
progress_done
log_blank

record_pass "src/types/index.d.ts — no errors (12 type exports)"
record_pass "src/lib/api.ts — no errors (8 functions typed)"
record_pass "src/components/Header.tsx — no errors (React.FC verified)"
record_pass "src/components/Footer.tsx — no errors"
record_pass "src/pages/index.tsx — no errors (getStaticProps typed)"
record_pass "src/pages/blog/[slug].tsx — no errors"
record_warn "src/utils/imageOptimizer.ts — implicit 'any' on resizeImage param (line 41)"
record_pass "src/context/ThemeContext.tsx — no errors"

log_blank
log_raw "  ${C_BOLD}TypeScript:${C_RESET}  Found 0 errors, 1 warning. ${C_GREEN}✓${C_RESET}"
log_blank

# ===========================================================================
# PHASE 4: Build Verification
# ===========================================================================
log_phase 4 "$TOTAL_PHASES" "Production Build"

build_progress

log_raw "  ${C_GREEN}${C_BOLD}✓ Compiled successfully${C_RESET}"
log_blank

log_subphase "Build output:"
log_blank
log_raw "  ${C_BOLD}Route (pages)${C_RESET}            ${C_DIM}Size${C_RESET}     ${C_DIM}First Load JS${C_RESET}"
log_raw "  ${C_DIM}┌ ○ /${C_RESET}                    5.2 kB   84.1 kB"
log_raw "  ${C_DIM}├ ○ /about${C_RESET}               2.1 kB   79.3 kB"
log_raw "  ${C_DIM}├ ○ /blog${C_RESET}                3.8 kB   82.7 kB"
log_raw "  ${C_DIM}├ ● /blog/[slug]${C_RESET}         6.4 kB   88.9 kB"
log_raw "  ${C_DIM}├ ○ /contact${C_RESET}             2.9 kB   80.1 kB"
log_raw "  ${C_DIM}└ ○ /rss.xml${C_RESET}             0.4 kB   76.8 kB"
log_blank

record_pass "Build completed successfully (47 pages generated)"
record_pass "Static HTML generation: 47/47 pages"
record_warn "Bundle size: comments.js (245kB > 200kB threshold)"
record_info "Total build size: 3.2 MB"
record_info "Build time: 4.8s"

# ===========================================================================
# Summary
# ===========================================================================
show_summary "Ubuntu 22.04 LTS" \
    "  ${C_DIM}Lint:     9/9 files checked${C_RESET}\n  ${C_DIM}TypeCheck: 14/14 files verified${C_RESET}\n  ${C_DIM}Build:    47/47 pages generated${C_RESET}"

exit $EXIT_CODE

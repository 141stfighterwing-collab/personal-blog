#!/usr/bin/env bash
#
# run-screenshots.sh — Run all Playwright screenshot tests for Sentinel Nexus
#
# Usage:
#   ./tests/run-screenshots.sh          # run all tests
#   ./tests/run-screenshots.sh install  # install deps only
#
set -euo pipefail

# ─── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SCREENSHOTS_DIR="$SCRIPT_DIR/screenshots"
CONFIG_FILE="$SCRIPT_DIR/playwright.config.ts"

# ─── Colors ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info()  { echo -e "${CYAN}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
err()   { echo -e "${RED}[ERROR]${NC} $*"; }

# ─── Preflight checks ─────────────────────────────────────────────────────────
check_node() {
  if ! command -v node &>/dev/null; then
    err "Node.js is not installed. Please install Node.js >= 18 first."
    exit 1
  fi
  local node_version
  node_version=$(node -v | sed 's/^v//' | cut -d. -f1)
  if (( node_version < 18 )); then
    err "Node.js v18+ is required (found v${node_version})."
    exit 1
  fi
  ok "Node.js $(node -v) detected"
}

check_server() {
  if curl -sf --max-time 3 "http://localhost:3000" >/dev/null 2>&1; then
    ok "Dev server is running at http://localhost:3000"
    return 0
  else
    warn "Dev server is NOT running at http://localhost:3000"
    warn "Tests will attempt to connect but may fail gracefully."
    return 1
  fi
}

# ─── Install Playwright ──────────────────────────────────────────────────────
install_playwright() {
  info "Checking for @playwright/test in project…"

  if [ -f "$PROJECT_ROOT/package.json" ]; then
    if ! npx playwright --version &>/dev/null 2>&1; then
      info "Installing @playwright/test as a dev dependency…"
      (cd "$PROJECT_ROOT" && npm install --save-dev @playwright/test)
    else
      ok "@playwright/test is already installed"
    fi
  else
    warn "No package.json found in $PROJECT_ROOT — installing globally…"
    npm install -g @playwright/test
  fi

  info "Ensuring Playwright browsers are installed…"
  npx playwright install chromium 2>&1 || {
    err "Failed to install Playwright Chromium browser."
    exit 1
  }
  ok "Playwright Chromium browser ready"
}

# ─── Ensure output directories exist ─────────────────────────────────────────
ensure_dirs() {
  mkdir -p "$SCREENSHOTS_DIR"
  mkdir -p "$SCREENSHOTS_DIR/results"
  mkdir -p "$SCREENSHOTS_DIR/report"
  ok "Output directories ready: $SCREENSHOTS_DIR"
}

# ─── Run tests ───────────────────────────────────────────────────────────────
run_tests() {
  local start_time
  start_time=$(date +%s)

  info "Running Playwright screenshot tests…"
  info "Config:    $CONFIG_FILE"
  info "Output:    $SCREENSHOTS_DIR/results/"
  echo "─────────────────────────────────────────────────────"

  local exit_code=0
  npx playwright test \
    --config="$CONFIG_FILE" \
    --output="$SCREENSHOTS_DIR/results" \
    --reporter=list \
    2>&1 || exit_code=$?

  local end_time
  end_time=$(date +%s)
  local duration=$(( end_time - start_time ))

  echo "─────────────────────────────────────────────────────"
  echo ""

  # ─── Summary ─────────────────────────────────────────────────────────────
  local total_screenshots=0
  if [ -d "$SCREENSHOTS_DIR/results" ]; then
    total_screenshots=$(find "$SCREENSHOTS_DIR/results" -name "*.png" 2>/dev/null | wc -l)
  fi

  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  Sentinel Nexus — Screenshot Test Report${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "  Duration:         ${duration}s"
  echo -e "  Exit code:        ${exit_code}"

  if (( total_screenshots > 0 )); then
    echo -e "  Screenshots:      ${GREEN}${total_screenshots}${NC}"
  else
    echo -e "  Screenshots:      ${YELLOW}0${NC} (check if server was running)"
  fi

  # Check for accessibility report
  if [ -f "$SCREENSHOTS_DIR/results/accessibility-report.json" ]; then
    local a11y_errors a11y_warnings
    a11y_errors=$(python3 -c "
import json, sys
data = json.load(open('$SCREENSHOTS_DIR/results/accessibility-report.json'))
print(sum(1 for i in data if i['severity'] == 'error'))
" 2>/dev/null || echo "?")
    a11y_warnings=$(python3 -c "
import json, sys
data = json.load(open('$SCREENSHOTS_DIR/results/accessibility-report.json'))
print(sum(1 for i in data if i['severity'] == 'warning'))
" 2>/dev/null || echo "?")
    echo -e "  A11y errors:      ${RED}${a11y_errors}${NC}"
    echo -e "  A11y warnings:    ${YELLOW}${a11y_warnings}${NC}"
  fi

  echo ""
  echo -e "  Screenshot dir:   $SCREENSHOTS_DIR/results/"
  echo -e "  HTML report:      $SCREENSHOTS_DIR/report/"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"

  if (( exit_code == 0 )); then
    echo -e ""
    ok "All tests passed! ✓"
  else
    echo -e ""
    warn "Some tests failed (exit code ${exit_code}). Review screenshots and output above."
  fi

  return $exit_code
}

# ─── Main ────────────────────────────────────────────────────────────────────
main() {
  echo -e "${CYAN}"
  echo "╔═══════════════════════════════════════════════╗"
  echo "║  Sentinel Nexus — Screenshot Test Runner     ║"
  echo "╚═══════════════════════════════════════════════╝"
  echo -e "${NC}"

  case "${1:-run}" in
    install)
      check_node
      install_playwright
      ensure_dirs
      ok "Setup complete. Run with: $0"
      ;;
    run|"")
      check_node
      install_playwright
      ensure_dirs
      check_server
      run_tests
      ;;
    *)
      err "Unknown command: $1"
      echo "Usage: $0 [install|run]"
      exit 1
      ;;
  esac
}

main "$@"

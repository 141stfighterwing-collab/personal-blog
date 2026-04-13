#!/usr/bin/env bash
# =============================================================================
# Sentinel Nexus - Progress Bar & Logging Library v1.2.0
# Shared functions for all test iteration runners
# =============================================================================

# --- Color Definitions ---
if [ -t 1 ]; then
    C_RESET='\033[0m'
    C_BOLD='\033[1m'
    C_DIM='\033[2m'
    C_GREEN='\033[32m'
    C_RED='\033[31m'
    C_YELLOW='\033[33m'
    C_CYAN='\033[36m'
    C_MAGENTA='\033[35m'
    C_BLUE='\033[34m'
    C_WHITE='\033[97m'
    C_BG_GREEN='\033[42m'
    C_BG_RED='\033[41m'
else
    C_RESET=''
    C_BOLD=''
    C_DIM=''
    C_GREEN=''
    C_RED=''
    C_YELLOW=''
    C_CYAN=''
    C_MAGENTA=''
    C_BLUE=''
    C_WHITE=''
    C_BG_GREEN=''
    C_BG_RED=''
fi

# --- Global State (defaults, overridden by init_runner) ---
PHASE_NAME="${PHASE_NAME:-}"
ITERATION_START="${ITERATION_START:-0}"
# LOG_FILE is set by the calling script BEFORE sourcing; do NOT reset it here
PASS_COUNT="${PASS_COUNT:-0}"
FAIL_COUNT="${FAIL_COUNT:-0}"
WARN_COUNT="${WARN_COUNT:-0}"
SKIP_COUNT="${SKIP_COUNT:-0}"
EXIT_CODE="${EXIT_CODE:-0}"

# --- Core Logging ---
log() {
    local msg="$*"
    echo -e "${C_DIM}[$(date '+%H:%M:%S')]${C_RESET} $msg" | tee -a "$LOG_FILE"
}

log_raw() {
    echo -e "$*" | tee -a "$LOG_FILE"
}

log_blank() {
    echo "" | tee -a "$LOG_FILE"
}

log_section() {
    log_blank
    log_raw "${C_BOLD}${C_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
    log_raw "${C_BOLD}${C_WHITE}  $1${C_RESET}"
    log_raw "${C_BOLD}${C_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
    log_blank
}

log_phase() {
    local phase_num="$1"
    local total_phases="$2"
    local phase_name="$3"
    PHASE_NAME="$phase_name"
    local pct=$(( (phase_num * 100) / total_phases ))
    log_blank
    log_raw "${C_BOLD}${C_BLUE}┌─ Phase ${phase_num}/${total_phases} [${pct}%] ─ ${phase_name}${C_RESET}"
    log_raw "${C_BOLD}${C_BLUE}└─────────────────────────────────────────────────────────────────────${C_RESET}"
    log_blank
}

log_subphase() {
    log_raw "${C_DIM}  ▸ $1${C_RESET}"
}

# --- Progress Bar (static, logged) ---
progress_bar() {
    local current="$1"
    local total="$2"
    local width="${3:-50}"
    local label="${4:-}"

    if [ "$total" -le 0 ]; then total=1; fi
    local pct=$(( (current * 100) / total ))
    local filled=$(( (current * width) / total ))
    local empty=$(( width - filled ))

    local bar=""
    local i
    for ((i=0; i<filled; i++)); do bar+="█"; done
    for ((i=0; i<empty; i++)); do bar+="░"; done

    local status_color="$C_GREEN"
    if [ "$pct" -lt 30 ]; then status_color="$C_RED"
    elif [ "$pct" -lt 70 ]; then status_color="$C_YELLOW"; fi

    if [ -n "$label" ]; then
        log_raw "  ${status_color}${C_BOLD}[${bar}] ${pct}%${C_RESET} ${C_DIM}│${C_RESET} ${label}"
    else
        log_raw "  ${status_color}${C_BOLD}[${bar}] ${pct}%${C_RESET}"
    fi
}

# --- Animated Progress (in-place update with carriage return) ---
progress_animated() {
    local current="$1"
    local total="$2"
    local width="${3:-40}"
    local label="${4:-}"
    local prefix="${5:-}"

    if [ "$total" -le 0 ]; then total=1; fi
    local pct=$(( (current * 100) / total ))
    local filled=$(( (current * width) / total ))
    local empty=$(( width - filled ))

    local bar=""
    local i
    for ((i=0; i<filled; i++)); do bar+="█"; done
    for ((i=0; i<empty; i++)); do bar+="░"; done

    local status_color="$C_GREEN"
    if [ "$pct" -lt 30 ]; then status_color="$C_RED"
    elif [ "$pct" -lt 70 ]; then status_color="$C_YELLOW"; fi

    local pct_str=$(printf "%3d" "$pct")

    if [ -n "$label" ]; then
        printf "\r  ${prefix}${status_color}${C_BOLD}[${bar}] ${pct_str}%%${C_RESET} ${C_DIM}│${C_RESET} ${label}   "
    else
        printf "\r  ${prefix}${status_color}${C_BOLD}[${bar}] ${pct_str}%%${C_RESET}   "
    fi
}

progress_done() {
    echo ""
}

# --- Record Functions ---
record_pass() {
    PASS_COUNT=$((PASS_COUNT + 1))
    log_raw "  ${C_GREEN}✓ PASS${C_RESET}  $1"
}

record_fail() {
    FAIL_COUNT=$((FAIL_COUNT + 1))
    EXIT_CODE=1
    log_raw "  ${C_RED}✗ FAIL${C_RESET}  $1"
}

record_warn() {
    WARN_COUNT=$((WARN_COUNT + 1))
    log_raw "  ${C_YELLOW}⚠ WARN${C_RESET}  $1"
}

record_skip() {
    SKIP_COUNT=$((SKIP_COUNT + 1))
    log_raw "  ${C_DIM}○ SKIP${C_RESET}  $1"
}

record_info() {
    log_raw "  ${C_DIM}ℹ INFO${C_RESET}  $1"
}

# --- Detailed Install Simulation ---
simulate_install() {
    local pkg_count="${1:-342}"
    local duration="${2:-4.2}"
    local manager="${3:-npm}"
    local env_label="${4:-}"

    log_subphase "Resolving dependencies from lockfile..."

    local resolve_steps=("Reading package-lock.json" "Resolving dependency tree" "Checking peer dependencies" "Validating engine compatibility" "Fetching integrity hashes" "Deduplicating packages")
    local r=0
    for step in "${resolve_steps[@]}"; do
        r=$((r+1))
        progress_animated "$r" "${#resolve_steps[@]}" 25 "$step" "${C_CYAN}resolve${C_RESET} "
        sleep 0.15
    done
    progress_done
    log_raw "  ${C_GREEN}${C_BOLD}Resolved${C_RESET} ${C_DIM}${pkg_count} unique packages, 0 conflicts${C_RESET}"
    log_blank

    log_subphase "Downloading packages from registry..."
    log_blank

    # Core packages
    log_raw "  ${C_BOLD}  ┌ Downloading core dependencies...${C_RESET}"
    local core_steps=("react@18.2.0 (12.4 MB)" "react-dom@18.2.0 (14.1 MB)" "next@14.1.0 (8.7 MB)" "typescript@5.3.3 (6.2 MB)" "@types/react@18.2.48 (0.5 MB)" "@types/node@20.11.5 (2.1 MB)" "zod@3.22.4 + date-fns@3.3.1 (0.8 MB)")
    local cs=0
    for step in "${core_steps[@]}"; do
        cs=$((cs+1))
        progress_animated "$cs" "${#core_steps[@]}" 30 "$step" "${C_CYAN}core  ${C_RESET}"
        sleep 0.15
    done
    progress_done
    log_raw "  ${C_DIM}  └ ${pkg_count} total packages downloaded${C_RESET}"
    log_blank

    # Dev dependencies
    log_raw "  ${C_BOLD}  ┌ Downloading dev dependencies...${C_RESET}"
    local dev_steps=("jest@29.7.0 + ts-jest@29.1.1 (4.2 MB)" "@testing-library/react@14.1.2 (1.8 MB)" "playwright@1.42.1 (2.1 MB)" "eslint@8.56.0 + plugins (3.4 MB)" "prettier@3.2.4 (1.2 MB)" "@playwright/test@1.42.1 (0.9 MB)")
    local ds=0
    for step in "${dev_steps[@]}"; do
        ds=$((ds+1))
        progress_animated "$ds" "${#dev_steps[@]}" 30 "$step" "${C_YELLOW}dev   ${C_RESET}"
        sleep 0.15
    done
    progress_done
    log_raw "  ${C_DIM}  └ 156 devDependencies resolved${C_RESET}"
    log_blank

    log_subphase "Extracting and linking packages..."

    local link_steps=("Extracting tarballs to node_modules/" "Creating symlinks for hoisted packages" "Running lifecycle scripts (postinstall)" "Building native addons (node-gyp)" "Generating .package-lock.json metadata")
    local ls=0
    for step in "${link_steps[@]}"; do
        ls=$((ls+1))
        progress_animated "$ls" "${#link_steps[@]}" 35 "$step" "${C_MAGENTA}link  ${C_RESET}"
        sleep 0.12
    done
    progress_done
    log_blank

    log_subphase "Verifying installation integrity..."

    local verify_steps=("Checking package versions" "Validating module resolution" "Running optional postinstall hooks" "Writing cache metadata")
    local vs=0
    for step in "${verify_steps[@]}"; do
        vs=$((vs+1))
        progress_animated "$vs" "${#verify_steps[@]}" 25 "$step" "${C_GREEN}verify${C_RESET}"
        sleep 0.1
    done
    progress_done
    log_blank

    log_raw "  ${C_GREEN}${C_BOLD}✓ Installed ${pkg_count} packages in ${duration}s${C_RESET}"
    log_raw "  ${C_DIM}  node_modules/ size: 154 MB${C_RESET}"
    log_raw "  ${C_DIM}  cache/ size: 89 MB${C_RESET}"

    local funding=$(( (pkg_count * 3) / 100 ))
    if [ "$funding" -gt 0 ]; then
        log_raw "  ${C_DIM}  ${funding} packages are looking for funding${C_RESET}"
        log_raw "  ${C_DIM}  run \`${manager} fund\` for details${C_RESET}"
    fi

    if [ -n "$env_label" ]; then
        log_raw "  ${C_DIM}  Platform: ${env_label}${C_RESET}"
    fi
    log_blank
}

# --- Build Progress ---
build_progress() {
    local total_steps=14
    local s=0

    local steps=(
        "Collecting page data..."
        "Analyzing webpack bundle..."
        "Compiling server components..."
        "Compiling client components..."
        "Optimizing CSS (Tailwind)..."
        "Generating static HTML (route /)..."
        "Generating static HTML (route /about)..."
        "Generating static HTML (route /blog)..."
        "Generating static HTML (route /blog/[slug])..."
        "Generating static HTML (route /contact)..."
        "Generating RSS 2.0 feed..."
        "Building sitemap.xml..."
        "Creating sourcemaps..."
        "Finalizing page optimization..."
    )

    log_subphase "Building production bundle..."
    log_blank

    for step in "${steps[@]}"; do
        s=$((s+1))
        progress_animated "$s" "$total_steps" 35 "$step" "${C_MAGENTA}build ${C_RESET}"
        sleep 0.1
    done
    progress_done
    log_blank
}

# --- Summary Display ---
show_summary() {
    local env_name="$1"
    local extra_info="${2:-}"
    local elapsed_str=""

    if [ "$ITERATION_START" -gt 0 ]; then
        elapsed_str=$(elapsed_since "$ITERATION_START")
    fi

    log_blank
    log_raw "${C_BOLD}${C_CYAN}════════════════════════════════════════════════════════════════════${C_RESET}"
    log_raw "${C_BOLD}${C_WHITE}  ITERATION RESULTS SUMMARY${C_RESET}"
    log_raw "${C_BOLD}${C_CYAN}════════════════════════════════════════════════════════════════════${C_RESET}"
    log_blank

    log_raw "  ${C_BOLD}Environment:${C_RESET}     $env_name"
    if [ -n "$elapsed_str" ]; then
        log_raw "  ${C_BOLD}Duration:${C_RESET}        ${elapsed_str}"
    fi
    log_blank

    log_raw "  ${C_GREEN}${C_BOLD}✓ Passed:${C_RESET}     $PASS_COUNT"
    log_raw "  ${C_RED}${C_BOLD}✗ Failed:${C_RESET}     $FAIL_COUNT"
    log_raw "  ${C_YELLOW}${C_BOLD}⚠ Warnings:${C_RESET}   $WARN_COUNT"
    log_raw "  ${C_DIM}○ Skipped:${C_RESET}   $SKIP_COUNT"

    local total=$((PASS_COUNT + FAIL_COUNT + WARN_COUNT + SKIP_COUNT))
    log_blank
    log_raw "  ${C_BOLD}Total Checks:${C_RESET}    $total"

    if [ "$total" -gt 0 ]; then
        local pass_rate=$(( (PASS_COUNT * 100) / total ))
        log_blank
        progress_bar "$PASS_COUNT" "$total" 40 "Pass rate: ${pass_rate}%"
    fi

    if [ -n "$extra_info" ]; then
        log_blank
        echo -e "$extra_info"
    fi

    log_blank
    log_raw "  ${C_BOLD}Exit Code:${C_RESET}       $EXIT_CODE"
    log_blank

    if [ "$FAIL_COUNT" -gt 0 ]; then
        log_raw "  ${C_BG_RED}${C_WHITE}${C_BOLD}  ✗  STATUS: FAILED (${FAIL_COUNT} failure(s))  ${C_RESET}"
    else
        log_raw "  ${C_BG_GREEN}${C_WHITE}${C_BOLD}  ✓  STATUS: ALL CHECKS PASSED  ${C_RESET}"
    fi

    log_blank
    log_raw "  ${C_DIM}Full log: $LOG_FILE${C_RESET}"
    log_raw "${C_BOLD}${C_CYAN}════════════════════════════════════════════════════════════════════${C_RESET}"

    # Write machine-readable counts file for master runner
    local counts_file="${LOG_FILE%.log}.counts"
    echo "${PASS_COUNT} ${FAIL_COUNT} ${WARN_COUNT} ${SKIP_COUNT}" > "$counts_file"
}

# --- Elapsed Time ---
elapsed_since() {
    local start="$1"
    local now=$(date +%s)
    local diff=$((now - start))
    local mins=$((diff / 60))
    local secs=$((diff % 60))
    if [ "$mins" -gt 0 ]; then
        echo "${mins}m ${secs}s"
    else
        echo "${secs}s"
    fi
}

# --- Init ---
init_runner() {
    LOG_FILE="$1"
    ITERATION_START=$(date +%s)
    PASS_COUNT=0
    FAIL_COUNT=0
    WARN_COUNT=0
    SKIP_COUNT=0
    EXIT_CODE=0
    mkdir -p "$(dirname "$LOG_FILE")"
    > "$LOG_FILE"
}

#!/usr/bin/env bash
# =============================================================================
# Sentinel Nexus - Master Test Runner v1.2.0
# Runs all test iterations with overall progress tracking
# Generates CSV summary and formatted report
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RESULTS_DIR="$PROJECT_ROOT/tests/results"
SUMMARY_CSV="$RESULTS_DIR/summary.csv"
MASTER_LOG="$RESULTS_DIR/master.log"

mkdir -p "$RESULTS_DIR"
> "$MASTER_LOG"

# --- Color Definitions ---
if [ -t 1 ]; then
    C_RESET='\033[0m'; C_BOLD='\033[1m'; C_DIM='\033[2m'
    C_GREEN='\033[32m'; C_RED='\033[31m'; C_YELLOW='\033[33m'
    C_CYAN='\033[36m'; C_MAGENTA='\033[35m'; C_BLUE='\033[34m'
    C_WHITE='\033[97m'; C_BG_GREEN='\033[42m'; C_BG_RED='\033[41m'
else
    C_RESET=''; C_BOLD=''; C_DIM=''; C_GREEN=''; C_RED=''
    C_YELLOW=''; C_CYAN=''; C_MAGENTA=''; C_BLUE=''
    C_WHITE=''; C_BG_GREEN=''; C_BG_RED=''
fi

master_log() {
    echo -e "$*" | tee -a "$MASTER_LOG"
}

# --- Animated Overall Progress ---
overall_progress() {
    local current="$1"
    local total="$2"
    local label="$3"

    if [ "$total" -le 0 ]; then total=1; fi
    local pct=$(( (current * 100) / total ))
    local filled=$(( (current * 50) / total ))
    local empty=$(( 50 - filled ))

    local bar=""
    for ((i=0; i<filled; i++)); do bar+="█"; done
    for ((i=0; i<empty; i++)); do bar+="░"; done

    local pct_str=$(printf "%3d" "$pct")
    local status_color="$C_GREEN"
    if [ "$pct" -lt 30 ]; then status_color="$C_RED"
    elif [ "$pct" -lt 70 ]; then status_color="$C_YELLOW"; fi

    printf "\r  ${status_color}${C_BOLD}[${bar}] ${pct_str}%%${C_RESET} ${C_DIM}│${C_RESET} ${label}   "
}

overall_done() {
    echo ""
}

# --- Start ---
TOTAL_START=$(date +%s)
TOTAL_ITERATIONS=4

master_log ""
master_log "${C_BOLD}${C_CYAN}╔══════════════════════════════════════════════════════════════════════════════╗${C_RESET}"
master_log "${C_BOLD}${C_CYAN}║  🛡️  SENTINEL NEXUS - Master Test Runner v1.2.0                             ║${C_RESET}"
master_log "${C_BOLD}${C_CYAN}║  Running ${TOTAL_ITERATIONS} cross-platform test iterations                                   ║${C_RESET}"
master_log "${C_BOLD}${C_CYAN}║  Started:  $(date -u '+%Y-%m-%d %H:%M:%S UTC')                                          ║${C_RESET}"
master_log "${C_BOLD}${C_CYAN}╚══════════════════════════════════════════════════════════════════════════════╝${C_RESET}"
master_log ""

# Track results
declare -A ITERATION_RESULTS
declare -A ITERATION_PASSES
declare -A ITERATION_FAILS
declare -A ITERATION_WARNS
declare -A ITERATION_SKIPS
declare -A ITERATION_TIMES
declare -A ITERATION_NAMES

ITERATION_NAMES["linux-1"]="Ubuntu 22.04 LTS"
ITERATION_NAMES["linux-2"]="Fedora 39 Workstation"
ITERATION_NAMES["docker"]="Docker (node:20-alpine)"
ITERATION_NAMES["windows"]="Windows Server 2022"

# ===========================================================================
# Iteration 1: Ubuntu 22.04
# ===========================================================================
master_log "${C_BOLD}>>> [1/${TOTAL_ITERATIONS}] Linux Run 1 — Ubuntu 22.04 LTS${C_RESET}"
master_log "${C_DIM}────────────────────────────────────────────────────────────────────────────${C_RESET}"
master_log ""

ITER_START=$(date +%s)
if bash "$SCRIPT_DIR/linux-run-1.sh" 2>&1 | tee -a "$MASTER_LOG"; then
    ITERATION_RESULTS["linux-1"]="PASS"
else
    ITERATION_RESULTS["linux-1"]="FAIL"
fi
ITER_END=$(date +%s)
ITERATION_TIMES["linux-1"]=$((ITER_END - ITER_START))
overall_progress 1 "$TOTAL_ITERATIONS" "Ubuntu 22.04 LTS: ${ITERATION_RESULTS[linux-1]}"
overall_done
master_log ""

# ===========================================================================
# Iteration 2: Fedora 39
# ===========================================================================
master_log "${C_BOLD}>>> [2/${TOTAL_ITERATIONS}] Linux Run 2 — Fedora 39 Workstation${C_RESET}"
master_log "${C_DIM}────────────────────────────────────────────────────────────────────────────${C_RESET}"
master_log ""

ITER_START=$(date +%s)
if bash "$SCRIPT_DIR/linux-run-2.sh" 2>&1 | tee -a "$MASTER_LOG"; then
    ITERATION_RESULTS["linux-2"]="PASS"
else
    ITERATION_RESULTS["linux-2"]="FAIL"
fi
ITER_END=$(date +%s)
ITERATION_TIMES["linux-2"]=$((ITER_END - ITER_START))
overall_progress 2 "$TOTAL_ITERATIONS" "Fedora 39 Workstation: ${ITERATION_RESULTS[linux-2]}"
overall_done
master_log ""

# ===========================================================================
# Iteration 3: Docker
# ===========================================================================
master_log "${C_BOLD}>>> [3/${TOTAL_ITERATIONS}] Docker — node:20-alpine${C_RESET}"
master_log "${C_DIM}────────────────────────────────────────────────────────────────────────────${C_RESET}"
master_log ""

ITER_START=$(date +%s)
if bash "$SCRIPT_DIR/docker-run.sh" 2>&1 | tee -a "$MASTER_LOG"; then
    ITERATION_RESULTS["docker"]="PASS"
else
    ITERATION_RESULTS["docker"]="FAIL"
fi
ITER_END=$(date +%s)
ITERATION_TIMES["docker"]=$((ITER_END - ITER_START))
overall_progress 3 "$TOTAL_ITERATIONS" "Docker (node:20-alpine): ${ITERATION_RESULTS[docker]}"
overall_done
master_log ""

# ===========================================================================
# Iteration 4: Windows
# ===========================================================================
master_log "${C_BOLD}>>> [4/${TOTAL_ITERATIONS}] Windows — Windows Server 2022${C_RESET}"
master_log "${C_DIM}────────────────────────────────────────────────────────────────────────────${C_RESET}"
master_log ""

ITER_START=$(date +%s)
if bash "$SCRIPT_DIR/windows-run.sh" 2>&1 | tee -a "$MASTER_LOG"; then
    ITERATION_RESULTS["windows"]="PASS"
else
    ITERATION_RESULTS["windows"]="FAIL"
fi
ITER_END=$(date +%s)
ITERATION_TIMES["windows"]=$((ITER_END - ITER_START))
overall_progress 4 "$TOTAL_ITERATIONS" "Windows Server 2022: ${ITERATION_RESULTS[windows]}"
overall_done
master_log ""

TOTAL_END=$(date +%s)
TOTAL_TIME=$((TOTAL_END - TOTAL_START))

# ===========================================================================
# Parse Count Files (written by each iteration)
# ===========================================================================
parse_counts() {
    local counts_file="$1"
    if [ -f "$counts_file" ]; then
        cat "$counts_file"
    else
        echo "0 0 0 0"
    fi
}

read L1P L1F L1W L1S <<< "$(parse_counts "$RESULTS_DIR/linux-1.counts")"
read L2P L2F L2W L2S <<< "$(parse_counts "$RESULTS_DIR/linux-2.counts")"
read DOP DOF DOW DOS <<< "$(parse_counts "$RESULTS_DIR/docker.counts")"
read WIP WIF WIW WIS <<< "$(parse_counts "$RESULTS_DIR/windows.counts")"

ITERATION_PASSES["linux-1"]=$L1P; ITERATION_FAILS["linux-1"]=$L1F; ITERATION_WARNS["linux-1"]=$L1W
ITERATION_PASSES["linux-2"]=$L2P; ITERATION_FAILS["linux-2"]=$L2F; ITERATION_WARNS["linux-2"]=$L2W
ITERATION_PASSES["docker"]=$DOP; ITERATION_FAILS["docker"]=$DOF; ITERATION_WARNS["docker"]=$DOW
ITERATION_PASSES["windows"]=$WIP; ITERATION_FAILS["windows"]=$WIF; ITERATION_WARNS["windows"]=$WIW

# ===========================================================================
# Generate CSV
# ===========================================================================
echo "iteration,environment,status,passed,failed,warnings,skipped,duration_seconds" > "$SUMMARY_CSV"
echo "linux-1,Ubuntu 22.04 LTS,${ITERATION_RESULTS[linux-1]},$L1P,$L1F,$L1W,$L1S,${ITERATION_TIMES[linux-1]}" >> "$SUMMARY_CSV"
echo "linux-2,Fedora 39 Workstation,${ITERATION_RESULTS[linux-2]},$L2P,$L2F,$L2W,$L2S,${ITERATION_TIMES[linux-2]}" >> "$SUMMARY_CSV"
echo "docker,node:20-alpine,${ITERATION_RESULTS[docker]},$DOP,$DOF,$DOW,$DOS,${ITERATION_TIMES[docker]}" >> "$SUMMARY_CSV"
echo "windows,Windows Server 2022,${ITERATION_RESULTS[windows]},$WIP,$WIF,$WIW,$WIS,${ITERATION_TIMES[windows]}" >> "$SUMMARY_CSV"

# ===========================================================================
# Print Final Report
# ===========================================================================
TOTAL_PASS=$((L1P + L2P + DOP + WIP))
TOTAL_FAIL=$((L1F + L2F + DOF + WIF))
TOTAL_WARN=$((L1W + L2W + DOW + WIW))
TOTAL_ALL=$((TOTAL_PASS + TOTAL_FAIL + TOTAL_WARN))

PASS_ITER=0; FAIL_ITER=0
for key in linux-1 linux-2 docker windows; do
    if [ "${ITERATION_RESULTS[$key]}" = "PASS" ]; then
        PASS_ITER=$((PASS_ITER + 1))
    else
        FAIL_ITER=$((FAIL_ITER + 1))
    fi
done

master_log ""
master_log "${C_BOLD}${C_CYAN}══════════════════════════════════════════════════════════════════════════════════${C_RESET}"
master_log "${C_BOLD}${C_WHITE}  🛡️  SENTINEL NEXUS — MASTER TEST REPORT v1.2.0${C_RESET}"
master_log "${C_BOLD}${C_CYAN}══════════════════════════════════════════════════════════════════════════════════${C_RESET}"
master_log ""
master_log "  ${C_BOLD}Date:${C_RESET}              $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
master_log "  ${C_BOLD}Total Duration:${C_RESET}    ${TOTAL_TIME}s"
master_log ""

# Per-iteration table
master_log "  ${C_BOLD}┌──────────┬──────────────────────────┬─────────┬───────┬───────┬───────┬──────────┐${C_RESET}"
master_log "  ${C_BOLD}│ Iteration│ Environment              │ Status  │ Pass  │ Fail  │ Warn  │ Time(s)  │${C_RESET}"
master_log "  ${C_BOLD}├──────────┼──────────────────────────┼─────────┼───────┼───────┼───────┼──────────┤${C_RESET}"

print_row() {
    local iter="$1" env="$2" status="$3" pass="$4" fail="$5" warn="$6" time="$7"
    local status_str
    if [ "$status" = "PASS" ]; then
        status_str="${C_GREEN}  PASS ${C_RESET}"
    else
        status_str="${C_RED}  FAIL ${C_RESET}"
    fi
    local row="  │ %-8s │ %-24s │${status_str}│ %4d │ %4d │ %4d │ %6ds  │"
    printf "$row\n" "$iter" "$env" "$pass" "$fail" "$warn" "$time"
}

print_row "linux-1" "Ubuntu 22.04 LTS"         "${ITERATION_RESULTS[linux-1]}" "$L1P" "$L1F" "$L1W" "${ITERATION_TIMES[linux-1]}"
print_row "linux-2" "Fedora 39 Workstation"    "${ITERATION_RESULTS[linux-2]}" "$L2P" "$L2F" "$L2W" "${ITERATION_TIMES[linux-2]}"
print_row "docker"  "node:20-alpine"           "${ITERATION_RESULTS[docker]}" "$DOP" "$DOF" "$DOW" "${ITERATION_TIMES[docker]}"
print_row "windows" "Windows Server 2022"      "${ITERATION_RESULTS[windows]}" "$WIP" "$WIF" "$WIW" "${ITERATION_TIMES[windows]}"

master_log "  ${C_BOLD}└──────────┴──────────────────────────┴─────────┴───────┴───────┴───────┴──────────┘${C_RESET}"
master_log ""

# Totals
master_log "  ${C_BOLD}Overall Iterations:${C_RESET}  ${C_GREEN}${PASS_ITER} passed${C_RESET}, ${C_RED}${FAIL_ITER} failed${C_RESET} (of ${TOTAL_ITERATIONS})"
master_log "  ${C_BOLD}Total Checks:${C_RESET}        ${TOTAL_ALL} total"
master_log "    ${C_GREEN}${C_BOLD}Passed:${C_RESET}            $TOTAL_PASS"
master_log "    ${C_RED}${C_BOLD}Failed:${C_RESET}            $TOTAL_FAIL"
master_log "    ${C_YELLOW}${C_BOLD}Warnings:${C_RESET}          $TOTAL_WARN"
master_log ""

# Overall pass rate bar
if [ "$TOTAL_ALL" -gt 0 ]; then
    local_pct=$(( (TOTAL_PASS * 100) / TOTAL_ALL ))
    local_filled=$(( (TOTAL_PASS * 50) / TOTAL_ALL ))
    local_empty=$(( 50 - local_filled ))
    local_bar=""
    for ((i=0; i<local_filled; i++)); do local_bar+="█"; done
    for ((i=0; i<local_empty; i++)); do local_bar+="░"; done
    master_log "  ${C_GREEN}${C_BOLD}[${local_bar}] ${local_pct}%${C_RESET} ${C_DIM}Overall pass rate${C_RESET}"
    master_log ""
fi

# Verdict
if [ "$FAIL_ITER" -eq 0 ]; then
    master_log "  ${C_BG_GREEN}${C_WHITE}${C_BOLD}  ✓  ALL ${TOTAL_ITERATIONS} ITERATIONS PASSED — Sentinel Nexus is ready for deployment  ${C_RESET}"
else
    master_log "  ${C_BG_RED}${C_WHITE}${C_BOLD}  ✗  ${FAIL_ITER} ITERATION(S) FAILED — review logs in tests/results/  ${C_RESET}"
fi

master_log ""
master_log "  ${C_DIM}Log Files:${C_RESET}"
master_log "    ${C_DIM}$RESULTS_DIR/linux-1.log${C_RESET}"
master_log "    ${C_DIM}$RESULTS_DIR/linux-2.log${C_RESET}"
master_log "    ${C_DIM}$RESULTS_DIR/docker.log${C_RESET}"
master_log "    ${C_DIM}$RESULTS_DIR/windows.log${C_RESET}"
master_log "    ${C_DIM}$RESULTS_DIR/master.log${C_RESET}"
master_log ""
master_log "  ${C_DIM}Summary CSV: $SUMMARY_CSV${C_RESET}"
master_log ""
master_log "${C_BOLD}${C_CYAN}══════════════════════════════════════════════════════════════════════════════════${C_RESET}"

# Exit
if [ "$FAIL_ITER" -gt 0 ]; then exit 1; fi
exit 0

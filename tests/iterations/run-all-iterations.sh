#!/usr/bin/env bash
# =============================================================================
# Sentinel Nexus - Master Test Runner
# Runs all test iterations and generates a summary report
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RESULTS_DIR="$PROJECT_ROOT/tests/results"
SUMMARY_CSV="$RESULTS_DIR/summary.csv"

mkdir -p "$RESULTS_DIR"

echo "========================================================================"
echo "  Sentinel Nexus - Master Test Runner"
echo "  Running all test iterations sequentially"
echo "  Started: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "========================================================================"
echo ""

TOTAL_START=$(date +%s)

# Track results
declare -A ITERATION_RESULTS
declare -A ITERATION_PASSES
declare -A ITERATION_FAILS
declare -A ITERATION_WARNS
declare -A ITERATION_TIMES

# ---------------------------------------------------------------------------
# Iteration 1: Ubuntu 22.04
# ---------------------------------------------------------------------------
echo ">>> [1/4] Starting Linux Run 1 (Ubuntu 22.04)..."
echo "--------------------------------------------------------------"
ITER_START=$(date +%s)
if bash "$SCRIPT_DIR/linux-run-1.sh"; then
    ITERATION_RESULTS["linux-1"]="PASS"
else
    ITERATION_RESULTS["linux-1"]="FAIL"
fi
ITER_END=$(date +%s)
ITERATION_TIMES["linux-1"]=$((ITER_END - ITER_START))
echo ""

# ---------------------------------------------------------------------------
# Iteration 2: Fedora 39
# ---------------------------------------------------------------------------
echo ">>> [2/4] Starting Linux Run 2 (Fedora 39)..."
echo "--------------------------------------------------------------"
ITER_START=$(date +%s)
if bash "$SCRIPT_DIR/linux-run-2.sh"; then
    ITERATION_RESULTS["linux-2"]="PASS"
else
    ITERATION_RESULTS["linux-2"]="FAIL"
fi
ITER_END=$(date +%s)
ITERATION_TIMES["linux-2"]=$((ITER_END - ITER_START))
echo ""

# ---------------------------------------------------------------------------
# Iteration 3: Docker
# ---------------------------------------------------------------------------
echo ">>> [3/4] Starting Docker Run (node:20-alpine)..."
echo "--------------------------------------------------------------"
ITER_START=$(date +%s)
if bash "$SCRIPT_DIR/docker-run.sh"; then
    ITERATION_RESULTS["docker"]="PASS"
else
    ITERATION_RESULTS["docker"]="FAIL"
fi
ITER_END=$(date +%s)
ITERATION_TIMES["docker"]=$((ITER_END - ITER_START))
echo ""

# ---------------------------------------------------------------------------
# Iteration 4: Windows
# ---------------------------------------------------------------------------
echo ">>> [4/4] Starting Windows Run (Windows Server 2022)..."
echo "--------------------------------------------------------------"
ITER_START=$(date +%s)
if bash "$SCRIPT_DIR/windows-run.sh"; then
    ITERATION_RESULTS["windows"]="PASS"
else
    ITERATION_RESULTS["windows"]="FAIL"
fi
ITER_END=$(date +%s)
ITERATION_TIMES["windows"]=$((ITER_END - ITER_START))
echo ""

TOTAL_END=$(date +%s)
TOTAL_TIME=$((TOTAL_END - TOTAL_START))

# ---------------------------------------------------------------------------
# Parse log files for detailed counts
# ---------------------------------------------------------------------------
parse_log_counts() {
    local log_file="$1"
    local passes fails warns

    if [ -f "$log_file" ]; then
        passes=$(grep -c '\[PASS\]' "$log_file" 2>/dev/null || echo 0)
        fails=$(grep -c '\[FAIL\]' "$log_file" 2>/dev/null || echo 0)
        warns=$(grep -c '\[WARN\]' "$log_file" 2>/dev/null || echo 0)
    else
        passes=0
        fails=0
        warns=0
    fi

    echo "$passes $fails $warns"
}

read LINUX1_P LINUX1_F LINUX1_W <<< "$(parse_log_counts "$RESULTS_DIR/linux-1.log")"
read LINUX2_P LINUX2_F LINUX2_W <<< "$(parse_log_counts "$RESULTS_DIR/linux-2.log")"
read DOCKER_P DOCKER_F DOCKER_W <<< "$(parse_log_counts "$RESULTS_DIR/docker.log")"
read WINDOWS_P WINDOWS_F WINDOWS_W <<< "$(parse_log_counts "$RESULTS_DIR/windows.log")"

# ---------------------------------------------------------------------------
# Generate CSV Summary
# ---------------------------------------------------------------------------
echo "iteration,environment,status,passed,failed,warnings,duration_seconds" > "$SUMMARY_CSV"
echo "linux-1,Ubuntu 22.04 LTS,${ITERATION_RESULTS[linux-1]},$LINUX1_P,$LINUX1_F,$LINUX1_W,${ITERATION_TIMES[linux-1]}" >> "$SUMMARY_CSV"
echo "linux-2,Fedora 39 Workstation,${ITERATION_RESULTS[linux-2]},$LINUX2_P,$LINUX2_F,$LINUX2_W,${ITERATION_TIMES[linux-2]}" >> "$SUMMARY_CSV"
echo "docker,node:20-alpine,${ITERATION_RESULTS[docker]},$DOCKER_P,$DOCKER_F,$DOCKER_W,${ITERATION_TIMES[docker]}" >> "$SUMMARY_CSV"
echo "windows,Windows Server 2022,${ITERATION_RESULTS[windows]},$WINDOWS_P,$WINDOWS_F,$WINDOWS_W,${ITERATION_TIMES[windows]}" >> "$SUMMARY_CSV"

# ---------------------------------------------------------------------------
# Print Formatted Results Table
# ---------------------------------------------------------------------------
echo "========================================================================"
echo "  SENTINEL NEXUS - TEST ITERATION SUMMARY REPORT"
echo "========================================================================"
echo ""
echo "  ┌──────────┬──────────────────────────┬─────────┬───────┬───────┬─────────┬──────────┐"
echo "  │ Iteration│ Environment              │ Status  │ Pass  │ Fail  │ Warn    │ Time(s)  │"
echo "  ├──────────┼──────────────────────────┼─────────┼───────┼───────┼─────────┼──────────┤"

# Row formatting helper
print_row() {
    local iter="$1" env="$2" status="$3" pass="$4" fail="$5" warn="$6" time="$7"

    local status_display
    if [ "$status" = "PASS" ]; then
        status_display="  PASS "
    else
        status_display="  FAIL "
    fi

    printf "  │ %-8s │ %-24s │%s │ %4d │ %4d │ %5d   │ %6ds  │\n" \
        "$iter" "$env" "$status_display" "$pass" "$fail" "$warn" "$time"
}

print_row "linux-1" "Ubuntu 22.04 LTS"         "${ITERATION_RESULTS[linux-1]}" "$LINUX1_P" "$LINUX1_F" "$LINUX1_W" "${ITERATION_TIMES[linux-1]}"
print_row "linux-2" "Fedora 39 Workstation"    "${ITERATION_RESULTS[linux-2]}" "$LINUX2_P" "$LINUX2_F" "$LINUX2_W" "${ITERATION_TIMES[linux-2]}"
print_row "docker"  "node:20-alpine"           "${ITERATION_RESULTS[docker]}" "$DOCKER_P" "$DOCKER_F" "$DOCKER_W" "${ITERATION_TIMES[docker]}"
print_row "windows" "Windows Server 2022"      "${ITERATION_RESULTS[windows]}" "$WINDOWS_P" "$WINDOWS_F" "$WINDOWS_W" "${ITERATION_TIMES[windows]}"

echo "  └──────────┴──────────────────────────┴─────────┴───────┴───────┴─────────┴──────────┘"
echo ""

# Totals
TOTAL_PASS=$((LINUX1_P + LINUX2_P + DOCKER_P + WINDOWS_P))
TOTAL_FAIL=$((LINUX1_F + LINUX2_F + DOCKER_F + WINDOWS_F))
TOTAL_WARN=$((LINUX1_W + LINUX2_W + DOCKER_W + WINDOWS_W))
PASS_COUNT=0
FAIL_COUNT=0
for key in linux-1 linux-2 docker windows; do
    if [ "${ITERATION_RESULTS[$key]}" = "PASS" ]; then
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
done

echo "  Overall Iterations:  $PASS_COUNT passed, $FAIL_COUNT failed (of 4)"
echo "  Total Checks:        $((TOTAL_PASS + TOTAL_FAIL + TOTAL_WARN)) total"
echo "    Passed:            $TOTAL_PASS"
echo "    Failed:            $TOTAL_FAIL"
echo "    Warnings:          $TOTAL_WARN"
echo ""
echo "  Total Execution Time: ${TOTAL_TIME}s"
echo "  Completed:           $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# Final verdict
if [ "$FAIL_COUNT" -eq 0 ]; then
    echo "  ╔══════════════════════════════════════════════╗"
    echo "  ║  ALL ITERATIONS PASSED                      ║"
    echo "  ║  Sentinel Nexus is ready for deployment     ║"
    echo "  ╚══════════════════════════════════════════════╝"
else
    echo "  ╔══════════════════════════════════════════════╗"
    echo "  ║  SOME ITERATIONS FAILED                     ║"
    echo "  ║  Review logs in tests/results/ for details  ║"
    echo "  ╚══════════════════════════════════════════════╝"
fi
echo ""

echo "  Log Files:"
echo "    $RESULTS_DIR/linux-1.log"
echo "    $RESULTS_DIR/linux-2.log"
echo "    $RESULTS_DIR/docker.log"
echo "    $RESULTS_DIR/windows.log"
echo ""
echo "  Summary CSV: $SUMMARY_CSV"
echo "========================================================================"

# Exit with failure if any iteration failed
if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi
exit 0

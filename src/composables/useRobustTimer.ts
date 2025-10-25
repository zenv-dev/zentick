import { ref, onUnmounted, type Ref } from 'vue'

/**
 * Options for the robust timer
 */
interface UseRobustTimerOptions {
  /** Timer duration in milliseconds */
  durationMs: number
  /** Callback when timer completes */
  onComplete?: () => void
  /** Whether to start the timer automatically */
  autoStart?: boolean
}

/**
 * Return type for useRobustTimer composable
 */
interface UseRobustTimerReturn {
  /** Remaining time in milliseconds */
  remainingMs: Ref<number>
  /** Whether the timer is currently running */
  isRunning: Ref<boolean>
  /** Whether the timer is paused */
  isPaused: Ref<boolean>
  /** Start or resume the timer */
  start: () => void
  /** Pause the timer */
  pause: () => void
  /** Stop and reset the timer */
  stop: () => void
  /** Reset the timer (alias for stop) */
  reset: () => void
}

/**
 * Robust timer implementation that works correctly in background tabs
 *
 * Based on Chrome and MDN best practices:
 * - Uses deadline-based timing (Date.now() + duration) instead of tick counting
 * - Smart scheduling: setTimeout adjusted to next second boundary
 * - Page Visibility API: re-syncs when tab becomes visible
 * - Survives browser throttling in hidden tabs
 *
 * @see https://developer.chrome.com/blog/timer-throttling-in-chrome-88
 * @see https://developer.chrome.com/docs/web-platform/page-lifecycle-api
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */
export function useRobustTimer(options: UseRobustTimerOptions): UseRobustTimerReturn {
  const { durationMs, onComplete, autoStart = false } = options

  // Reactive state
  const remainingMs = ref(durationMs)
  const isRunning = ref(false)
  const isPaused = ref(false)

  // Internal state
  let deadline: number | null = null
  let timeoutId: number | null = null
  let pausedRemainingMs: number | null = null

  /**
   * Core timer tick function
   * Calculates remaining time based on deadline (not tick count)
   */
  function tick() {
    if (!deadline) return

    const now = Date.now()
    const left = Math.max(0, deadline - now)

    remainingMs.value = left

    // Check if timer completed
    if (left <= 0) {
      complete()
      return
    }

    // Schedule next tick
    scheduleNext()
  }

  /**
   * Smart scheduling: tick at the next second boundary
   * This ensures smooth updates even with browser throttling
   */
  function scheduleNext() {
    if (!deadline) return

    const left = Math.max(0, deadline - Date.now())
    // Schedule next tick at the nearest second boundary
    // If left is 3500ms, next tick in 500ms; if left is 3000ms, next tick in 1000ms
    const nextTickDelay = (left % 1000) || 1000

    timeoutId = window.setTimeout(() => {
      tick()
    }, nextTickDelay)
  }

  /**
   * Complete the timer
   */
  function complete() {
    clearTimer()
    isRunning.value = false
    isPaused.value = false
    remainingMs.value = 0

    onComplete?.()
  }

  /**
   * Clear the active timer
   */
  function clearTimer() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  /**
   * Handle visibility change to re-sync when tab becomes visible
   * This compensates for timer throttling in background tabs
   */
  function handleVisibilityChange() {
    if (document.hidden || !isRunning.value) return

    // Re-sync: recalculate remaining time based on deadline
    tick()
  }

  // Public API

  /**
   * Start the timer (or resume if paused)
   */
  function start() {
    if (isRunning.value) return

    // If paused, resume from saved remaining time
    // Otherwise start from full duration
    const startDuration = pausedRemainingMs !== null ? pausedRemainingMs : durationMs

    deadline = Date.now() + startDuration
    isRunning.value = true
    isPaused.value = false
    pausedRemainingMs = null

    tick()
  }

  /**
   * Pause the timer
   */
  function pause() {
    if (!isRunning.value) return

    clearTimer()

    // Save remaining time for resume
    pausedRemainingMs = remainingMs.value

    isRunning.value = false
    isPaused.value = true
    deadline = null
  }

  /**
   * Stop and reset the timer to initial duration
   */
  function stop() {
    clearTimer()

    isRunning.value = false
    isPaused.value = false
    deadline = null
    pausedRemainingMs = null
    remainingMs.value = durationMs
  }

  /**
   * Reset the timer (alias for stop)
   */
  function reset() {
    stop()
  }

  // Setup visibility change listener for background tab handling
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Cleanup on component unmount
  onUnmounted(() => {
    clearTimer()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  // Auto-start if requested
  if (autoStart) {
    start()
  }

  return {
    remainingMs,
    isRunning,
    isPaused,
    start,
    pause,
    stop,
    reset
  }
}

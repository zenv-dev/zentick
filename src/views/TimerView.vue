<script setup lang="ts">
import { computed } from 'vue'
import { useTimerNotification } from '@/composables/useTimerNotification'
import { useRobustTimer } from '@/composables/useRobustTimer'

// Constants
const TIMER_DURATION_MINUTES = 30
const TIMER_DURATION_MS = TIMER_DURATION_MINUTES * 60 * 1000 // 30 minutes

// Composables
const { playNotification } = useTimerNotification()

const { remainingMs, isRunning, isPaused, start, pause, stop } = useRobustTimer({
  durationMs: TIMER_DURATION_MS,
  onComplete: () => {
    playNotification()
  }
})

// Computed
const formattedTime = computed(() => {
  const totalSeconds = Math.floor(remainingMs.value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const startButtonText = computed(() => {
  if (isRunning.value) return 'Pause'
  if (isPaused.value) return 'Resume'
  return 'Start'
})

const startButtonAction = computed(() => {
  return isRunning.value ? pause : start
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center">
    <div class="flex flex-col items-center gap-8 p-6">
      <!-- Timer display -->
      <div class="text-8xl font-bold tabular-nums">
        {{ formattedTime }}
      </div>

      <!-- Controls -->
      <div class="flex gap-4">
        <button
          @click="startButtonAction"
          :disabled="remainingMs <= 0"
          class="rounded-lg bg-gray-900 px-8 py-3 text-lg font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {{ startButtonText }}
        </button>

        <button
          @click="stop"
          :disabled="!isRunning && !isPaused"
          class="rounded-lg border-2 border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
        >
          Stop
        </button>
      </div>
    </div>
  </main>
</template>

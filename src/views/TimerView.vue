<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

// Constants
const TIMER_DURATION_MS = 30 * 60 * 1000 // 30 minutes

// Local state
const remainingMs = ref(TIMER_DURATION_MS)
const isRunning = ref(false)
let intervalId: number | null = null

// Computed
const formattedTime = computed(() => {
  const totalSeconds = Math.floor(remainingMs.value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

// Methods
function start() {
  if (isRunning.value) return

  isRunning.value = true
  intervalId = window.setInterval(() => {
    remainingMs.value -= 1000

    if (remainingMs.value <= 0) {
      stop()
      remainingMs.value = 0
    }
  }, 1000)
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  isRunning.value = false
  remainingMs.value = TIMER_DURATION_MS
}

// Cleanup
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
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
          @click="start"
          :disabled="isRunning"
          class="rounded-lg bg-gray-900 px-8 py-3 text-lg font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          Start
        </button>

        <button
          @click="stop"
          :disabled="!isRunning"
          class="rounded-lg border-2 border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
        >
          Stop
        </button>
      </div>
    </div>
  </main>
</template>

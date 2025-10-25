<script setup lang="ts">
import { useTheme, type ThemeMode } from '@/composables/useTheme'

const { theme, effectiveTheme, setTheme } = useTheme()

const themeOptions: Array<{ value: ThemeMode; label: string; icon: string }> = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
]

const handleThemeChange = (mode: ThemeMode) => {
  setTheme(mode)
}
</script>

<template>
  <div class="flex items-center gap-2 rounded-lg border border-gray-200 p-1 dark:border-gray-700">
    <button
      v-for="option in themeOptions"
      :key="option.value"
      @click="handleThemeChange(option.value)"
      :aria-pressed="theme === option.value"
      :aria-label="`Switch to ${option.label} theme`"
      class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
      :class="[
        theme === option.value
          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
      ]"
    >
      <span aria-hidden="true">{{ option.icon }}</span>
      <span>{{ option.label }}</span>
    </button>
  </div>

  <!-- Visual indicator of effective theme -->
  <div class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
    Currently: {{ effectiveTheme }}
  </div>
</template>

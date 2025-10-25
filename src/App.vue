<script setup lang="ts">
import { RouterView } from 'vue-router'
import { watchEffect } from 'vue'
import { useTheme } from '@/composables/useTheme'

// Initialize theme system
const { effectiveTheme } = useTheme()

// Apply theme class to root element
// This enables Tailwind's dark: variant to work correctly
watchEffect(() => {
  document.documentElement.classList.toggle('dark', effectiveTheme.value === 'dark')
})
</script>

<template>
  <RouterView />
</template>

import { theme, effectiveTheme, systemPrefersDark, setTheme, toggleTheme } from '@/stores/theme'
import type { ThemeMode, EffectiveTheme } from '@/stores/theme'

/**
 * Composable for theme management
 *
 * Provides access to the global theme store using Vue 3 Composition API.
 * Returns refs and functions that maintain reactivity when destructured.
 *
 * This follows Vue 3 best practices for composables by returning
 * an object of refs instead of a reactive object, ensuring proper
 * reactivity preservation when destructuring.
 *
 * @see https://vuejs.org/guide/reusability/composables.html
 *
 * All components using this composable share the same reactive state,
 * ensuring theme changes are synchronized across the application.
 *
 * @returns Object containing reactive theme state and methods
 *
 * @example
 * ```ts
 * const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme()
 *
 * // Set to dark mode
 * setTheme('dark')
 *
 * // Follow system preference
 * setTheme('system')
 *
 * // Toggle between light and dark
 * toggleTheme()
 *
 * // Use effectiveTheme in watchEffect (note: .value in script)
 * watchEffect(() => {
 *   document.documentElement.classList.toggle('dark', effectiveTheme.value === 'dark')
 * })
 *
 * // In template, refs auto-unwrap
 * <div>Current: {{ effectiveTheme }}</div>
 * ```
 */
export function useTheme() {
  return {
    theme,
    effectiveTheme,
    systemPrefersDark,
    setTheme,
    toggleTheme,
  }
}

// Re-export types for convenience
export type { ThemeMode, EffectiveTheme }

import { ref, watch, computed } from 'vue'

/**
 * Theme mode type
 * - 'light': Force light theme
 * - 'dark': Force dark theme
 * - 'system': Follow system preference
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Effective theme type (system preference resolved)
 */
export type EffectiveTheme = 'light' | 'dark'

// Constants
const STORAGE_KEY = 'zentick-theme'
const DEFAULT_THEME: ThemeMode = 'system'

/**
 * Load theme from localStorage or use default
 */
function loadTheme(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_THEME

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
      return stored as ThemeMode
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error)
  }

  return DEFAULT_THEME
}

/**
 * Save theme to localStorage
 */
function saveTheme(mode: ThemeMode): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
}

/**
 * Detect system dark mode preference
 */
function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !('matchMedia' in window)) {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Theme store - Reactive state management with Vue 3 Composition API
 *
 * Uses Vue 3's ref() and computed() for reactive state management.
 * This approach ensures proper reactivity when destructuring in components.
 *
 * @see https://vuejs.org/guide/scaling-up/state-management.html
 * @see https://vuejs.org/guide/reusability/composables.html
 *
 * Features:
 * - Three theme modes: light, dark, and system
 * - Automatic detection of system color scheme preference
 * - Persistent storage of user preference in localStorage
 * - Reactive updates when system preference changes
 * - Proper reactivity when destructuring (Vue 3 best practice)
 * - SSR-safe implementation
 *
 * @example
 * ```ts
 * import { theme, effectiveTheme, setTheme } from '@/stores/theme'
 *
 * // Set to dark mode
 * setTheme('dark')
 *
 * // Access current theme (in script)
 * console.log(theme.value)
 * console.log(effectiveTheme.value)
 *
 * // In template, refs auto-unwrap
 * <div>Current theme: {{ effectiveTheme }}</div>
 * ```
 */

/**
 * Current theme mode setting
 * Can be 'light', 'dark', or 'system'
 */
export const theme = ref<ThemeMode>(loadTheme())

/**
 * System dark mode preference
 * Updated automatically when system preference changes
 */
export const systemPrefersDark = ref(getSystemPrefersDark())

/**
 * Resolved effective theme (system preference resolved to light or dark)
 * Use this value to apply the actual theme
 *
 * This is a computed ref that maintains reactivity when destructured
 */
export const effectiveTheme = computed<EffectiveTheme>(() => {
  if (theme.value === 'system') {
    return systemPrefersDark.value ? 'dark' : 'light'
  }
  return theme.value
})

/**
 * Set the theme mode
 * @param newMode - Theme mode to set
 */
export function setTheme(newMode: ThemeMode): void {
  theme.value = newMode
}

/**
 * Toggle between light and dark themes
 * If currently 'system', toggles to 'light'
 */
export function toggleTheme(): void {
  if (effectiveTheme.value === 'dark') {
    theme.value = 'light'
  } else {
    theme.value = 'dark'
  }
}

/**
 * Legacy compatibility: themeStore object
 *
 * Provides backward compatibility with the old API.
 * New code should use named exports (theme, effectiveTheme, setTheme, toggleTheme)
 * for better tree-shaking and clearer dependencies.
 */
export const themeStore = {
  theme,
  systemPrefersDark,
  effectiveTheme,
  setTheme,
  toggleTheme,
}

/**
 * Watch theme changes and persist to localStorage
 */
watch(theme, (newTheme) => {
  saveTheme(newTheme)
})

/**
 * Set up system preference listener
 */
if (typeof window !== 'undefined' && 'matchMedia' in window) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // Listen for changes
  const handleChange = (event: MediaQueryListEvent) => {
    systemPrefersDark.value = event.matches
  }

  // Modern browsers use addEventListener
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange)
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange)
  }

  // No cleanup needed - store lives entire app lifetime
}

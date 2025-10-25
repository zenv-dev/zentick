import { ref, onUnmounted, type Ref } from 'vue'

/**
 * Composable for reactive media query matching
 *
 * Provides a reactive boolean that updates when the media query match changes.
 * Handles cleanup automatically on component unmount.
 *
 * @param query - CSS media query string (e.g., "(prefers-color-scheme: dark)")
 * @returns Reactive ref indicating whether the media query matches
 *
 * @example
 * ```ts
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)')
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * ```
 */
export function useMediaQuery(query: string): Ref<boolean> {
  // SSR-safe check
  const isSupported = typeof window !== 'undefined' && 'matchMedia' in window

  const matches = ref(false)
  let mediaQuery: MediaQueryList | null = null

  if (isSupported) {
    mediaQuery = window.matchMedia(query)
    matches.value = mediaQuery.matches

    /**
     * Handle media query changes
     * Updates the reactive ref when the match status changes
     */
    const handleChange = (event: MediaQueryListEvent) => {
      matches.value = event.matches
    }

    // Modern browsers use addEventListener
    // Older browsers use addListener (deprecated but still supported)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    // Cleanup on component unmount
    onUnmounted(() => {
      if (!mediaQuery) return

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange)
      }
    })
  }

  return matches
}

import { ref } from 'vue'

/**
 * Composable for timer completion notifications
 * Uses Web Audio API to generate a pleasant notification sound
 */
export function useTimerNotification() {
  const isSupported = ref(
    typeof AudioContext !== 'undefined' ||
    typeof (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext !== 'undefined'
  )

  /**
   * Plays a two-tone notification sound when timer completes
   * Uses Web Audio API for cross-browser compatibility
   */
  function playNotification() {
    if (!isSupported.value) {
      console.warn('Audio API is not supported in this browser')
      return
    }

    try {
      // Get AudioContext (with webkit prefix fallback for Safari)
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

      if (!AudioContextClass) {
        console.warn('AudioContext is not available')
        return
      }

      const audioContext = new AudioContextClass()

      // Create oscillators for two-tone beep
      const oscillator1 = audioContext.createOscillator()
      const oscillator2 = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      // Connect audio nodes
      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Configure first tone (800Hz)
      oscillator1.frequency.value = 800
      oscillator1.type = 'sine'

      // Configure second tone (1000Hz)
      oscillator2.frequency.value = 1000
      oscillator2.type = 'sine'

      // Create volume envelope for smooth sound
      const currentTime = audioContext.currentTime
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.5)

      // Play first beep
      oscillator1.start(currentTime)
      oscillator1.stop(currentTime + 0.15)

      // Play second beep with slight delay
      oscillator2.start(currentTime + 0.2)
      oscillator2.stop(currentTime + 0.35)

      // Clean up audio context after sound completes
      setTimeout(() => {
        audioContext.close()
      }, 1000)
    } catch (error) {
      console.error('Failed to play notification sound:', error)
    }
  }

  return {
    isSupported,
    playNotification,
  }
}

import { computed, ref } from 'vue'
import { getCurrentWeather } from '../services/weather.service'

export function useWeather() {
  const weather = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchWeather = async (latitude, longitude) => {
    loading.value = true
    error.value = null

    try {
      weather.value = await getCurrentWeather(latitude, longitude)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch weather'
      weather.value = null
    } finally {
      loading.value = false
    }
  }

  const clearWeather = () => {
    weather.value = null
    error.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    weather: computed(() => weather.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchWeather,
    clearWeather,
    clearError,
  }
}

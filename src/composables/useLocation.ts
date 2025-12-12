import { ref } from 'vue'
import { getCityFromResult, getFullLocationFromResult, reverseGeocode } from '../geocoding'
import type { LocationData } from '../types'
import { ERROR_MESSAGES } from '../constants'

export const useLocation = () => {
  const location = ref<LocationData | null>(null)
  const city = ref<string | null>(null)
  const fullLocation = ref<string | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const getLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      error.value = ERROR_MESSAGES.GEOLOCATION_NOT_SUPPORTED
      return
    }

    loading.value = true
    error.value = null
    city.value = null
    fullLocation.value = null

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            location.value = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }

            // Reverse geocode to get city name
            const result = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude,
            )

            if (result) {
              city.value = getCityFromResult(result)
              fullLocation.value = getFullLocationFromResult(result)
            }

            loading.value = false
            resolve()
          } catch (err) {
            error.value = `Error processing location: ${err instanceof Error ? err.message : 'Unknown error'}`
            loading.value = false
            reject(err)
          }
        },
        (err) => {
          error.value = `Error: ${err.message}`
          loading.value = false
          reject(err)
        },
      )
    })
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    location.value = null
    city.value = null
    fullLocation.value = null
    error.value = null
    loading.value = false
  }

  return {
    location,
    city,
    fullLocation,
    error,
    loading,
    getLocation,
    clearError,
    reset,
  }
}

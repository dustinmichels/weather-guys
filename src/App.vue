<script setup lang="ts">
import { ref } from 'vue'
import { useAI } from './composables/useAI'
import { useLocation } from './composables/useLocation'

const { location, city, fullLocation, error, loading, getLocation, clearError } = useLocation()

const { aiResponse, aiLoading, initializeAI, generateResponse } = useAI()

const weather = ref<any>(null)
const weatherLoading = ref(false)
const weatherError = ref<string | null>(null)

// Initialize AI service with API key
const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY
initializeAI(apiKey)

const fetchWeather = async (lat: number, lon: number) => {
  weatherLoading.value = true
  weatherError.value = null

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`,
    )

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()
    weather.value = data
  } catch (err) {
    weatherError.value = err instanceof Error ? err.message : 'Failed to fetch weather'
    console.error('Weather fetch error:', err)
  } finally {
    weatherLoading.value = false
  }
}

const handleReady = async () => {
  // Clear previous data
  weather.value = null
  weatherError.value = null

  // Get location
  await getLocation()

  // If location was successfully retrieved
  if (location.value && !error.value) {
    const { latitude, longitude } = location.value

    // Fetch weather in parallel with AI (since city is available after getLocation)
    await Promise.all([
      fetchWeather(latitude, longitude),
      city.value ? generateResponse(city.value) : Promise.resolve(),
    ])
  }
}

const getWeatherDescription = (code: number): string => {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }
  return weatherCodes[code] || 'Unknown'
}

const getWeatherIcon = (code: number): string => {
  if (code === 0 || code === 1) return 'fa-sun'
  if (code === 2 || code === 3) return 'fa-cloud-sun'
  if (code >= 45 && code <= 48) return 'fa-smog'
  if (code >= 51 && code <= 67) return 'fa-cloud-rain'
  if (code >= 71 && code <= 77) return 'fa-snowflake'
  if (code >= 80 && code <= 82) return 'fa-cloud-showers-heavy'
  if (code >= 85 && code <= 86) return 'fa-snowflake'
  if (code >= 95) return 'fa-bolt'
  return 'fa-cloud'
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8-tablet is-6-desktop">
          <div class="box has-text-centered">
            <h1 class="title is-2 has-text-primary mb-5">Who are you?</h1>
            <h3>By Dustin</h3>

            <button
              @click="handleReady"
              :disabled="loading || weatherLoading || aiLoading"
              class="button is-primary is-large is-fullwidth"
              :class="{ 'is-loading': loading || weatherLoading || aiLoading }"
            >
              <span class="icon">
                <i class="fas fa-location-dot"></i>
              </span>
              <span>
                {{
                  loading
                    ? 'Getting location...'
                    : weatherLoading
                      ? 'Fetching weather...'
                      : aiLoading
                        ? 'AI is thinking...'
                        : 'Ready?'
                }}
              </span>
            </button>

            <div v-if="error" class="notification is-danger mt-4">
              <button class="delete" @click="clearError"></button>
              {{ error }}
            </div>

            <div v-if="weatherError" class="notification is-warning mt-4">
              {{ weatherError }}
            </div>

            <div v-if="location && city" class="mt-5">
              <!-- City Information -->
              <div class="box has-background-primary-light">
                <p class="title is-4 has-text-primary mb-2">
                  <span class="icon">
                    <i class="fas fa-map-marker-alt"></i>
                  </span>
                  {{ city }}
                </p>
                <p class="subtitle is-6 has-text-grey">{{ fullLocation }}</p>
              </div>

              <!-- Weather Information -->
              <div v-if="weather" class="box has-background-info-light mt-4">
                <p class="title is-5 has-text-info mb-4">
                  <span class="icon">
                    <i class="fas fa-cloud-sun"></i>
                  </span>
                  Current Weather
                </p>
                <div class="columns is-mobile is-multiline">
                  <div class="column is-half">
                    <div class="has-text-centered">
                      <span class="icon is-large has-text-info">
                        <i
                          class="fas fa-2x"
                          :class="getWeatherIcon(weather.current.weather_code)"
                        ></i>
                      </span>
                      <p class="is-size-7 has-text-weight-semibold mt-2">
                        {{ getWeatherDescription(weather.current.weather_code) }}
                      </p>
                    </div>
                  </div>
                  <div class="column is-half">
                    <div class="has-text-centered">
                      <p class="title is-3 has-text-info mb-1">
                        {{ Math.round(weather.current.temperature_2m) }}°F
                      </p>
                      <p class="is-size-7 has-text-grey">
                        Feels like {{ Math.round(weather.current.apparent_temperature) }}°F
                      </p>
                    </div>
                  </div>
                  <div class="column is-half">
                    <div class="has-text-centered">
                      <span class="icon has-text-info">
                        <i class="fas fa-wind"></i>
                      </span>
                      <p class="is-size-7">
                        <span class="has-text-weight-semibold">Wind:</span>
                        {{ Math.round(weather.current.wind_speed_10m) }} mph
                      </p>
                    </div>
                  </div>
                  <div class="column is-half">
                    <div class="has-text-centered">
                      <span class="icon has-text-info">
                        <i class="fas fa-droplet"></i>
                      </span>
                      <p class="is-size-7">
                        <span class="has-text-weight-semibold">Humidity:</span>
                        {{ weather.current.relative_humidity_2m }}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- AI Response -->
              <div v-if="aiResponse" class="box has-background-success-light mt-4">
                <div class="content has-text-left">
                  <p>{{ aiResponse }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Optional: Add any custom styles here if needed */
</style>

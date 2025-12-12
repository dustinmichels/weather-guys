<script setup lang="ts">
import { GoogleGenAI } from '@google/genai'
import { ref } from 'vue'
import { getCityFromResult, getFullLocationFromResult, reverseGeocode } from './geocoding'
import { LOCATION_STEREOTYPE_PROMPT } from './prompts'

const location = ref<{ latitude: number; longitude: number } | null>(null)
const city = ref<string | null>(null)
const fullLocation = ref<string | null>(null)
const error = ref<string | null>(null)
const loading = ref(false)
const aiLoading = ref(false)
const aiResponse = ref<string | null>(null)

const getLocation = () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by your browser'
    return
  }

  loading.value = true
  error.value = null
  city.value = null
  fullLocation.value = null

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      location.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }

      // Reverse geocode to get city name
      const result = await reverseGeocode(position.coords.latitude, position.coords.longitude)

      if (result) {
        city.value = getCityFromResult(result)
        fullLocation.value = getFullLocationFromResult(result)
      }

      loading.value = false
    },
    (err) => {
      error.value = `Error: ${err.message}`
      loading.value = false
    },
  )
}

const useAI = async () => {
  if (!city.value) return

  // Check if API key is configured
  const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY

  if (!apiKey || apiKey === 'your_api_key_here') {
    aiResponse.value =
      '⚠️ Please set your VITE_GOOGLE_AI_KEY in the .env file. Get your API key from https://ai.google.dev/'
    return
  }

  aiLoading.value = true
  aiResponse.value = null

  try {
    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `${LOCATION_STEREOTYPE_PROMPT}

Location Input: ${city.value}`,
    })

    aiResponse.value = response.text ?? null
  } catch (err) {
    aiResponse.value = `Error getting AI response: ${err instanceof Error ? err.message : 'Unknown error'}`
    console.error('AI Error:', err)
  } finally {
    aiLoading.value = false
  }
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8-tablet is-6-desktop">
          <div class="box has-text-centered">
            <h1 class="title is-2 has-text-primary mb-5">Location Finder</h1>

            <button
              @click="getLocation"
              :disabled="loading"
              class="button is-primary is-large is-fullwidth"
              :class="{ 'is-loading': loading }"
            >
              <span class="icon">
                <i class="fas fa-location-dot"></i>
              </span>
              <span>{{ loading ? 'Getting location...' : 'Ready?' }}</span>
            </button>

            <div v-if="error" class="notification is-danger mt-4">
              <button class="delete" @click="error = null"></button>
              {{ error }}
            </div>

            <div v-if="location" class="mt-5">
              <div v-if="city" class="box has-background-primary-light">
                <div class="content">
                  <p class="title is-4 has-text-primary mb-2">
                    <span class="icon">
                      <i class="fas fa-map-marker-alt"></i>
                    </span>
                    {{ city }}
                  </p>
                  <p class="subtitle is-6 has-text-grey">{{ fullLocation }}</p>

                  <button
                    @click="useAI"
                    :disabled="aiLoading"
                    class="button is-info is-medium is-fullwidth mt-4"
                    :class="{ 'is-loading': aiLoading }"
                  >
                    <span class="icon">
                      <i class="fas fa-robot"></i>
                    </span>
                    <span>{{ aiLoading ? 'AI is thinking...' : 'Use AI 🤖' }}</span>
                  </button>

                  <div v-if="aiResponse" class="notification is-info is-light mt-4 has-text-left">
                    <p class="title is-5 has-text-info mb-3">
                      <span class="icon">
                        <i class="fas fa-sparkles"></i>
                      </span>
                      AI Insights:
                    </p>
                    <div class="content">
                      <p>{{ aiResponse }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="box mt-4">
                <div class="content has-text-left">
                  <p class="has-text-weight-semibold">
                    <span class="icon has-text-info">
                      <i class="fas fa-globe"></i>
                    </span>
                    Coordinates:
                  </p>
                  <p class="mb-2">
                    <span class="has-text-weight-bold">Latitude:</span>
                    {{ location.latitude.toFixed(6) }}
                  </p>
                  <p class="mb-0">
                    <span class="has-text-weight-bold">Longitude:</span>
                    {{ location.longitude.toFixed(6) }}
                  </p>
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

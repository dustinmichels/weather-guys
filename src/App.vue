<script setup lang="ts">
import { GoogleGenAI } from '@google/genai'
import { ref } from 'vue'
import { getCityFromResult, getFullLocationFromResult, reverseGeocode } from './geocoding'

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
      model: 'gemini-2.5-flash',
      contents: `Tell me 3 interesting facts about ${city.value} in a few sentences.`,
    })

    aiResponse.value = response.text
  } catch (err) {
    aiResponse.value = `Error getting AI response: ${err instanceof Error ? err.message : 'Unknown error'}`
    console.error('AI Error:', err)
  } finally {
    aiLoading.value = false
  }
}
</script>

<template>
  <div class="container">
    <h1>Location Finder</h1>

    <button @click="getLocation" :disabled="loading" class="ready-btn">
      {{ loading ? 'Getting location...' : 'Ready?' }}
    </button>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="location" class="location-info">
      <h2>Your Location:</h2>

      <div v-if="city" class="city-display">
        <p class="city-name">📍 {{ city }}</p>
        <p class="full-location">{{ fullLocation }}</p>

        <button @click="useAI" :disabled="aiLoading" class="ai-btn">
          {{ aiLoading ? 'AI is thinking...' : 'Use AI 🤖' }}
        </button>

        <div v-if="aiResponse" class="ai-response">
          <h3>AI Insights:</h3>
          <p>{{ aiResponse }}</p>
        </div>
      </div>

      <div class="coordinates">
        <p><strong>Latitude:</strong> {{ location.latitude.toFixed(6) }}</p>
        <p><strong>Longitude:</strong> {{ location.longitude.toFixed(6) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #42b983;
}

.ready-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ready-btn:hover:not(:disabled) {
  background-color: #359268;
  transform: scale(1.05);
}

.ready-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fee;
  color: #c33;
  border-radius: 4px;
  border-left: 4px solid #c33;
}

.location-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f0f9ff;
  border-radius: 8px;
  border: 2px solid #42b983;
  text-align: left;
  min-width: 320px;
}

.location-info h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #42b983;
}

.city-display {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #42b98333;
}

.city-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.full-location {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.coordinates p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #555;
}

.ai-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.ai-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ai-btn:disabled {
  background: linear-gradient(135deg, #a0a0a0 0%, #808080 100%);
  cursor: not-allowed;
  transform: none;
}

.ai-response {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f4ff;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.ai-response h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #667eea;
  font-size: 1.1rem;
}

.ai-response p {
  margin: 0;
  color: #333;
  line-height: 1.6;
}
</style>

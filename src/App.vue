<script setup lang="ts">
import { useAI } from './composables/useAI'
import { useLocation } from './composables/useLocation'

const { location, city, fullLocation, error, loading, getLocation, clearError } = useLocation()

const { aiResponse, aiLoading, initializeAI, generateResponse } = useAI()

// Initialize AI service with API key
const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY
initializeAI(apiKey)

const handleReady = async () => {
  await getLocation()
  if (city.value) {
    await generateResponse(city.value)
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
              @click="handleReady"
              :disabled="loading || aiLoading"
              class="button is-primary is-large is-fullwidth"
              :class="{ 'is-loading': loading || aiLoading }"
            >
              <span class="icon">
                <i class="fas fa-location-dot"></i>
              </span>
              <span>{{ loading || aiLoading ? 'Processing...' : 'Ready?' }}</span>
            </button>

            <div v-if="error" class="notification is-danger mt-4">
              <button class="delete" @click="clearError"></button>
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

                  <div v-if="aiResponse" class="notification is-info is-light mt-4 has-text-left">
                    <p class="title is-5 has-text-info mb-3">
                      <span class="icon">
                        <i class="fas fa-sparkles"></i>
                      </span>
                    </p>
                    <div class="content">
                      <p>{{ aiResponse }}</p>
                    </div>
                  </div>
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

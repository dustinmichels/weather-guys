<script setup lang="ts">
import { ref } from 'vue'

const location = ref<{ latitude: number; longitude: number } | null>(null)
const error = ref<string | null>(null)
const loading = ref(false)

const getLocation = () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by your browser'
    return
  }

  loading.value = true
  error.value = null

  navigator.geolocation.getCurrentPosition(
    (position) => {
      location.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      loading.value = false
    },
    (err) => {
      error.value = `Error: ${err.message}`
      loading.value = false
    },
  )
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
      <p><strong>Latitude:</strong> {{ location.latitude }}</p>
      <p><strong>Longitude:</strong> {{ location.longitude }}</p>
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
}

.location-info h2 {
  margin-top: 0;
  color: #42b983;
}

.location-info p {
  margin: 0.5rem 0;
}
</style>

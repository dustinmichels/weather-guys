<script setup>
import { computed } from 'vue'
import {
  getWeatherDescription,
  getWeatherIcon,
  isCloudy,
  isRaining,
  isSunny,
} from '../services/weather.service'

const props = defineProps({
  weather: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const description = computed(() => getWeatherDescription(props.weather.weatherCode))
const icon = computed(() => getWeatherIcon(props.weather.weatherCode, props.weather.isDay))

const weatherState = computed(() => {
  const code = props.weather.weatherCode
  const day = props.weather.isDay

  if (isRaining(code)) return { state: 'Raining', color: 'info' }
  if (isCloudy(code)) return { state: 'Cloudy', color: 'grey' }
  if (isSunny(code, day)) return { state: 'Sunny', color: 'warning' }

  return { state: description.value, color: 'info' }
})
</script>

<template>
  <div class="box has-background-light">
    <div class="content">
      <p class="title is-4 has-text-centered mb-4">
        <span class="icon-text">
          <span class="icon has-text-info">
            <i class="fas fa-cloud-sun"></i>
          </span>
          <span>Current Weather</span>
        </span>
      </p>

      <div class="has-text-centered mb-4">
        <span class="icon is-large" :class="`has-text-${weatherState.color}`">
          <i class="fas fa-3x" :class="icon"></i>
        </span>
      </div>

      <div class="has-text-centered mb-4">
        <p class="title is-2 has-text-primary mb-2">{{ weather.temperature.toFixed(1) }}°C</p>
        <p class="subtitle is-5" :class="`has-text-${weatherState.color}`">
          {{ weatherState.state }}
        </p>
        <p class="is-size-6 has-text-grey">{{ description }}</p>
      </div>

      <div class="columns is-mobile is-multiline">
        <div class="column is-half">
          <div class="box has-background-white">
            <p class="heading has-text-grey">Humidity</p>
            <p class="title is-5 has-text-info">
              <span class="icon">
                <i class="fas fa-droplet"></i>
              </span>
              {{ weather.humidity }}%
            </p>
          </div>
        </div>

        <div class="column is-half">
          <div class="box has-background-white">
            <p class="heading has-text-grey">Wind Speed</p>
            <p class="title is-5 has-text-info">
              <span class="icon">
                <i class="fas fa-wind"></i>
              </span>
              {{ weather.windSpeed.toFixed(1) }} km/h
            </p>
          </div>
        </div>

        <div class="column is-half">
          <div class="box has-background-white">
            <p class="heading has-text-grey">Precipitation</p>
            <p class="title is-5 has-text-info">
              <span class="icon">
                <i class="fas fa-umbrella"></i>
              </span>
              {{ weather.precipitation.toFixed(1) }} mm
            </p>
          </div>
        </div>

        <div class="column is-half">
          <div class="box has-background-white">
            <p class="heading has-text-grey">Time of Day</p>
            <p class="title is-5 has-text-info">
              <span class="icon">
                <i class="fas" :class="weather.isDay ? 'fa-sun' : 'fa-moon'"></i>
              </span>
              {{ weather.isDay ? 'Day' : 'Night' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  transition: transform 0.2s ease;
}

.box:hover {
  transform: translateY(-2px);
}

.icon.is-large {
  width: 5rem;
  height: 5rem;
}
</style>

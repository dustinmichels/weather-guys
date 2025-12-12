export interface WeatherData {
  temperature: number
  weatherCode: number
  windSpeed: number
  humidity: number
  precipitation: number
  isDay: boolean
}

export interface WeatherResponse {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    is_day: number
  }
}

/**
 * Fetch current weather data from Open-Meteo API
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Weather data
 */
export async function getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day&temperature_unit=celsius&wind_speed_unit=kmh`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data: WeatherResponse = await response.json()

  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    isDay: data.current.is_day === 1,
  }
}

/**
 * Get weather description from WMO weather code
 * @param code - WMO weather code
 * @returns Weather description
 */
export function getWeatherDescription(code: number): string {
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
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
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

/**
 * Get weather icon based on weather code and time of day
 * @param code - WMO weather code
 * @param isDay - Whether it's daytime
 * @returns Font Awesome icon class
 */
export function getWeatherIcon(code: number, isDay: boolean): string {
  // Clear/Mainly clear
  if (code === 0 || code === 1) {
    return isDay ? 'fa-sun' : 'fa-moon'
  }

  // Partly cloudy
  if (code === 2) {
    return isDay ? 'fa-cloud-sun' : 'fa-cloud-moon'
  }

  // Overcast
  if (code === 3) {
    return 'fa-cloud'
  }

  // Fog
  if (code === 45 || code === 48) {
    return 'fa-smog'
  }

  // Drizzle
  if (code >= 51 && code <= 57) {
    return 'fa-cloud-rain'
  }

  // Rain
  if (code >= 61 && code <= 67) {
    return 'fa-cloud-showers-heavy'
  }

  // Snow
  if (code >= 71 && code <= 77) {
    return 'fa-snowflake'
  }

  // Rain showers
  if (code >= 80 && code <= 82) {
    return 'fa-cloud-sun-rain'
  }

  // Snow showers
  if (code >= 85 && code <= 86) {
    return 'fa-cloud-meatball'
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return 'fa-cloud-bolt'
  }

  return 'fa-question'
}

/**
 * Check if it's currently raining based on weather code
 * @param code - WMO weather code
 * @returns true if raining
 */
export function isRaining(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82)
}

/**
 * Check if it's cloudy based on weather code
 * @param code - WMO weather code
 * @returns true if cloudy
 */
export function isCloudy(code: number): boolean {
  return code >= 2 && code <= 3
}

/**
 * Check if it's sunny based on weather code
 * @param code - WMO weather code
 * @param isDay - Whether it's daytime
 * @returns true if sunny
 */
export function isSunny(code: number, isDay: boolean): boolean {
  return (code === 0 || code === 1) && isDay
}

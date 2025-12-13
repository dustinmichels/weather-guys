/**
 * Mock Configuration
 * Contains all placeholder data used when MOCK mode is enabled
 */

export const MOCK_CONFIG = {
  // City/Location Mock Data
  CITY: {
    name: 'Cambridge',
    fullLocation: 'Cambridge, Massachusetts, USA',
    latitude: 42.3736,
    longitude: -71.1097,
    geocodeResult: {
      place_id: 123456789,
      licence: 'Mock Data',
      osm_type: 'node',
      osm_id: 987654321,
      lat: '42.3736',
      lon: '-71.1097',
      display_name: 'Cambridge, Middlesex County, Massachusetts, United States',
      address: {
        city: 'Cambridge',
        county: 'Middlesex County',
        state: 'Massachusetts',
        country: 'United States',
        country_code: 'us',
      },
      boundingbox: ['42.3536', '42.3936', '-71.1297', '-71.0897'],
    },
  },

  // Weather Mock Data
  WEATHER: {
    current: {
      temperature_2m: 72.5,
      relative_humidity_2m: 65,
      apparent_temperature: 74.0,
      precipitation: 0.0,
      weather_code: 2,
      wind_speed_10m: 8.5,
      is_day: 1,
    },
    // Additional mock weather scenarios you can swap in
    scenarios: {
      sunny: {
        temperature_2m: 78.0,
        relative_humidity_2m: 45,
        apparent_temperature: 78.0,
        precipitation: 0.0,
        weather_code: 0,
        wind_speed_10m: 5.2,
        is_day: 1,
      },
      rainy: {
        temperature_2m: 58.0,
        relative_humidity_2m: 85,
        apparent_temperature: 55.0,
        precipitation: 0.8,
        weather_code: 61,
        wind_speed_10m: 12.3,
        is_day: 1,
      },
      snowy: {
        temperature_2m: 28.0,
        relative_humidity_2m: 90,
        apparent_temperature: 22.0,
        precipitation: 0.5,
        weather_code: 71,
        wind_speed_10m: 15.8,
        is_day: 1,
      },
      thunderstorm: {
        temperature_2m: 68.0,
        relative_humidity_2m: 88,
        apparent_temperature: 70.0,
        precipitation: 1.2,
        weather_code: 95,
        wind_speed_10m: 22.5,
        is_day: 0,
      },
    },
  },

  // AI Mock Response
  AI: {
    response: `Oh, you're from Cambridge. That means you probably spend your weekends debating the Oxford comma at coffee shops, own at least three tote bags from independent bookstores, and have strong opinions about which side of the river is superior.`,
    // Alternative responses for variety
    alternatives: [
      `Oh, you're from Cambridge. That means you probably cycle everywhere in a tweed jacket, argue about the correct pronunciation of "scone," and have a punt with a tragic love story attached to it.`,
      `Oh, you're from Cambridge. That means you probably think Dunkin' is a food group, call it "the T" even though it's always late, and know exactly where Matt Damon's bench from Good Will Hunting is.`,
      `Oh, you're from Cambridge. That means you probably have opinions about Harvard vs MIT, know which coffee shop has the best Wi-Fi for working, and can navigate the Red Line with your eyes closed.`,
    ],
  },

  // Timing Configuration (simulated delays in milliseconds)
  DELAYS: {
    geocoding: 300, // Simulate network delay for geocoding
    weather: 400, // Simulate network delay for weather API
    ai: 800, // Simulate AI thinking time
  },
}

/**
 * Get a random AI response from the alternatives
 * @returns {string} Random AI response
 */
export function getRandomMockAIResponse() {
  const allResponses = [MOCK_CONFIG.AI.response, ...MOCK_CONFIG.AI.alternatives]
  return allResponses[Math.floor(Math.random() * allResponses.length)]
}

/**
 * Get weather mock data by scenario
 * @param {string} scenario - Weather scenario name (sunny, rainy, snowy, thunderstorm) or 'random'
 * @returns {Object} Weather data
 */
export function getMockWeather(scenario = 'default') {
  if (scenario === 'random') {
    const scenarios = Object.keys(MOCK_CONFIG.WEATHER.scenarios)
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    return MOCK_CONFIG.WEATHER.scenarios[randomScenario]
  }

  if (scenario === 'default' || !MOCK_CONFIG.WEATHER.scenarios[scenario]) {
    return MOCK_CONFIG.WEATHER.current
  }

  return MOCK_CONFIG.WEATHER.scenarios[scenario]
}

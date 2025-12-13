# Mock Mode Documentation

## Overview

This application supports comprehensive mock mode functionality that allows you to test and develop without making real API calls. Each external API can be mocked independently, giving you fine-grained control over the application's behavior.

## Mock Configuration

All mock data and behavior is configured in `src/config/mock.config.js`. This centralized configuration makes it easy to customize mock responses, add new scenarios, or adjust timing delays.

## Environment Variables

Configure mock mode using these environment variables in your `.env` file:

### VITE_MOCK_CITY

**Purpose**: Mock the Nominatim geocoding API call
**Default Mock Location**: Cambridge, Massachusetts, USA
**Values**: `true` | `false`

When enabled, the app will return mock geocoding data instead of calling the OpenStreetMap Nominatim API.

```bash
VITE_MOCK_CITY=true
```

**Mock Data Includes**:
- City: Cambridge
- State: Massachusetts
- Country: United States
- Coordinates: 42.3736, -71.1097

### VITE_MOCK_WEATHER

**Purpose**: Mock the Open-Meteo weather API call
**Default Scenario**: Partly cloudy, 72.5°F
**Values**: `true` | `false`

When enabled, returns mock weather data instead of calling the Open-Meteo API.

```bash
VITE_MOCK_WEATHER=true
```

### VITE_MOCK_WEATHER_SCENARIO

**Purpose**: Choose which weather scenario to mock
**Default**: `default`
**Values**: `default` | `sunny` | `rainy` | `snowy` | `thunderstorm` | `random`

Only applies when `VITE_MOCK_WEATHER=true`.

```bash
VITE_MOCK_WEATHER=true
VITE_MOCK_WEATHER_SCENARIO=rainy
```

**Available Scenarios**:

| Scenario | Temp | Conditions | Precipitation | Weather Code |
|----------|------|------------|---------------|--------------|
| default | 72.5°F | Partly cloudy | 0.0" | 2 |
| sunny | 78.0°F | Clear sky | 0.0" | 0 |
| rainy | 58.0°F | Slight rain | 0.8" | 61 |
| snowy | 28.0°F | Slight snow | 0.5" | 71 |
| thunderstorm | 68.0°F | Thunderstorm | 1.2" | 95 |
| random | varies | Random scenario from above | varies | varies |

### VITE_MOCK_AI

**Purpose**: Mock the Google Gemini AI API call
**Default Response**: Witty Cambridge stereotype
**Values**: `true` | `false`

When enabled, returns predefined mock responses instead of calling Google's Generative AI API.

```bash
VITE_MOCK_AI=true
```

### VITE_MOCK_AI_RANDOM

**Purpose**: Randomize AI responses from a pool
**Default**: `false`
**Values**: `true` | `false`

Only applies when `VITE_MOCK_AI=true`. When enabled, randomly selects from multiple mock responses instead of using the same one each time.

```bash
VITE_MOCK_AI=true
VITE_MOCK_AI_RANDOM=true
```

## Common Use Cases

### 1. Full Mock Mode (No API Calls)

Perfect for offline development or when you don't have API keys:

```bash
VITE_MOCK_CITY=true
VITE_MOCK_WEATHER=true
VITE_MOCK_AI=true
```

### 2. Testing Weather Scenarios

Test how the UI looks with different weather conditions:

```bash
VITE_MOCK_CITY=true
VITE_MOCK_WEATHER=true
VITE_MOCK_WEATHER_SCENARIO=snowy
VITE_MOCK_AI=false
```

### 3. Development Without AI Costs

Use real location and weather data but mock the AI to save on API costs:

```bash
VITE_MOCK_CITY=false
VITE_MOCK_WEATHER=false
VITE_MOCK_AI=true
VITE_MOCK_AI_RANDOM=true
```

### 4. Demo Mode with Variety

Showcase the app with varied responses:

```bash
VITE_MOCK_CITY=true
VITE_MOCK_WEATHER=true
VITE_MOCK_WEATHER_SCENARIO=random
VITE_MOCK_AI=true
VITE_MOCK_AI_RANDOM=true
```

## Mock Timing

The mock system includes realistic network delays to simulate actual API calls:

- **Geocoding**: 300ms delay
- **Weather**: 400ms delay
- **AI**: 800ms delay

These delays can be adjusted in `src/config/mock.config.js`:

```javascript
DELAYS: {
  geocoding: 300,
  weather: 400,
  ai: 800,
}
```

## Customizing Mock Data

### Adding New Weather Scenarios

Edit `src/config/mock.config.js` and add a new scenario:

```javascript
WEATHER: {
  scenarios: {
    // ... existing scenarios
    foggy: {
      temperature_2m: 55.0,
      relative_humidity_2m: 95,
      apparent_temperature: 52.0,
      precipitation: 0.1,
      weather_code: 45,  // Fog
      wind_speed_10m: 3.5,
      is_day: 1,
    },
  },
}
```

Then use it:
```bash
VITE_MOCK_WEATHER_SCENARIO=foggy
```

### Adding New AI Responses

Add responses to the `alternatives` array in `mock.config.js`:

```javascript
AI: {
  alternatives: [
    // ... existing responses
    "Oh, you're from Cambridge. That means you probably have strong opinions about which pizza is the best...",
  ],
}
```

### Changing the Mock Location

Update the `CITY` object in `mock.config.js`:

```javascript
CITY: {
  name: 'San Francisco',
  fullLocation: 'San Francisco, California, USA',
  latitude: 37.7749,
  longitude: -122.4194,
  geocodeResult: {
    // ... update with San Francisco data
  },
}
```

## Console Logging

When mock mode is active, you'll see console messages:

```
[MOCK MODE] Using mock geocoding data
[MOCK MODE] Using mock weather data
[MOCK MODE] Using mock AI response
```

This helps you verify which APIs are being mocked during development.

## Best Practices

1. **Use `.env.local` for local development** - Keep your local mock settings separate from the example
2. **Commit `.env.example`** - Help other developers understand available options
3. **Don't commit `.env`** - Keep your actual API keys and local settings private
4. **Test both mocked and real APIs** - Ensure the app works in both modes
5. **Use random modes for demos** - Show variety in weather and AI responses

## Files Involved

- **`src/config/mock.config.js`** - Centralized mock data configuration
- **`src/geocoding.js`** - Geocoding with VITE_MOCK_CITY support
- **`src/services/weather.service.js`** - Weather API with VITE_MOCK_WEATHER support
- **`src/composables/useAI.js`** - AI service with VITE_MOCK_AI support
- **`.env.example`** - Example environment variables
- **`MOCK_MODE.md`** - This documentation file

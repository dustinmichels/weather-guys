# Project Context for Claude

## Project Overview

**weather-guys** is a Vue 3 + JavaScript web application that provides weather information with AI-powered commentary. The app gets the user's location, fetches current weather data, and generates conversational weather summaries using Google's Generative AI.

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: JavaScript
- **Build Tool**: Vite
- **Styling**: Bulma CSS framework + SASS
- **AI Integration**: Google Generative AI (`@google/genai`)
- **Weather API**: Open-Meteo (free weather API)
- **Icons**: Font Awesome
- **Package Manager**: Bun

## Project Structure

```
src/
├── App.vue                    # Main application component
├── main.js                    # Application entry point
├── components/
│   ├── AIResponse.vue         # AI response display component
│   ├── AnimatedCharacter.vue  # CSS-based animated character
│   ├── ThreeJSCharacter.vue   # Three.js 3D character
│   └── WeatherCard.vue        # Weather display component
├── composables/
│   ├── useAI.js              # AI service composable
│   ├── useLocation.js        # Geolocation composable
│   └── useWeather.js         # Weather data composable
├── services/
│   ├── ai.service.js         # Google AI integration
│   └── weather.service.js    # Weather API integration
├── config/
│   └── mock.config.js        # Mock mode configuration and data
├── constants/
│   └── index.js              # App constants
├── geocoding.js              # Location name resolution
└── prompts.js                # AI prompt templates
```

## Key Features

1. **Geolocation**: Uses browser's Geolocation API to get user coordinates
2. **Weather Fetching**: Retrieves current weather data from Open-Meteo API
3. **AI Commentary**: Generates conversational weather summaries using Google AI
4. **Responsive UI**: Bulma-based responsive design
5. **Mock Mode**: Comprehensive mock mode for development/testing without API calls
   - Individual mock controls for geocoding, weather, and AI
   - Multiple weather scenarios (sunny, rainy, snowy, etc.)
   - Configurable mock data and responses

## Environment Variables

Required environment variables (stored in `.env`):

- `VITE_GOOGLE_AI_KEY`: Google Generative AI API key

Optional mock mode variables (for development/testing):

- `VITE_MOCK_CITY`: Mock geocoding API (true/false)
- `VITE_MOCK_WEATHER`: Mock weather API (true/false)
- `VITE_MOCK_WEATHER_SCENARIO`: Weather scenario (default/sunny/rainy/snowy/thunderstorm/random)
- `VITE_MOCK_AI`: Mock AI API (true/false)
- `VITE_MOCK_AI_RANDOM`: Random AI responses (true/false)

See `.env.example` and `MOCK_MODE.md` for detailed mock mode documentation

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Format code
bun run format
```

## Architecture Notes

### Composables Pattern

The app uses Vue 3 composables for reusable logic:

- `useLocation()`: Manages geolocation state and operations
- `useAI()`: Handles AI service initialization and response generation
- `useWeather()`: Manages weather data fetching (if used)

### Data Flow

1. User clicks to get weather
2. App requests geolocation permission
3. Location coordinates are used to fetch weather from Open-Meteo
4. Weather data is sent to Google AI for commentary generation
5. Results are displayed in the UI

## API Integrations

### Open-Meteo API

- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Parameters**: latitude, longitude, current weather variables
- **Units**: Fahrenheit, mph, inches
- **No authentication required**

### Google Generative AI

- **Model**: Configured in `ai.service.js`
- **Purpose**: Generate conversational weather commentary
- **Authentication**: API key via environment variable

## Styling Approach

- Uses Bulma CSS framework for base styling
- SASS for custom styles
- Font Awesome for icons
- Responsive design patterns

## Code Style

- Prettier for formatting (config in `.prettierrc.json`)
- Vue 3 Composition API with `<script setup>`
- Async/await for asynchronous operations
- Ref/reactive for state management

## Development Notes

- Node version: ^20.19.0 || >=22.12.0 (specified in package.json)
- The project uses Bun as the package manager and runtime
- Vite DevTools plugin is available for Vue debugging

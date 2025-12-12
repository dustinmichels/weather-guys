// AI Configuration
export const AI_CONFIG = {
  DEFAULT_MODEL: 'gemini-2.0-flash-exp',
  API_KEY_ENV: 'VITE_GOOGLE_AI_KEY',
  API_KEY_URL: 'https://ai.google.dev/',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  GEOLOCATION_NOT_SUPPORTED: 'Geolocation is not supported by your browser',
  NO_LOCATION_PROVIDED: 'No location provided',
  AI_NOT_INITIALIZED: 'AI service not initialized',
  INVALID_API_KEY:
    '⚠️ Please set your VITE_GOOGLE_AI_KEY in the .env file. Get your API key from https://ai.google.dev/',
} as const

// UI Text
export const UI_TEXT = {
  APP_TITLE: 'Location Finder',
  BUTTON_READY: 'Ready?',
  BUTTON_LOADING: 'Getting location...',
  BUTTON_AI: 'Use AI 🤖',
  BUTTON_AI_LOADING: 'AI is thinking...',
  SECTION_AI_INSIGHTS: 'AI Insights:',
  SECTION_COORDINATES: 'Coordinates:',
  LABEL_LATITUDE: 'Latitude:',
  LABEL_LONGITUDE: 'Longitude:',
} as const

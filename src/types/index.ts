// Location types
export interface LocationData {
  latitude: number
  longitude: number
}

export interface LocationState {
  location: LocationData | null
  city: string | null
  fullLocation: string | null
  error: string | null
  loading: boolean
}

// AI types
export interface AIState {
  aiResponse: string | null
  aiLoading: boolean
}

export interface AIServiceConfig {
  apiKey: string
  model?: string
}

export interface GenerateContentOptions {
  prompt: string
  location: string
}

// Geocoding types
export interface GeocodingResult {
  address_components: Array<{
    long_name: string
    short_name: string
    types: string[]
  }>
  formatted_address: string
}

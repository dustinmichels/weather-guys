export interface GeocodeAddress {
  city?: string
  town?: string
  village?: string
  municipality?: string
  county?: string
  state?: string
  country?: string
  country_code?: string
  postcode?: string
  [key: string]: any
}

export interface GeocodeResult {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  display_name: string
  address: GeocodeAddress
  boundingbox: string[]
}

/**
 * Reverse geocode coordinates to get city/address information
 * Uses OpenStreetMap Nominatim API
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Promise with geocoding result or null if failed
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          // Nominatim usage policy requires User-Agent
          'User-Agent': 'VueLocationApp/1.0',
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: GeocodeResult = await response.json()
    return data
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}

/**
 * Extract city name from geocoding result
 * Tries multiple fields in order of preference
 * @param result - Geocoding result from reverseGeocode
 * @returns City name or 'Unknown' if not found
 */
export function getCityFromResult(result: GeocodeResult | null): string {
  if (!result?.address) return 'Unknown'

  return (
    result.address.city ||
    result.address.town ||
    result.address.village ||
    result.address.municipality ||
    'Unknown'
  )
}

/**
 * Get full location string from geocoding result
 * @param result - Geocoding result from reverseGeocode
 * @returns Formatted location string
 */
export function getFullLocationFromResult(result: GeocodeResult | null): string {
  if (!result?.address) return 'Unknown'

  const parts: string[] = []

  const city = getCityFromResult(result)
  if (city !== 'Unknown') parts.push(city)

  if (result.address.state) parts.push(result.address.state)
  if (result.address.country) parts.push(result.address.country)

  return parts.length > 0 ? parts.join(', ') : result.display_name
}

/**
 * Reverse geocode coordinates to get city/address information
 * Uses OpenStreetMap Nominatim API
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object|null>} Promise with geocoding result or null if failed
 */
export async function reverseGeocode(latitude, longitude) {
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

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}

/**
 * Extract city name from geocoding result
 * Tries multiple fields in order of preference
 * @param {Object|null} result - Geocoding result from reverseGeocode
 * @returns {string} City name or 'Unknown' if not found
 */
export function getCityFromResult(result) {
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
 * @param {Object|null} result - Geocoding result from reverseGeocode
 * @returns {string} Formatted location string
 */
export function getFullLocationFromResult(result) {
  if (!result?.address) return 'Unknown'

  const parts = []

  const city = getCityFromResult(result)
  if (city !== 'Unknown') parts.push(city)

  if (result.address.state) parts.push(result.address.state)
  if (result.address.country) parts.push(result.address.country)

  return parts.length > 0 ? parts.join(', ') : result.display_name
}

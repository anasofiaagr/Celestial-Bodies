// geocoding.ts
// Geocoding utility using OpenStreetMap Nominatim API (free, no API key required)

export interface GeocodingResult {
  place_id?: number;
  osm_id?: number;
  osm_type?: string;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
    country_code?: string;
    state?: string;
  };
}

/**
 * Search for locations using OpenStreetMap Nominatim API
 * @param query - Location search query (e.g., "London", "New York, USA")
 * @returns Array of geocoding results
 */
export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: query,
          format: "json",
          addressdetails: "1",
          limit: "5",
        }),
      {
        headers: {
          // Nominatim requires a User-Agent header
          "User-Agent": "CosmicHousesApp/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error("Failed to search location. Please try again.");
  }
}

/**
 * Get the primary city name from a geocoding result
 * Tries multiple fields in order of preference
 */
export function getCityName(result: GeocodingResult): string {
  return (
    result.address.city ||
    result.address.town ||
    result.address.village ||
    result.address.municipality ||
    result.display_name.split(",")[0] ||
    ""
  ).trim();
}

/**
 * Get the country code from a geocoding result
 */
export function getCountryCode(result: GeocodingResult): string {
  return (result.address.country_code || "").toUpperCase();
}

/**
 * Guess timezone from latitude and longitude
 * This is a simplified approximation - for production use, consider a dedicated timezone API
 */
export function guessTimezone(lat: number, lon: number): string {
  // Simple timezone estimation based on longitude
  // Each 15 degrees of longitude ≈ 1 hour time difference
  const offsetHours = Math.round(lon / 15);
  
  // Map common regions to timezones
  // This is a simplified approach - real implementation would need a proper timezone database
  if (lat > 45 && lon > -130 && lon < -60) return "America/New_York";
  if (lat > 30 && lon > -130 && lon < -100) return "America/Denver";
  if (lat > 30 && lon > -125 && lon < -115) return "America/Los_Angeles";
  if (lat > 25 && lon > -100 && lon < -80) return "America/Chicago";
  
  // Brazil (includes DST handling)
  if (lat < 5 && lat > -35 && lon > -75 && lon < -35) return "America/Sao_Paulo";
  
  if (lat > 35 && lon > -10 && lon < 15) return "Europe/London";
  if (lat > 35 && lon > -5 && lon < 30) return "Europe/Paris";
  if (lat > 20 && lon > 110 && lon < 155) return "Asia/Tokyo";
  if (lat > 15 && lon > 100 && lon < 120) return "Asia/Shanghai";
  if (lat > 0 && lon > 65 && lon < 95) return "Asia/Kolkata";
  if (lat < -25 && lon > 110 && lon < 155) return "Australia/Sydney";
  
  // Fallback to UTC offset
  return `Etc/GMT${offsetHours >= 0 ? "-" : "+"}${Math.abs(offsetHours)}`;
}
# Geocoding Integration

## Overview

The Cosmic Houses app now includes automatic location geocoding, eliminating the need to manually enter latitude/longitude coordinates.

## Features

### 🌍 Location Search

- **Auto-complete search** - Type any city or location name
- **Real-time suggestions** - Powered by OpenStreetMap Nominatim API
- **No API key required** - Free and open-source geocoding service
- **Accurate coordinates** - Automatically fetches precise lat/long values

### ⏰ Automatic Timezone Detection

- Timezone is automatically estimated based on coordinates
- Manual override available through dropdown selector
- 30+ pre-configured timezone options worldwide

## How It Works

### Components

1. **`LocationSearch.tsx`**
   - Search input with debounced API calls (500ms)
   - Dropdown with up to 5 location suggestions
   - Click-outside detection to close dropdown
   - Visual feedback (loading spinner, checkmark)

2. **`geocoding.ts`** utility
   - `searchLocation()` - Queries OpenStreetMap Nominatim API
   - `getCityName()` - Extracts city name from results
   - `getCountryCode()` - Extracts 2-letter country code
   - `guessTimezone()` - Estimates timezone from coordinates

### Updated Onboarding Flow

**Step 3: Location Entry**

- Search box appears at top
- Type location name (e.g., "London", "New York, USA", "Tokyo")
- Select from autocomplete suggestions
- View extracted data (city, country, lat, long)
- Optionally adjust timezone if auto-detection is incorrect

## API Details

### OpenStreetMap Nominatim

- **Endpoint**: `https://nominatim.openstreetmap.org/search`
- **Rate Limit**: 1 request per second (handled by 500ms debounce)
- **Documentation**: https://nominatim.org/release-docs/develop/api/Search/
- **Terms**: Free for fair use, requires User-Agent header

### Response Format

```json
[
  {
    "display_name": "London, Greater London, England, United Kingdom",
    "lat": "51.5074",
    "lon": "-0.1278",
    "address": {
      "city": "London",
      "country": "United Kingdom",
      "country_code": "gb"
    }
  }
]
```

## Usage Example

```typescript
import LocationSearch from "./LocationSearch";

<LocationSearch
  onLocationSelect={(location) => {
    console.log(location.city);      // "London"
    console.log(location.country);   // "GB"
    console.log(location.latitude);  // 51.5074
    console.log(location.longitude); // -0.1278
    console.log(location.timezone);  // "Europe/London"
  }}
  initialValue=""
/>
```

## Timezone Estimation

The `guessTimezone()` function provides a simplified timezone estimation:

- Maps coordinates to common timezone regions
- Fallback to UTC offset calculation
- Users can manually override if needed

**Note**: For production apps requiring precise timezone data, consider using a dedicated timezone API like:

- Google Time Zone API
- GeoNames API
- TimeZoneDB

## Benefits

✅ **Better UX** - No need to look up coordinates manually  
✅ **Fewer Errors** - Reduces invalid coordinate entries  
✅ **Faster Input** - Type location name vs manual lat/long  
✅ **Mobile Friendly** - Works great on all devices  
✅ **No Costs** - Free API with reasonable limits

## Future Enhancements

Potential improvements:

- [ ] Add browser geolocation for "Use my location" button
- [ ] Integrate more accurate timezone database
- [ ] Cache recent searches for faster repeat lookups
- [ ] Add location history/favorites
- [ ] Support for coordinates paste detection (e.g., "51.5074, -0.1278")
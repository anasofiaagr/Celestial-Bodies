// AstrologyApiClient.ts
// API client for the Astrologer API via RapidAPI

// RapidAPI key for Astrologer API
const ASTROLOGER_API_KEY = "67849484c7mshca0cd2e16dc5081p1f0c35jsn3b5dc991b1de";

export type AstroSubject = {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  city: string;
  nation: string; // 2-letter country code
  timezone: string; // e.g. "Europe/London"
  zodiac_type?: "Tropic" | "Sidereal";
  sidereal_mode?: string | null;
  perspective_type?: string;
  houses_system_identifier?: string; // default "P" (Placidus)
};

export type ApiPlanet = {
  name: string;
  sign: string;
  house_id: number;
  degree: number;
  dignity?: string;
  retrograde?: boolean;
  declination?: number;
};

export type ApiHouse = {
  id: number;
  sign: string;
  cusp_degree: number;
  size?: number;
};

export type ApiAspect = {
  p1_name: string;
  p2_name: string;
  type: string; // e.g. "conjunction", "trine", "square", etc.
  orb: number;
  exact: boolean;
  applying?: boolean;
};

export type BirthChartResponse = {
  planets: ApiPlanet[];
  houses: ApiHouse[];
  aspects?: ApiAspect[];
  subject?: AstroSubject;
  [key: string]: any;
};

/**
 * Fetches birth chart data from the Astrologer API
 * @param subject - Birth data for the subject
 * @returns Promise<BirthChartResponse>
 */
export async function fetchBirthChart(
  subject: AstroSubject
): Promise<BirthChartResponse> {
  if (!ASTROLOGER_API_KEY) {
    throw new Error(
      "ASTROLOGER_API_KEY is not set. Please set REACT_APP_ASTROLOGER_API_KEY in your environment."
    );
  }

  const endpoint = "https://astrologer.p.rapidapi.com/api/v4/birth-chart";

  const payload = {
    subject: {
      ...subject,
      zodiac_type: subject.zodiac_type || "Tropic",
      perspective_type: subject.perspective_type || "Apparent Geocentric",
      houses_system_identifier: subject.houses_system_identifier || "P",
      sidereal_mode: subject.sidereal_mode || null,
    },
    theme: "classic",
    language: "EN",
    wheel_only: false,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "astrologer.p.rapidapi.com",
        "x-rapidapi-key": ASTROLOGER_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Handle specific error cases
      if (response.status === 429) {
        // Quota exceeded error
        throw new Error(
          `API quota limit reached. Please upgrade your RapidAPI plan or wait for the quota to reset. Visit: https://rapidapi.com/gbattaglia/api/astrologer to manage your subscription.`
        );
      }
      
      throw new Error(
        `Astrologer API error (${response.status}): ${errorText}`
      );
    }

    const data: BirthChartResponse = await response.json();

    // Log the response structure for debugging
    console.log("API Response received successfully");
    console.log("📋 RAW API Response Structure:");
    console.log("  - data exists:", !!data.data);
    console.log("  - data.data keys:", data.data ? Object.keys(data.data).slice(0, 20) : []);

    // The Astrologer API returns data nested under 'data' property
    // Planets are individual properties, not an array
    // Houses are also individual properties
    
    if (!data.data) {
      console.error("Full API response:", data);
      throw new Error("Invalid response from Astrologer API: missing data object");
    }

    const apiData = data.data;
    
    // Log a sample house to see its structure
    console.log("📊 Sample House Data (first_house):", apiData.first_house);

    // Extract planets from individual properties into an array
    const planetNames = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    const planets: ApiPlanet[] = planetNames.map(name => {
      const planet = apiData[name];
      if (!planet) return null;
      
      console.log(`  🔍 Planet ${name}:`, {
        name: planet.name,
        sign: planet.sign,
        house: planet.house,
        abs_pos: planet.abs_pos,
        retrograde: planet.retrograde
      });
      
      return {
        name: planet.name,
        sign: getFullSignName(planet.sign),
        house_id: getHouseNumber(planet.house),
        degree: planet.abs_pos,
        retrograde: planet.retrograde || false,
      };
    }).filter((p): p is ApiPlanet => p !== null);

    console.log(`✅ Extracted ${planets.length} planets`);

    // Extract houses from individual properties into an array
    const houseNames = [
      'first_house', 'second_house', 'third_house', 'fourth_house',
      'fifth_house', 'sixth_house', 'seventh_house', 'eighth_house',
      'ninth_house', 'tenth_house', 'eleventh_house', 'twelfth_house'
    ];
    
    const houses: ApiHouse[] = houseNames.map((name, index) => {
      const house = apiData[name];
      if (!house) {
        console.warn(`  ⚠️ House ${name} not found in API data`);
        return null;
      }
      
      console.log(`  📊 ${name}:`, {
        sign: house.sign,
        abs_pos: house.abs_pos
      });
      
      return {
        id: index + 1,
        sign: getFullSignName(house.sign),
        cusp_degree: house.abs_pos,
      };
    }).filter((h): h is ApiHouse => h !== null);
    
    console.log(`✅ Extracted ${houses.length} houses`);

    // Extract aspects from the API response
    // Aspects can be in data.aspects or data.data.aspects
    const aspectsData = data.data?.aspects || data.aspects || [];
    console.log('📊 Aspects data structure:', aspectsData.length > 0 ? aspectsData[0] : 'No aspects found');
    console.log('📊 Total aspects in API response:', aspectsData.length);
    console.log('📊 First 3 aspects (raw):', aspectsData.slice(0, 3));
    
    const aspects: ApiAspect[] = aspectsData.map((aspect: any, index: number) => {
      if (index < 3) {
        console.log(`  📍 Aspect ${index} raw data (ALL FIELDS):`, JSON.stringify(aspect, null, 2));
      }
      
      const mappedAspect = {
        p1_name: aspect.p1_name || aspect.planet1 || aspect.from,
        p2_name: aspect.p2_name || aspect.planet2 || aspect.to,
        type: aspect.aspect || aspect.type || '',
        orb: Math.abs(aspect.orbit || aspect.orb || 0),
        exact: Math.abs(aspect.orbit || aspect.orb || 0) < 1,
        applying: (aspect.orbit || aspect.orb || 0) < 0,
      };
      
      if (index < 3) {
        console.log(`  ✅ Mapped to ApiAspect:`, mappedAspect);
      }
      
      return mappedAspect;
    });

    return {
      ...data,      // Spread first
      planets,      // Then overwrite with clean data
      houses,
      aspects,      // This now overwrites any raw aspects data
      subject,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch birth chart: ${error.message}`);
    }
    throw new Error("Failed to fetch birth chart: Unknown error");
  }
}

// Helper function to convert house name to number
function getHouseNumber(houseName: string): number {
  const houseMap: Record<string, number> = {
    'First_House': 1,
    'Second_House': 2,
    'Third_House': 3,
    'Fourth_House': 4,
    'Fifth_House': 5,
    'Sixth_House': 6,
    'Seventh_House': 7,
    'Eighth_House': 8,
    'Ninth_House': 9,
    'Tenth_House': 10,
    'Eleventh_House': 11,
    'Twelfth_House': 12,
  };
  
  return houseMap[houseName] || 1;
}

// Helper function to convert sign abbreviations to full names
function getFullSignName(abbr: string): string {
  const signMap: Record<string, string> = {
    'Ari': 'Aries',
    'Tau': 'Taurus',
    'Gem': 'Gemini',
    'Can': 'Cancer',
    'Leo': 'Leo',
    'Vir': 'Virgo',
    'Lib': 'Libra',
    'Sco': 'Scorpio',
    'Sag': 'Sagittarius',
    'Cap': 'Capricorn',
    'Aqu': 'Aquarius',
    'Pis': 'Pisces',
  };
  
  return signMap[abbr] || abbr;
}
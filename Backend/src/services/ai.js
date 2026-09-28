// src/services/ai.js
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

// Supported Gemini Models (in order of priority)
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash'];

/**
 * Call Gemini REST API with fallback models
 */
async function callGemini(promptText) {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.warn(`[Gemini ${model}] HTTP error:`, data?.error?.message || response.status);
        continue;
      }

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        let text = data.candidates[0].content.parts[0].text.trim();
        text = text.replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        const firstBracket = text.indexOf('[');
        const lastBracket = text.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
          text = text.substring(firstBracket, lastBracket + 1);
        } else {
          const firstBrace = text.indexOf('{');
          const lastBrace = text.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            text = text.substring(firstBrace, lastBrace + 1);
          }
        }
        return JSON.parse(text);
      }
    } catch (err) {
      console.warn(`[Gemini ${model}] failed:`, err.message);
    }
  }

  throw new Error('All Gemini API models failed or returned non-JSON response');
}

/**
 * Procedural Fallback Generator customized dynamically to ANY destination
 */
function generateProceduralPlan({ destination, origin, budget = 1500 }) {
  const destName = destination || 'Destination';
  const startLoc = origin || 'Home';
  const budgetVal = Number(budget) || 1500;

  return [
    {
      day: 'Day 1',
      title: `Arrival & Historic Center of ${destName}`,
      activities: [
        {
          id: `act-1-1`,
          time: '09:00 AM',
          title: `Transit & Arrival from ${startLoc}`,
          location: `${destName} Central Station`,
          category: 'transport',
          duration: 120,
          cost: Math.round(budgetVal * 0.08),
          notes: `Check into hotel and grab lunch near the city center.`,
        },
        {
          id: `act-1-2`,
          time: '02:00 PM',
          title: `${destName} Iconic Landmarks & Heritage Walk`,
          location: `${destName} Old Town`,
          category: 'culture',
          duration: 180,
          cost: Math.round(budgetVal * 0.04),
          notes: `Explore architectural monuments and scenic pedestrian streets.`,
        },
        {
          id: `act-1-3`,
          time: '07:30 PM',
          title: `Traditional Regional Dinner Experience`,
          location: `${destName} Historic Quarter`,
          category: 'food',
          duration: 120,
          cost: Math.round(budgetVal * 0.05),
          notes: `Taste authentic local specialities and desserts.`,
        },
      ],
    },
    {
      day: 'Day 2',
      title: `Immersive Arts, Nature & Local Culture in ${destName}`,
      activities: [
        {
          id: `act-2-1`,
          time: '09:30 AM',
          title: `${destName} Premier Museum & Gallery`,
          location: `${destName} Arts District`,
          category: 'culture',
          duration: 150,
          cost: Math.round(budgetVal * 0.05),
          notes: `Discover world-class collections and historical artifacts.`,
        },
        {
          id: `act-2-2`,
          time: '01:30 PM',
          title: `Panoramic Viewpoint & Garden Walk`,
          location: `${destName} Hilltop or Waterfront`,
          category: 'nature',
          duration: 120,
          cost: Math.round(budgetVal * 0.02),
          notes: `Unwind with scenic photo spots and panoramic skyline views.`,
        },
        {
          id: `act-2-3`,
          time: '06:00 PM',
          title: `Night Market & Evening Leisure`,
          location: `${destName} Downtown Promenade`,
          category: 'shopping',
          duration: 150,
          cost: Math.round(budgetVal * 0.06),
          notes: `Stroll through artisan vendors, souvenir shops, and cafes.`,
        },
      ],
    },
    {
      day: 'Day 3',
      title: `Local Flavors & Scenic Excursion`,
      activities: [
        {
          id: `act-3-1`,
          time: '10:00 AM',
          title: `Local Artisan Markets & Delicacies`,
          location: `${destName} Central Market`,
          category: 'food',
          duration: 120,
          cost: Math.round(budgetVal * 0.04),
          notes: `Sample fresh seasonal street food and buy artisan souvenirs.`,
        },
        {
          id: `act-3-2`,
          time: '03:30 PM',
          title: `Farewell Sightseeing Tour of ${destName}`,
          location: `${destName} Promenade`,
          category: 'landmark',
          duration: 90,
          cost: Math.round(budgetVal * 0.03),
          notes: `Take in final photos and views before packing bags.`,
        },
      ],
    },
  ];
}

/**
 * Generate full AI itinerary for PlanTrip (day-grouped + flat items)
 */
async function generatePlan(params) {
  const destination = params.destination || 'Rome, Italy';
  const origin = params.startingLocation || params.origin || 'Home';
  const startDate = params.startDate || '2026-10-01';
  const endDate = params.endDate || '2026-10-04';
  const budget = params.budget || 1500;
  const preferences = Array.isArray(params.preferences) ? params.preferences : ['Culture', 'Food'];
  const pace = params.pace || 'balanced';

  const prompt = `You are an elite travel routing engine and world-class tour planner.
Generate an extraordinary 3-day itinerary for a trip specifically to "${destination}" (starting from "${origin}").
Preferences: ${preferences.join(', ')} | Pace: ${pace} | Budget: $${budget} USD.

CRITICAL REQUIREMENTS:
1. Specific to "${destination}": Use REAL landmarks, neighborhoods, streets, restaurants, transit hubs, and authentic attractions in ${destination}.
2. Continuous Path: Each day must follow a geographically sensible progression from morning to night.
3. Return a valid JSON array of 3 days.
Each day object must have:
- "day": string (e.g. "Day 1", "Day 2", "Day 3")
- "title": string (engaging theme for the day)
- "activities": array of 3-4 activities with:
  - "id": string (unique, e.g. "act-1-1")
  - "time": string (e.g. "09:00 AM")
  - "title": string (real name of place/activity in ${destination})
  - "location": string (real address, area, or landmark in ${destination})
  - "category": string ("culture" | "food" | "nature" | "adventure" | "landmark" | "shopping" | "transport")
  - "duration": number (minutes)
  - "cost": number (estimated USD)
  - "notes": string (why visit, tips, instructions)

Output ONLY the raw JSON array.`;

  try {
    const days = await callGemini(prompt);
    if (Array.isArray(days) && days.length > 0 && days[0].activities) {
      console.log(`🤖 [GEMINI AI SUCCESS] Generated ${days.length} days for ${destination}`);
      
      // Also construct flat items array for DB compatibility
      const flatItems = [];
      days.forEach((dayPlan, dIdx) => {
        (dayPlan.activities || []).forEach((act, aIdx) => {
          flatItems.push({
            id: act.id || `ai-${dIdx}-${aIdx}`,
            custom_name: act.title || act.custom_name,
            category: act.category || 'activity',
            cost: typeof act.cost === 'number' ? act.cost : 25,
            scheduled_date: startDate,
            scheduled_time: act.time || '10:00:00',
            duration_minutes: act.duration || 90,
            location: act.location || destination,
            notes: act.notes || '',
          });
        });
      });

      return {
        success: true,
        destination,
        days,
        itinerary: days,
        items: flatItems,
        generated_items: flatItems,
      };
    }
  } catch (err) {
    console.warn(`[AI generatePlan] Gemini call failed for ${destination}, falling back to dynamic procedural plan:`, err.message);
  }

  // Fallback if AI call failed
  const proceduralDays = generateProceduralPlan({ destination, origin, budget });
  const flatItems = [];
  proceduralDays.forEach((dayPlan, dIdx) => {
    (dayPlan.activities || []).forEach((act, aIdx) => {
      flatItems.push({
        id: act.id || `proc-${dIdx}-${aIdx}`,
        custom_name: act.title,
        category: act.category,
        cost: act.cost,
        scheduled_date: startDate,
        scheduled_time: act.time,
        duration_minutes: act.duration,
        location: act.location,
        notes: act.notes,
      });
    });
  });

  return {
    success: true,
    destination,
    days: proceduralDays,
    itinerary: proceduralDays,
    items: flatItems,
    generated_items: flatItems,
  };
}

/**
 * Legacy/Trip-based generator (called by /trips/:tripId/generate)
 */
async function generateItinerary(trip, stops, preferences) {
  const primaryStopId = stops && stops.length > 0 ? (stops[stops.length - 1].id || stops[0].id) : 1;
  const destinationCity = (stops && stops.length > 0 && stops[stops.length - 1].city_name)
    ? stops[stops.length - 1].city_name
    : trip.title || 'Destination';

  const prompt = `You are an elite travel routing engine and expert local guide. 
Generate a comprehensive itinerary for a trip to "${destinationCity}".
Trip Details:
- Title: ${trip.title}
- Dates: ${trip.start_date} to ${trip.end_date}
- City Stops: ${JSON.stringify(stops)}
- User Preferences: Interests: ${(preferences.interests || []).join(', ')} | Pace: ${preferences.pace || 'relaxed'} | Budget Tier: ${preferences.budgetTier || 'moderate'}

CRITICAL INSTRUCTIONS:
1. Continuous Path routing: Plan a realistic, step-by-step route for each day in "${destinationCity}".
2. Volume: Provide 3-5 items per day.
3. Specificity: Use actual real-world places, restaurants, transit hubs, and landmarks for "${destinationCity}".
4. Notes Field: Explain why to visit and practical tips.
5. stop_id: Set "stop_id" field for all items to the integer ${primaryStopId}.

Return ONLY a valid JSON array matching this schema:
[
  {
    "stop_id": ${primaryStopId},
    "custom_name": "string",
    "category": "activity",
    "cost": 25,
    "scheduled_date": "${trip.start_date}",
    "scheduled_time": "10:00:00",
    "duration_minutes": 90,
    "notes": "string"
  }
]`;

  try {
    const itemsArray = await callGemini(prompt);
    const sanitizedItems = (Array.isArray(itemsArray) ? itemsArray : [itemsArray]).map((item) => ({
      ...item,
      stop_id: item.stop_id || primaryStopId,
      category: ['transport', 'accommodation', 'food', 'activity', 'other'].includes(item.category)
        ? item.category
        : 'activity',
      cost: typeof item.cost === 'number' ? item.cost : parseInt(item.cost, 10) || 25,
      scheduled_date: item.scheduled_date || trip.start_date,
      scheduled_time: item.scheduled_time || '10:00:00',
      duration_minutes: item.duration_minutes || 90,
    }));

    console.log(`🤖 [GEMINI AI SUCCESS] Generated ${sanitizedItems.length} places for ${destinationCity}`);
    return sanitizedItems;
  } catch (err) {
    console.warn(`[AI generateItinerary] Gemini call failed for ${destinationCity}:`, err.message);
    // Procedural fallback items for this stop
    return [
      {
        stop_id: primaryStopId,
        custom_name: `${destinationCity} Historic Center Walk`,
        category: 'activity',
        cost: 15,
        scheduled_date: trip.start_date,
        scheduled_time: '09:30:00',
        duration_minutes: 120,
        notes: `Explore central landmarks and architecture in ${destinationCity}.`,
      },
      {
        stop_id: primaryStopId,
        custom_name: `Local Traditional Lunch in ${destinationCity}`,
        category: 'food',
        cost: 25,
        scheduled_date: trip.start_date,
        scheduled_time: '13:00:00',
        duration_minutes: 90,
        notes: `Authentic regional dishes and local flavors.`,
      },
      {
        stop_id: primaryStopId,
        custom_name: `${destinationCity} Iconic Viewpoint & Market`,
        category: 'activity',
        cost: 20,
        scheduled_date: trip.start_date,
        scheduled_time: '16:00:00',
        duration_minutes: 120,
        notes: `Panoramic views and local artisanal shopping.`,
      },
    ];
  }
}

module.exports = { generateItinerary, generatePlan };
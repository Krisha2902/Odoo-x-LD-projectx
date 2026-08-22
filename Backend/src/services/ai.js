// src/services/ai.js
require('dotenv').config();
const https = require('https');

async function generateItinerary(trip, stops, preferences) {
  const API_KEY = process.env.GEMINI_API_KEY; 

  console.log("=== GEMINI API KEY DEBUG ===");
  console.log("Key exists?:", !!API_KEY);
  console.log("============================");

  const primaryStopId = stops && stops.length > 0 ? (stops[stops.length - 1].id || stops[0].id) : 1;

  const prompt = `
You are an elite travel routing engine and expert local guide. 
Your task is to generate a comprehensive, highly detailed, and geographically logical itinerary for the following trip.

Trip Details:
- Title: ${trip.title}
- Dates: ${trip.start_date} to ${trip.end_date}
- City Stops: ${JSON.stringify(stops)}
- User Preferences: Interests: ${(preferences.interests || []).join(', ')} | Pace: ${preferences.pace || 'relaxed'} | Budget Tier: ${preferences.budgetTier || 'moderate'}

CRITICAL INSTRUCTIONS:
1. Continuous Path routing: Plan a realistic, step-by-step route for each day. Start from a logical morning point, move geographically through neighborhoods, and end at an evening spot. 
2. Volume: Provide 3-5 items per day.
3. Specificity: Use actual real-world places, restaurants, transit hubs, and landmarks for the destination city.
4. Notes Field: Explain why to visit, what to do, and travel directions from the prior item.
5. stop_id: Set "stop_id" field for all items to the integer ${primaryStopId}.

Return ONLY a valid JSON array matching this exact schema, with no markdown formatting outside the array:
[
  {
    "stop_id": ${primaryStopId},
    "custom_name": "string",
    "category": "transport",
    "cost": 25,
    "scheduled_date": "${trip.start_date}",
    "scheduled_time": "10:00:00",
    "duration_minutes": 90,
    "notes": "string"
  }
]
`;

  const requestData = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode !== 200) {
            console.error("Google Gemini API error status:", res.statusCode, parsedData);
            return reject(new Error(`Google API Error: ${JSON.stringify(parsedData)}`));
          }
          
          let textResponse = parsedData.candidates[0].content.parts[0].text.trim();
          // Strip markdown code fences if Gemini wraps in ```json ... ```
          textResponse = textResponse.replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '').trim();

          const itemsArray = JSON.parse(textResponse);
          // Ensure valid stop_id mapping
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

          console.log(`🤖 [GEMINI AI SUCCESS] Generated ${sanitizedItems.length} places from Gemini API.`);
          resolve(sanitizedItems);
        } catch (e) {
          console.error("Failed to parse Gemini AI response:", e.message, "Raw data:", data);
          reject(new Error(`Failed to parse AI response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error("HTTPS request error to Gemini API:", error);
      reject(error);
    });

    req.write(requestData);
    req.end();
  });
}

module.exports = { generateItinerary };
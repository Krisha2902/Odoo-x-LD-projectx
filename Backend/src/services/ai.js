// src/services/ai.js
require('dotenv').config();
const https = require('https');

async function generateItinerary(trip, stops, preferences) {
  const API_KEY = process.env.GEMINI_API_KEY; 

  // --- DEBUG LOGS ---
  console.log("=== GEMINI API KEY DEBUG ===");
  console.log("Key exists?:", !!API_KEY);
  console.log("Key value starts with:", API_KEY ? API_KEY.substring(0, 5) + "..." : "UNDEFINED");
  console.log("============================");

  const prompt = `
You are an elite travel routing engine and expert local guide. 
Your task is to generate a comprehensive, highly detailed, and geographically logical itinerary for the following trip.

Trip Details:
- Title: ${trip.title}
- Dates: ${trip.start_date} to ${trip.end_date}
- City Stops: ${JSON.stringify(stops)}
- User Preferences: Interests: ${preferences.interests.join(', ')} | Pace: ${preferences.pace} | Budget Tier: ${preferences.budgetTier}

CRITICAL INSTRUCTIONS:
1. Continuous Path routing: Plan a realistic, step-by-step route for each day. Start from a logical morning point, move geographically through neighborhoods, and end at an evening spot. 
2. Volume: For "packed" pace, provide 4-6 items per day. For "relaxed", provide 2-4 items per day.
3. Specificity: Use actual real-world places, restaurants, transit hubs, and landmarks.
4. Notes Field: Explain why to visit, what to do, and travel directions from the prior item.

Return ONLY a valid JSON array matching this exact schema, with no markdown formatting outside the array:
[
  {
    "stop_id": number,
    "custom_name": string,
    "category": "transport" | "accommodation" | "food" | "activity" | "other",
    "cost": number,
    "scheduled_date": "YYYY-MM-DD",
    "scheduled_time": "HH:MM:SS",
    "duration_minutes": number,
    "notes": string
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
    // Updated path to use gemini-3.5-flash
    path: `/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`,
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
            return reject(new Error(`Google API Error: ${JSON.stringify(parsedData)}`));
          }
          
          const textResponse = parsedData.candidates[0].content.parts[0].text.trim();
          resolve(JSON.parse(textResponse));
        } catch (e) {
          reject(new Error(`Failed to parse AI response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(requestData);
    req.end();
  });
}

module.exports = { generateItinerary };
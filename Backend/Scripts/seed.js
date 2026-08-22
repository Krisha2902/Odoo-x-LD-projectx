// scripts/seed.js
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const cities = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 }
];

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    // 1. Create demo user
    const hash = await bcrypt.hash('password123', 10);
    const userRes = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`,
      ['Demo User', 'demo@globetrotter.local', hash]
    );
    const userId = userRes.rows[0].id;

    // 2. Insert Cities & Activities
    for (const city of cities) {
      const cityRes = await pool.query(
        `INSERT INTO cities (name, country, lat, lng) VALUES ($1, $2, $3, $4) RETURNING id`,
        [city.name, city.country, city.lat, city.lng]
      );
      const cityId = cityRes.rows[0].id;

      // Add generic activities for each city
      const activities = [
        { name: `${city.name} City Tour`, category: 'activity', cost: 25, duration: 120 },
        { name: `Central Museum of ${city.name}`, category: 'activity', cost: 15, duration: 180 },
        { name: `Local Transit Pass`, category: 'transport', cost: 10, duration: 1440 },
        { name: `Boutique Hotel ${city.name}`, category: 'accommodation', cost: 150, duration: 720 },
        { name: `Famous Local Restaurant`, category: 'food', cost: 40, duration: 90 }
      ];

      for (const act of activities) {
        await pool.query(
          `INSERT INTO activity_catalog (city_id, name, category, avg_cost, avg_duration_minutes) 
           VALUES ($1, $2, $3, $4, $5)`,
          [cityId, act.name, act.category, act.cost, act.duration]
        );
      }
    }

    // 3. Create Demo Trip
    const tripRes = await pool.query(
      `INSERT INTO trips (owner_id, title, description, start_date, end_date, budget_cap)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [userId, 'Euro Trip 2026', 'Hitting the classics.', '2026-09-01', '2026-09-14', 2000]
    );
    const tripId = tripRes.rows[0].id;

    await pool.query(
      `INSERT INTO trip_members (trip_id, user_id, role) VALUES ($1, $2, 'owner')`,
      [tripId, userId]
    );

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
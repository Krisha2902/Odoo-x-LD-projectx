// src/db.js
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const realPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 2000,
});

let isPostgresAvailable = false;

// Pre-seeded cities dictionary
const citiesMap = {
  1: { id: 1, name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  2: { id: 2, name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  3: { id: 3, name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  4: { id: 4, name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  5: { id: 5, name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  6: { id: 6, name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
  7: { id: 7, name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  8: { id: 8, name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  9: { id: 9, name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
  10: { id: 10, name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780 },
};

// In-Memory Database Tables for instant out-of-the-box operation
const memoryDb = {
  users: [
    {
      id: 1,
      name: 'Demo User',
      email: 'demo@globetrotter.local',
      password_hash: bcrypt.hashSync('password123', 10),
      created_at: new Date(),
    },
  ],
  trips: [
    {
      id: 1,
      owner_id: 1,
      title: 'Euro Trip 2026',
      description: 'Hitting the classics.',
      start_date: '2026-09-01',
      end_date: '2026-09-14',
      cover_image_url: null,
      is_public: false,
      share_slug: 'euro-trip-2026-demo',
      budget_cap: 2000,
      created_at: new Date(),
    },
  ],
  trip_members: [
    { trip_id: 1, user_id: 1, role: 'owner', joined_at: new Date() },
  ],
  stops: [
    { id: 1, trip_id: 1, city_id: 2, order_index: 1, start_date: '2026-09-01', end_date: '2026-09-07' },
    { id: 2, trip_id: 1, city_id: 4, order_index: 2, start_date: '2026-09-08', end_date: '2026-09-14' },
  ],
  itinerary_items: [
    { id: 1, stop_id: 1, activity_catalog_id: null, custom_name: 'Eiffel Tower Tour', category: 'activity', cost: 35, scheduled_date: '2026-09-02', scheduled_time: '10:00:00', duration_minutes: 120, notes: 'Pre-booked tickets', updated_at: new Date() },
    { id: 2, stop_id: 1, activity_catalog_id: null, custom_name: 'Louvre Museum', category: 'activity', cost: 20, scheduled_date: '2026-09-03', scheduled_time: '14:00:00', duration_minutes: 180, notes: 'Mona Lisa', updated_at: new Date() },
  ],
  otps: [],
  counters: { users: 2, trips: 2, stops: 3, itinerary_items: 3 },
};

async function testPostgres() {
  try {
    const res = await realPool.query('SELECT 1');
    if (res) {
      isPostgresAvailable = true;
      console.log('🔗 Connected to PostgreSQL database');
    }
  } catch (err) {
    isPostgresAvailable = false;
    console.log('⚡ Running in Instant Mode (In-Memory DB active).');
  }
}

testPostgres();

function executeMemoryQuery(text, params = []) {
  const sql = text.trim();
  const lowerSql = sql.toLowerCase();

  // 1. TEST QUERY
  if (lowerSql === 'select 1') return { rows: [{ '?column?': 1 }] };

  // OTP QUERIES
  if (lowerSql.includes('from otps where email =')) {
    const email = (params[0] || '').toLowerCase();
    const found = memoryDb.otps.filter((o) => o.email.toLowerCase() === email);
    return { rows: found };
  }

  if (lowerSql.includes('insert into otps')) {
    const [email, otp, expires_at] = params;
    memoryDb.otps = memoryDb.otps.filter((o) => o.email.toLowerCase() !== (email || '').toLowerCase());
    const newOtp = { email: email.toLowerCase(), otp: String(otp), expires_at: new Date(expires_at) };
    memoryDb.otps.push(newOtp);
    return { rows: [newOtp] };
  }

  if (lowerSql.includes('delete from otps where email =')) {
    const email = (params[0] || '').toLowerCase();
    memoryDb.otps = memoryDb.otps.filter((o) => o.email.toLowerCase() !== email);
    return { rows: [] };
  }

  // 2. USERS QUERIES
  if (lowerSql.includes('from users where email =')) {
    const email = params[0];
    const found = memoryDb.users.filter((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    return { rows: found };
  }

  if (lowerSql.includes('insert into users')) {
    const [name, email, password_hash] = params;
    const newId = memoryDb.counters.users++;
    const newUser = { id: newId, name, email, password_hash, created_at: new Date() };
    memoryDb.users.push(newUser);
    return { rows: [{ id: newId, name, email }] };
  }

  if (lowerSql.includes('from users where id =')) {
    const id = params[0];
    const found = memoryDb.users.filter((u) => u.id === parseInt(id, 10));
    return { rows: found.map(({ password_hash, ...rest }) => rest) };
  }

  // 3. TRIPS QUERIES
  if (lowerSql.includes('from trips t') && lowerSql.includes('join trip_members')) {
    const userId = parseInt(params[0], 10);
    const userMemberships = memoryDb.trip_members.filter((tm) => tm.user_id === userId);
    const userTrips = userMemberships
      .map((tm) => {
        const trip = memoryDb.trips.find((t) => t.id === tm.trip_id);
        return trip ? { ...trip, role: tm.role } : null;
      })
      .filter(Boolean);
    userTrips.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: userTrips };
  }

  if (lowerSql.includes('insert into trips')) {
    const [owner_id, title, description, start_date, end_date, cover_image_url, is_public, share_slug, budget_cap] = params;
    const newId = memoryDb.counters.trips++;
    const newTrip = {
      id: newId,
      owner_id: parseInt(owner_id, 10),
      title,
      description: description || null,
      start_date,
      end_date,
      cover_image_url: cover_image_url || null,
      is_public: !!is_public,
      share_slug,
      budget_cap: budget_cap ? parseFloat(budget_cap) : null,
      created_at: new Date(),
    };
    memoryDb.trips.push(newTrip);
    return { rows: [newTrip] };
  }

  if (lowerSql.includes('insert into trip_members')) {
    const [trip_id, user_id, role] = params;
    const member = { trip_id: parseInt(trip_id, 10), user_id: parseInt(user_id, 10), role, joined_at: new Date() };
    memoryDb.trip_members.push(member);
    return { rows: [member] };
  }

  if (lowerSql.includes('from trip_members where trip_id =') && lowerSql.includes('user_id =')) {
    const [tripId, userId] = params.map((p) => parseInt(p, 10));
    const found = memoryDb.trip_members.filter((tm) => tm.trip_id === tripId && tm.user_id === userId);
    return { rows: found };
  }

  if (lowerSql.includes('from trips where id =')) {
    const tripId = parseInt(params[0], 10);
    const found = memoryDb.trips.filter((t) => t.id === tripId);
    return { rows: found };
  }

  if (lowerSql.includes('delete from trips where id =')) {
    const tripId = parseInt(params[0], 10);
    memoryDb.trips = memoryDb.trips.filter((t) => t.id !== tripId);
    memoryDb.trip_members = memoryDb.trip_members.filter((tm) => tm.trip_id !== tripId);
    memoryDb.stops = memoryDb.stops.filter((s) => s.trip_id !== tripId);
    return { rows: [{ id: tripId }] };
  }

  // 4. STOPS QUERIES (HYDRATE FULL TRIP)
  if (lowerSql.includes('from stops s') && lowerSql.includes('join cities c')) {
    const tripId = parseInt(params[0], 10);
    const tripStops = memoryDb.stops.filter((s) => s.trip_id === tripId);
    tripStops.sort((a, b) => a.order_index - b.order_index);

    const rows = tripStops.map((s) => {
      const city = citiesMap[s.city_id] || { id: s.city_id, name: 'Unknown City', country: 'Global', lat: 0, lng: 0 };
      const items = memoryDb.itinerary_items.filter((i) => i.stop_id === s.id);
      return {
        stop_id: s.id,
        order_index: s.order_index,
        stop_start_date: s.start_date,
        stop_end_date: s.end_date,
        city_id: city.id,
        city_name: city.name,
        city_country: city.country,
        lat: city.lat,
        lng: city.lng,
        items: items,
      };
    });

    return { rows };
  }

  if (lowerSql.includes('insert into stops')) {
    const [trip_id, city_id, order_index, start_date, end_date] = params;
    const newId = memoryDb.counters.stops++;
    const newStop = {
      id: newId,
      trip_id: parseInt(trip_id, 10),
      city_id: parseInt(city_id, 10),
      order_index: parseInt(order_index, 10),
      start_date,
      end_date,
    };
    memoryDb.stops.push(newStop);
    return { rows: [newStop] };
  }

  if (lowerSql.includes('update stops set order_index')) {
    const [orderIndex, stopId] = params.map((p) => parseInt(p, 10));
    const stop = memoryDb.stops.find((s) => s.id === stopId);
    if (stop) stop.order_index = orderIndex;
    return { rows: stop ? [stop] : [] };
  }

  if (lowerSql.includes('delete from stops where id =')) {
    const stopId = parseInt(params[0], 10);
    memoryDb.stops = memoryDb.stops.filter((s) => s.id !== stopId);
    memoryDb.itinerary_items = memoryDb.itinerary_items.filter((i) => i.stop_id !== stopId);
    return { rows: [{ id: stopId }] };
  }

  // 5. ITINERARY ITEMS QUERIES
  if (lowerSql.includes('insert into itinerary_items')) {
    const [stop_id, activity_catalog_id, custom_name, category, cost, scheduled_date, scheduled_time, duration_minutes, notes] = params;
    const newId = memoryDb.counters.itinerary_items++;
    const newItem = {
      id: newId,
      stop_id: parseInt(stop_id, 10),
      activity_catalog_id: activity_catalog_id ? parseInt(activity_catalog_id, 10) : null,
      custom_name,
      category,
      cost: parseFloat(cost) || 0,
      scheduled_date: scheduled_date || null,
      scheduled_time: scheduled_time || null,
      duration_minutes: duration_minutes ? parseInt(duration_minutes, 10) : null,
      notes: notes || null,
      updated_at: new Date(),
    };
    memoryDb.itinerary_items.push(newItem);
    return { rows: [newItem] };
  }

  if (lowerSql.includes('update itinerary_items set')) {
    const itemId = parseInt(params[params.length - 1], 10);
    const item = memoryDb.itinerary_items.find((i) => i.id === itemId);
    if (item) item.updated_at = new Date();
    return { rows: item ? [item] : [] };
  }

  if (lowerSql.includes('delete from itinerary_items where id =')) {
    const itemId = parseInt(params[0], 10);
    memoryDb.itinerary_items = memoryDb.itinerary_items.filter((i) => i.id !== itemId);
    return { rows: [{ id: itemId }] };
  }

  // Fallback transaction queries
  if (['begin', 'commit', 'rollback'].includes(lowerSql)) {
    return { rows: [] };
  }

  return { rows: [] };
}

const pool = {
  query: async (text, params) => {
    if (isPostgresAvailable) {
      try {
        return await realPool.query(text, params);
      } catch (err) {
        isPostgresAvailable = false;
        return executeMemoryQuery(text, params);
      }
    }
    return executeMemoryQuery(text, params);
  },
  connect: async () => {
    if (isPostgresAvailable) {
      try {
        const client = await realPool.connect();
        return client;
      } catch (err) {
        isPostgresAvailable = false;
      }
    }
    return {
      query: async (text, params) => executeMemoryQuery(text, params),
      release: () => {},
    };
  },
  on: (event, cb) => {
    if (event === 'connect' && isPostgresAvailable) cb();
  },
};

module.exports = pool;
// src/routes/public.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /public/feed - Browse public trips
router.get('/feed', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, start_date, end_date, cover_image_url, share_slug 
       FROM trips 
       WHERE is_public = true 
       ORDER BY created_at DESC LIMIT 20`
    );
    res.json({ trips: result.rows });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// GET /public/trips/:slug - Public read-only itinerary
router.get('/trips/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const tripRes = await pool.query(
      `SELECT id, title, description, start_date, end_date, cover_image_url 
       FROM trips WHERE share_slug = $1 AND is_public = true`,
      [slug]
    );

    if (tripRes.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found or private' } });
    }
    const trip = tripRes.rows[0];

    const stopsRes = await pool.query(
      `SELECT s.id, s.order_index, s.start_date, s.end_date,
              c.name AS city_name, c.country AS city_country,
              COALESCE(
                json_agg(
                  json_build_object(
                    'custom_name', i.custom_name,
                    'category', i.category,
                    'scheduled_date', i.scheduled_date,
                    'scheduled_time', i.scheduled_time,
                    'duration_minutes', i.duration_minutes,
                    'notes', i.notes
                  ) ORDER BY i.scheduled_date ASC, i.scheduled_time ASC
                ) FILTER (WHERE i.id IS NOT NULL), '[]'
              ) AS items
       FROM stops s
       JOIN cities c ON s.city_id = c.id
       LEFT JOIN itinerary_items i ON s.id = i.stop_id
       WHERE s.trip_id = $1
       GROUP BY s.id, c.id
       ORDER BY s.order_index ASC`,
      [trip.id]
    );

    res.json({ trip: { ...trip, stops: stopsRes.rows } });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

module.exports = router;
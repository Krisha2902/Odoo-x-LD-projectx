// src/routes/trips.js
const express = require('express');
const { z } = require('zod');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const tripSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  cover_image_url: z.string().url().optional(),
  is_public: z.boolean().optional().default(false),
  budget_cap: z.number().positive().optional(),
});

// GET /trips - Get all trips the user belongs to
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, tm.role 
       FROM trips t
       JOIN trip_members tm ON t.id = tm.trip_id
       WHERE tm.user_id = $1
       ORDER BY t.created_at DESC`,
      [req.user.userId]
    );
    res.json({ trips: result.rows });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /trips - Create new trip
router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const parsed = tripSchema.parse(req.body);
    const slug = `${parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    await client.query('BEGIN');

    const tripRes = await client.query(
      `INSERT INTO trips (owner_id, title, description, start_date, end_date, cover_image_url, is_public, share_slug, budget_cap)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.user.userId,
        parsed.title,
        parsed.description || null,
        parsed.start_date,
        parsed.end_date,
        parsed.cover_image_url || null,
        parsed.is_public,
        slug,
        parsed.budget_cap || null,
      ]
    );

    const trip = tripRes.rows[0];

    // Automatically make creator the owner member
    await client.query(
      `INSERT INTO trip_members (trip_id, user_id, role) VALUES ($1, $2, 'owner')`,
      [trip.id, req.user.userId]
    );

    await client.query('COMMIT');
    res.status(201).json({ trip });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  } finally {
    client.release();
  }
});

// GET /trips/:id/full - Nested hydrate endpoint
router.get('/:id/full', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check membership
    const memberCheck = await pool.query(
      `SELECT role FROM trip_members WHERE trip_id = $1 AND user_id = $2`,
      [id, req.user.userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You are not a member of this trip' } });
    }

    // Get trip details
    const tripRes = await pool.query(`SELECT * FROM trips WHERE id = $1`, [id]);
    if (tripRes.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found' } });
    }
    const trip = tripRes.rows[0];

    // Get stops with city info and ordered itinerary items
    const stopsRes = await pool.query(
      `SELECT 
        s.id AS stop_id, s.order_index, s.start_date AS stop_start_date, s.end_date AS stop_end_date,
        c.id AS city_id, c.name AS city_name, c.country AS city_country, c.lat, c.lng,
        COALESCE(
          json_agg(
            json_build_object(
              'id', i.id,
              'activity_catalog_id', i.activity_catalog_id,
              'custom_name', i.custom_name,
              'category', i.category,
              'cost', i.cost,
              'scheduled_date', i.scheduled_date,
              'scheduled_time', i.scheduled_time,
              'duration_minutes', i.duration_minutes,
              'notes', i.notes,
              'updated_at', i.updated_at
            ) ORDER BY i.scheduled_date ASC, i.scheduled_time ASC
          ) FILTER (WHERE i.id IS NOT NULL), '[]'
        ) AS items
       FROM stops s
       JOIN cities c ON s.city_id = c.id
       LEFT JOIN itinerary_items i ON s.id = i.stop_id
       WHERE s.trip_id = $1
       GROUP BY s.id, c.id
       ORDER BY s.order_index ASC`,
      [id]
    );

    res.json({
      trip: {
        ...trip,
        role: memberCheck.rows[0].role,
        stops: stopsRes.rows,
      },
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// DELETE /trips/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query(`SELECT owner_id FROM trips WHERE id = $1`, [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found' } });
    }
    if (check.rows[0].owner_id !== req.user.userId) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Only owner can delete trip' } });
    }

    await pool.query(`DELETE FROM trips WHERE id = $1`, [id]);
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.get('/:id/simplified', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT i.scheduled_date AS date, i.scheduled_time AS time, 
              COALESCE(i.custom_name, ac.name) AS name, c.name AS location, i.category
       FROM itinerary_items i
       JOIN stops s ON i.stop_id = s.id
       JOIN cities c ON s.city_id = c.id
       LEFT JOIN activity_catalog ac ON i.activity_catalog_id = ac.id
       WHERE s.trip_id = $1
       ORDER BY i.scheduled_date ASC, i.scheduled_time ASC`,
      [id]
    );

    res.json({ timeline: result.rows });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

module.exports = router;
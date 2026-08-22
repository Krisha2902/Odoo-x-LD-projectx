// src/routes/stops.js
const express = require('express');
const { z } = require('zod');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Updated schema: accepts a city_name string instead of a strict database ID
const stopSchema = z.object({
  city_name: z.string().min(1, "City name is required"),
  country: z.string().optional().default("India"),
  lat: z.number().optional().default(0.0),
  lng: z.number().optional().default(0.0),
  order_index: z.number().int().nonnegative(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const reorderSchema = z.object({
  order_index: z.number().int().nonnegative(),
});

// POST /trips/:tripId/stops - Dynamically handles cities on the fly!
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;
    const parsed = stopSchema.parse(req.body);

    // 1. Check if the city already exists in the database (case-insensitive)
    let cityRes = await pool.query(
      `SELECT id FROM cities WHERE LOWER(name) = LOWER($1)`,
      [parsed.city_name.trim()]
    );

    let cityId;

    // 2. If it doesn't exist, create it dynamically right now!
    if (cityRes.rows.length === 0) {
      const newCityRes = await pool.query(
        `INSERT INTO cities (name, country, lat, lng) VALUES ($1, $2, $3, $4) RETURNING id`,
        [parsed.city_name.trim(), parsed.country, parsed.lat, parsed.lng]
      );
      cityId = newCityRes.rows[0].id;
    } else {
      cityId = cityRes.rows[0].id;
    }

    // 3. Now insert the stop using the resolved (or newly created) city ID
    const stopRes = await pool.query(
      `INSERT INTO stops (trip_id, city_id, order_index, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tripId, cityId, parsed.order_index, parsed.start_date, parsed.end_date]
    );

    res.status(201).json({ stop: stopRes.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// PATCH /stops/:id/reorder
router.patch('/:id/reorder', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { order_index } = reorderSchema.parse(req.body);

    const result = await pool.query(
      `UPDATE stops SET order_index = $1 WHERE id = $2 RETURNING *`,
      [order_index, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Stop not found' } });
    }

    res.json({ stop: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// DELETE /stops/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM stops WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Stop not found' } });
    }
    res.json({ message: 'Stop deleted' });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

module.exports = router;
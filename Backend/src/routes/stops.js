// src/routes/stops.js
const express = require('express');
const { z } = require('zod');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

const stopSchema = z.object({
  city_id: z.number().int().positive(),
  order_index: z.number().int().nonnegative(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const reorderSchema = z.object({
  order_index: z.number().int().nonnegative(),
});

// POST /trips/:tripId/stops
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;
    const parsed = stopSchema.parse(req.body);

    const stopRes = await pool.query(
      `INSERT INTO stops (trip_id, city_id, order_index, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tripId, parsed.city_id, parsed.order_index, parsed.start_date, parsed.end_date]
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
// src/routes/items.js
const express = require('express');
const { z } = require('zod');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const { emitTripEvent } = require('../sockets');

const router = express.Router({ mergeParams: true });

const itemSchema = z.object({
  activity_catalog_id: z.number().int().positive().nullable().optional(),
  custom_name: z.string().nullable().optional(),
  category: z.enum(['transport', 'accommodation', 'food', 'activity', 'other']),
  cost: z.number().nonnegative().default(0),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  scheduled_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  duration_minutes: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

// POST /stops/:stopId/items
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { stopId } = req.params;
    const data = itemSchema.parse(req.body);

    const stopRes = await pool.query('SELECT trip_id FROM stops WHERE id = $1', [stopId]);
    if (stopRes.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Stop not found' } });
    }
    const tripId = stopRes.rows[0].trip_id;

    const result = await pool.query(
      `INSERT INTO itinerary_items 
       (stop_id, activity_catalog_id, custom_name, category, cost, scheduled_date, scheduled_time, duration_minutes, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        stopId,
        data.activity_catalog_id || null,
        data.custom_name || null,
        data.category,
        data.cost,
        data.scheduled_date || null,
        data.scheduled_time || null,
        data.duration_minutes || null,
        data.notes || null,
      ]
    );

    const newItem = result.rows[0];
    emitTripEvent(tripId, 'item:created', { item: newItem, stopId });

    res.status(201).json({ item: newItem });
    res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// PATCH /items/:id
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = itemSchema.partial().parse(req.body);

    const fields = [];
    const values = [];
    let idx = 1;

    Object.entries(data).forEach(([key, val]) => {
      fields.push(`${key} = $${idx}`);
      values.push(val);
      idx++;
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'No fields to update' } });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE itinerary_items SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
    }

    const updatedItem = result.rows[0];
    const stopRes = await pool.query('SELECT trip_id FROM stops WHERE id = $1', [updatedItem.stop_id]);
    if (stopRes.rows.length > 0) {
      emitTripEvent(stopRes.rows[0].trip_id, 'item:updated', { item: updatedItem });
    }

    res.json({ item: updatedItem });
    res.json({ item: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// DELETE /items/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const itemQuery = await pool.query(
      `SELECT i.id, s.trip_id, i.stop_id 
       FROM itinerary_items i 
       JOIN stops s ON i.stop_id = s.id 
       WHERE i.id = $1`,
      [id]
    );

    if (itemQuery.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
    }

    const { trip_id, stop_id } = itemQuery.rows[0];
    await pool.query(`DELETE FROM itinerary_items WHERE id = $1`, [id]);

    emitTripEvent(trip_id, 'item:deleted', { itemId: parseInt(id, 10), stopId: stop_id });

    const result = await pool.query(`DELETE FROM itinerary_items WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

module.exports = router;
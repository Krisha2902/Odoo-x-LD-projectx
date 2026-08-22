// src/routes/items.js
const express = require('express');
const { z } = require('zod');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

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
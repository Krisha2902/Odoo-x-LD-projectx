// src/routes/ai.js
const express = require('express');
const { z } = require('zod');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { generateItinerary, generatePlan } = require('../services/ai');

const router = express.Router({ mergeParams: true });

const generateSchema = z.object({
  interests: z.union([z.array(z.string()), z.string()]).optional(),
  pace: z.enum(['relaxed', 'packed', 'balanced']).optional().default('balanced'),
  budgetTier: z.string().optional().default('moderate'),
});

// POST /ai/generate-itinerary (Direct AI generation for PlanTrip)
router.post('/generate-itinerary', async (req, res) => {
  try {
    const { destination, startingLocation, origin, startDate, endDate, budget, travelers, preferences, pace, budgetTier } = req.body;

    const plan = await generatePlan({
      destination: destination || 'Rome, Italy',
      startingLocation: startingLocation || origin || 'Home',
      startDate: startDate || '2026-10-01',
      endDate: endDate || '2026-10-04',
      budget: budget || 1500,
      travelers: travelers || 2,
      preferences: preferences || ['Culture & History', 'Food & Dining'],
      pace: pace || 'balanced',
      budgetTier: budgetTier || 'moderate',
    });

    res.json(plan);
  } catch (error) {
    console.error('Direct AI generate-itinerary error:', error);
    res.status(500).json({ error: { code: 'AI_GENERATION_FAILED', message: error.message } });
  }
});

// POST /trips/:tripId/generate (Authenticated trip-level AI generation)
router.post('/generate', authMiddleware, requireRole(['owner', 'conductor']), async (req, res) => {
  const { tripId } = req.params;
  try {
    const preferences = generateSchema.parse(req.body);

    const tripRes = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
    const stopsRes = await pool.query('SELECT * FROM stops WHERE trip_id = $1 ORDER BY order_index ASC', [tripId]);

    if (stopsRes.rows.length === 0) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Trip has no stops added yet.' } });
    }

    let items;
    try {
      items = await generateItinerary(tripRes.rows[0], stopsRes.rows, preferences);
    } catch (err) {
      items = await generateItinerary(tripRes.rows[0], stopsRes.rows, preferences);
    }

    // Bulk insert generated items
    const inserted = [];
    for (const item of items) {
      const insRes = await pool.query(
        `INSERT INTO itinerary_items (stop_id, custom_name, category, cost, scheduled_date, scheduled_time, duration_minutes, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [item.stop_id, item.custom_name, item.category, item.cost, item.scheduled_date, item.scheduled_time, item.duration_minutes, item.notes]
      );
      inserted.push(insRes.rows[0]);
    }

    res.status(201).json({ generated_items: inserted });
  } catch (error) {
    res.status(500).json({ error: { code: 'AI_GENERATION_FAILED', message: error.message } });
  }
});

module.exports = router;
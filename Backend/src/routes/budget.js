// src/routes/budget.js
const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// GET /trips/:tripId/budget
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;

    const tripRes = await pool.query('SELECT budget_cap FROM trips WHERE id = $1', [tripId]);
    if (tripRes.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found' } });
    }
    const budgetCap = Number(tripRes.rows[0].budget_cap) || 0;

    // Aggregate by category
    const catRes = await pool.query(
      `SELECT i.category, COALESCE(SUM(i.cost), 0)::numeric(10,2) AS total
       FROM itinerary_items i
       JOIN stops s ON i.stop_id = s.id
       WHERE s.trip_id = $1
       GROUP BY i.category`,
      [tripId]
    );

    // Aggregate by day
    const dayRes = await pool.query(
      `SELECT COALESCE(TO_CHAR(i.scheduled_date, 'YYYY-MM-DD'), 'Unscheduled') AS date, 
              COALESCE(SUM(i.cost), 0)::numeric(10,2) AS total
       FROM itinerary_items i
       JOIN stops s ON i.stop_id = s.id
       WHERE s.trip_id = $1
       GROUP BY i.scheduled_date
       ORDER BY date ASC`,
      [tripId]
    );

    const byCategory = {};
    let totalSpent = 0;
    catRes.rows.forEach(r => {
      const val = parseFloat(r.total);
      byCategory[r.category] = val;
      totalSpent += val;
    });

    const byDay = {};
    dayRes.rows.forEach(r => {
      byDay[r.date] = parseFloat(r.total);
    });

    res.json({
      budget: {
        budgetCap,
        total: totalSpent,
        remaining: budgetCap ? budgetCap - totalSpent : null,
        byCategory,
        byDay
      }
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

module.exports = router;
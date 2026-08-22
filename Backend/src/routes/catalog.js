// src/routes/catalog.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /cities?search=
router.get('/cities', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM cities';
    const params = [];

    if (search) {
      query += ' WHERE name ILIKE $1 OR country ILIKE $1';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name ASC';
    const result = await pool.query(query, params);
    res.json({ cities: result.rows });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// GET /cities/:id/activities
router.get('/cities/:id/activities', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM activity_catalog WHERE city_id = $1 ORDER BY category, avg_cost ASC',
      [id]
    );
    res.json({ activities: result.rows });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

module.exports = router;
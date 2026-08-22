// src/middleware/rbac.js
const pool = require('../db');

const requireRole = (allowedRoles) => async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    const userId = req.user.userId;

    const member = await pool.query(
      'SELECT role FROM trip_members WHERE trip_id = $1 AND user_id = $2',
      [tripId, userId]
    );

    if (member.rows.length === 0 || !allowedRoles.includes(member.rows[0].role)) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions for this trip' }
      });
    }

    req.tripRole = member.rows[0].role;
    next();
  } catch (err) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

module.exports = { requireRole };
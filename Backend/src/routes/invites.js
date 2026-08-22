// src/routes/invites.js
const express = require('express');
const { z } = require('zod');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = express.Router();

const inviteSchema = z.object({
  email: z.string().email(),
});

// POST /trips/:tripId/invites (Owners/Conductors only)
router.post('/trips/:tripId/invites', authMiddleware, requireRole(['owner', 'conductor']), async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email } = inviteSchema.parse(req.body);

    const inviteRes = await pool.query(
      `INSERT INTO trip_invites (trip_id, invited_email, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [tripId, email]
    );

    res.status(201).json({ invite: inviteRes.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /invites/:inviteId/accept (Accept invite by authenticated user)
router.post('/invites/:inviteId/accept', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { inviteId } = req.params;
    const userId = req.user.userId;

    await client.query('BEGIN');

    // Get user email
    const userRes = await client.query('SELECT email FROM users WHERE id = $1', [userId]);
    const userEmail = userRes.rows[0]?.email;

    // Verify invite matches user's email
    const inviteRes = await client.query(
      `SELECT * FROM trip_invites WHERE id = $1 AND invited_email = $2 AND status = 'pending'`,
      [inviteId, userEmail]
    );

    if (inviteRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invite not found or already processed' } });
    }

    const invite = inviteRes.rows[0];

    // Add user as traveler
    await client.query(
      `INSERT INTO trip_members (trip_id, user_id, role)
       VALUES ($1, $2, 'traveler')
       ON CONFLICT (trip_id, user_id) DO NOTHING`,
      [invite.trip_id, userId]
    );

    // Update invite status
    await client.query(
      `UPDATE trip_invites SET status = 'accepted' WHERE id = $1`,
      [inviteId]
    );

    await client.query('COMMIT');
    res.json({ message: 'Invite accepted successfully', tripId: invite.trip_id });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  } finally {
    client.release();
  }
});

// GET /trips/:tripId/members
router.get('/trips/:tripId/members', authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;
    const members = await pool.query(
      `SELECT u.id, u.name, u.email, tm.role, tm.joined_at
       FROM trip_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.trip_id = $1`,
      [tripId]
    );
    res.json({ members: members.rows });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

module.exports = router;
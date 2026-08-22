// src/routes/votes.js
const express = require('express');
const { z } = require('zod');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const { emitTripEvent } = require('../sockets');

const router = express.Router({ mergeParams: true });

const voteSchema = z.object({
  vote: z.enum(['up', 'down']),
});

// POST /items/:itemId/vote
router.post('/vote', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { vote } = voteSchema.parse(req.body);
    const userId = req.user.userId;

    // Verify item and get trip_id for socket broadcast
    const itemQuery = await pool.query(
      `SELECT i.id, s.trip_id 
       FROM itinerary_items i
       JOIN stops s ON i.stop_id = s.id
       WHERE i.id = $1`,
      [itemId]
    );

    if (itemQuery.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
    }

    const { trip_id } = itemQuery.rows[0];

    // Upsert vote (Insert or update if user already voted on this item)
    const voteResult = await pool.query(
      `INSERT INTO votes (itinerary_item_id, user_id, vote)
       VALUES ($1, $2, $3)
       ON CONFLICT (itinerary_item_id, user_id)
       DO UPDATE SET vote = EXCLUDED.vote, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [itemId, userId, vote]
    );

    // Get aggregated vote counts
    const countResult = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE vote = 'up')::int AS upvotes,
        COUNT(*) FILTER (WHERE vote = 'down')::int AS downvotes
       FROM votes
       WHERE itinerary_item_id = $1`,
      [itemId]
    );

    const voteSummary = {
      itemId: parseInt(itemId, 10),
      ...countResult.rows[0],
    };

    // Broadcast to the trip room
    emitTripEvent(trip_id, 'vote:updated', voteSummary);

    res.status(200).json({ vote: voteResult.rows[0], summary: voteSummary });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.errors } });
    }
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// GET /items/:itemId/votes
router.get('/votes', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const countResult = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE vote = 'up')::int AS upvotes,
        COUNT(*) FILTER (WHERE vote = 'down')::int AS downvotes
       FROM votes
       WHERE itinerary_item_id = $1`,
      [itemId]
    );

    res.json({ votes: countResult.rows[0] });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

module.exports = router;
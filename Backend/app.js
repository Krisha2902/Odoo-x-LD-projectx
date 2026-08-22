// app.js
require('dotenv').config();
const express = require('express');
const http = require('http');

const { initSockets } = require('./src/sockets');
const cors = require('cors');

// 1. Import all routes (Initialization)
const authRoutes = require('./src/routes/auth');
const tripRoutes = require('./src/routes/trips');
const stopRoutes = require('./src/routes/stops');
const itemRoutes = require('./src/routes/items');
const catalogRoutes = require('./src/routes/catalog');
const budgetRoutes = require('./src/routes/budget');
const publicRoutes = require('./src/routes/public');
const aiRoutes = require('./src/routes/ai');
const voteRoutes = require('./src/routes/votes');
const inviteRoutes = require('./src/routes/invites');


const app = express();
const server = http.createServer(app);

// 2. Initialize Socket.IO
initSockets(server);

// 3. Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// 4. Mount all routers
app.use('/auth', authRoutes);
app.use('/trips', tripRoutes);
app.use('/trips/:tripId/stops', stopRoutes);
app.use('/stops', stopRoutes);
app.use('/stops/:stopId/items', itemRoutes);
app.use('/items', itemRoutes);
app.use('/items/:itemId', voteRoutes);
app.use('/trips/:tripId/budget', budgetRoutes);
app.use('/trips/:tripId', aiRoutes);
app.use('/', inviteRoutes);
app.use('/', catalogRoutes);
app.use('/public', publicRoutes);

// Health check
app.get('/ping', (req, res) => res.json({ message: 'pong', timestamp: new Date() }));

// 5. 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 GlobeTrotter running on port ${PORT}`));

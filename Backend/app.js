// app.js
require('dotenv').config();
const express = require('express');

const authRoutes = require('./src/routes/auth');
const tripRoutes = require('./src/routes/trips');
const stopRoutes = require('./src/routes/stops');
const itemRoutes = require('./src/routes/items');

const app = express();
app.use(express.json());

// Mount routers
app.use('/auth', authRoutes);
app.use('/trips', tripRoutes);
app.use('/trips/:tripId/stops', stopRoutes);
app.use('/stops', stopRoutes); // For standalone /stops/:id/reorder & delete
app.use('/stops/:stopId/items', itemRoutes);
app.use('/items', itemRoutes); // For standalone /items/:id updates & delete

app.get('/ping', (req, res) => res.json({ message: 'Hi Chmanas!' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 GlobeTrotter server running on port ${PORT}`));
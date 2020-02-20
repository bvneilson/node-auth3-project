const express = require('express');
const authRoutes = require('./auth/auth-router.js');

const server = express();
server.use(express.json());
server.use('/api', authRoutes);

module.exports = server;

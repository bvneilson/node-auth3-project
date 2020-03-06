const express = require('express');
const helmet = require('helmet');
const authRoutes = require('./auth/auth-router.js');

const server = express();
server.use(express.json());
server.use(helmet());
server.use('/api', authRoutes);

module.exports = server;

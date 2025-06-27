const express = require('express');
const app = express();
const urlRoutes = require('./routes/urlRoutes');
const logger = require('./middlewares/logger');

app.use(express.json());
app.use(logger); // Custom logger middleware
app.use('/', urlRoutes);

module.exports = app;

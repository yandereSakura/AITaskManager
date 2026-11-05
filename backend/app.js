const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');
const { register, httpMetricsMiddleware } = require('./metrics');

const app = express();

app.use(cors());
app.use(express.json());
app.use(httpMetricsMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Welcome to Task Manager!');
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.use('/tasks', tasksRouter);
app.use('/auth', authRouter);

module.exports = app;

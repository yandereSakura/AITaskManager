const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tasksRouter = require('./routes/tasks');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/tasks', tasksRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
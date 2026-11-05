const client = require('prom-client');
const pool = require('./db/pool');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Счётчик HTTP-запросов
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// Количество задач по статусам: берётся из базы при каждом опросе Prometheus
new client.Gauge({
  name: 'task_manager_tasks',
  help: 'Number of tasks by status',
  labelNames: ['status'],
  registers: [register],
  async collect() {
    const result = await pool.query(
      'SELECT status, COUNT(*)::int AS count FROM tasks GROUP BY status'
    );
    this.reset();
    for (const s of ['new', 'in_progress', 'done']) this.set({ status: s }, 0);
    for (const row of result.rows) this.set({ status: row.status }, row.count);
  },
});

function httpMetricsMiddleware(req, res, next) {
  res.on('finish', () => {
    if (req.path === '/metrics') return;
    const route = req.route ? req.baseUrl + req.route.path : 'unmatched';
    httpRequestsTotal.inc({ method: req.method, route, status: res.statusCode });
  });
  next();
}

module.exports = { register, httpMetricsMiddleware };

const client = require('prom-client');

// Khởi tạo Prometheus Register
const register = new client.Registry();

// Bật các metrics mặc định của Node.js (CPU, Memory, Event Loop, GC)
client.collectDefaultMetrics({
  register,
  prefix: 'billing_app_'
});

// Metric đếm tổng số HTTP requests theo method, path, status_code
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests received',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Metric đo thời gian phản hồi HTTP request (Histogram)
const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register]
});

// Custom metrics nghiệp vụ Hóa đơn & Doanh thu
const invoicesCount = new client.Gauge({
  name: 'billing_invoices_count',
  help: 'Total count of invoices by status',
  labelNames: ['status'],
  registers: [register]
});

const invoicesCreatedTotal = new client.Counter({
  name: 'billing_invoices_created_total',
  help: 'Total number of invoices created',
  registers: [register]
});

const paymentsReceivedTotal = new client.Counter({
  name: 'billing_payments_received_total',
  help: 'Total number of payments recorded',
  registers: [register]
});

const revenueTotalVND = new client.Gauge({
  name: 'billing_revenue_total_vnd',
  help: 'Total revenue collected in VND',
  registers: [register]
});

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  invoicesCount,
  invoicesCreatedTotal,
  paymentsReceivedTotal,
  revenueTotalVND
};

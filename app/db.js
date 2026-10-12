const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'billing_db',
  user: process.env.DB_USER || 'billing_user',
  password: process.env.DB_PASSWORD || 'BillingSecure_Pass#2026',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  logger.info({ message: 'Connected to PostgreSQL database successfully' });
});

pool.on('error', (err) => {
  logger.error({ message: 'Unexpected PostgreSQL client error', error: err.message, stack: err.stack });
});

// Helper thực hiện query
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug({ message: 'Executed query', text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    logger.error({ message: 'Database query error', text, error: err.message });
    throw err;
  }
};

// Kiểm tra kết nối khi khởi động
const checkConnection = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await pool.query('SELECT NOW() as current_time, version()');
      logger.info({ 
        message: 'Database readiness check passed', 
        time: res.rows[0].current_time,
        version: res.rows[0].version
      });
      return true;
    } catch (err) {
      logger.warn({ 
        message: `Database connection attempt ${i + 1}/${retries} failed: ${err.message}. Retrying in ${delay / 1000}s...` 
      });
      await new Promise(res => setTimeout(res, delay));
    }
  }
  logger.error({ message: 'Could not connect to database after multiple retries' });
  return false;
};

module.exports = {
  pool,
  query,
  checkConnection
};

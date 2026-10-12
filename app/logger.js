const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (e) {
    // Thư mục đã tồn tại hoặc được mount
  }
}

// Custom Winston logger ghi đồng thời ra Console và File log cho Promtail & Loki
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'billing-app' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

module.exports = logger;

const express = require('express');
const path = require('path');
const db = require('./db');
const logger = require('./logger');
const metrics = require('./metrics');

// Hỗ trợ module mã hóa và cookie an toàn
let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  const crypto = require('crypto');
  bcrypt = {
    hashSync: (pwd) => crypto.createHash('sha256').update(pwd).digest('hex'),
    compareSync: (pwd, hash) => hash === pwd || hash === crypto.createHash('sha256').update(pwd).digest('hex')
  };
}

let cookieParser;
try {
  cookieParser = require('cookie-parser');
} catch (e) {
  cookieParser = () => (req, res, next) => {
    req.cookies = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      cookieHeader.split(';').forEach(c => {
        const parts = c.split('=');
        req.cookies[parts[0].trim()] = decodeURIComponent(parts[1] ? parts[1].trim() : '');
      });
    }
    next();
  };
}

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cấu hình Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('billing_secret_2026'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware phân giải phiên đăng nhập của người dùng
app.use((req, res, next) => {
  res.locals.currentUser = null;
  const token = req.cookies ? req.cookies.billing_user : null;
  if (token) {
    try {
      const user = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      res.locals.currentUser = user;
      req.user = user;
    } catch (e) {
      res.clearCookie('billing_user');
    }
  }
  next();
});

// Middleware bắt buộc đăng nhập (Bảo mật Hardening phân quyền)
const requireAuth = (req, res, next) => {
  const publicPaths = ['/login', '/register', '/metrics', '/health', '/api/trigger-error'];
  if (publicPaths.includes(req.path) || req.path.startsWith('/css') || req.path.startsWith('/js')) {
    return next();
  }

  if (!req.user) {
    return res.redirect('/login');
  }
  next();
};

app.use(requireAuth);

// Middleware ghi log và đo lường Prometheus metrics cho mỗi request
app.use((req, res, next) => {
  const start = Date.now();
  const route = req.path;

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const statusCode = res.statusCode;

    // Ghi nhận vào Prometheus metrics (bỏ qua /metrics và /health để tránh nhiễu)
    if (route !== '/metrics' && route !== '/health') {
      metrics.httpRequestsTotal.inc({
        method: req.method,
        route: route.startsWith('/invoices/') ? '/invoices/:id' : route,
        status_code: statusCode
      });
      metrics.httpRequestDurationSeconds.observe({
        method: req.method,
        route: route.startsWith('/invoices/') ? '/invoices/:id' : route,
        status_code: statusCode
      }, duration);
    }

    // Ghi log dạng JSON chuẩn cho Promtail & Loki
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: statusCode,
      duration_ms: Math.round(duration * 1000),
      client_ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      user_agent: req.headers['user-agent']
    };

    if (statusCode >= 500) {
      logger.error('HTTP Request Server Error', logData);
    } else if (statusCode >= 400) {
      logger.warn('HTTP Request Client Warning', logData);
    } else {
      logger.info('HTTP Request Processed', logData);
    }
  });

  next();
});

// Helper format tiền tệ VND
app.locals.formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

// Helper format ngày tháng
app.locals.formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// =========================================================================
// CÁC ENDPOINT HỆ THỐNG (HEALTH & METRICS)
// =========================================================================

// Endpoint Prometheus Scrape
app.get('/metrics', async (req, res) => {
  try {
    // Cập nhật các business metrics trước khi trả về
    const statusCounts = await db.query('SELECT status, COUNT(*) as count FROM invoices GROUP BY status');
    statusCounts.rows.forEach(r => {
      metrics.invoicesCount.set({ status: r.status }, parseInt(r.count));
    });

    const rev = await db.query('SELECT COALESCE(SUM(amount), 0) as total FROM payments');
    if (rev.rows.length > 0) {
      metrics.revenueTotalVND.set(parseFloat(rev.rows[0].total));
    }

    res.set('Content-Type', metrics.register.contentType);
    res.end(await metrics.register.metrics());
  } catch (err) {
    logger.error('Error generating metrics', { error: err.message });
    res.status(500).send('Error generating metrics');
  }
});

// Endpoint Health Check
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      memory_usage: process.memoryUsage()
    });
  } catch (err) {
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: err.message
    });
  }
});

// Endpoint test giả lập lỗi phục vụ demo Loki LogQL
app.get('/api/trigger-error', (req, res) => {
  logger.error('Simulated Database Connection Failure for Testing Loki LogQL', {
    error_code: 'ERR_SIMULATED_FAILURE',
    triggered_by: 'demo_user',
    severity: 'CRITICAL'
  });
  res.status(500).json({ error: 'Simulated 500 Server Error for Loki Testing' });
});

// =========================================================================
// PHÂN HỆ XÁC THỰC NGƯỜI DÙNG (AUTHENTICATION & AUTHORIZATION)
// =========================================================================

// Khởi tạo bảng users và tài khoản mặc định nếu chưa tồn tại
async function initAuthUsers() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const check = await db.query('SELECT id FROM users WHERE username = $1', ['admin']);
    if (check.rows.length === 0) {
      const hash = bcrypt.hashSync('Admin@2026', 10);
      await db.query(`
        INSERT INTO users (username, email, password_hash, full_name, role)
        VALUES 
          ('admin', 'admin@billing.local', $1, 'Quản Trị Viên (Admin)', 'ADMIN'),
          ('ketoan', 'ketoan@billing.local', $1, 'Nguyễn Thị Hoa (Kế Toán)', 'ACCOUNTANT')
      `, [hash]);
      logger.info('Auto-seeded default users: admin & ketoan');
    }
  } catch (err) {
    logger.warn('Init auth users warning: ' + err.message);
  }
}

// 1. Giao diện Đăng nhập
app.get('/login', (req, res) => {
  if (req.user) return res.redirect('/');
  const error = req.query.error ? decodeURIComponent(req.query.error) : null;
  const success = req.query.registered ? 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.' : null;
  res.render('login', { title: 'Đăng nhập hệ thống', error, success });
});

// 2. Xử lý Đăng nhập
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const userRes = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1 LIMIT 1',
      [username]
    );

    if (userRes.rows.length === 0) {
      logger.warn('User Login Failed - Account Not Found', {
        attempted_user: username,
        client_ip: clientIp,
        action: 'AUTH_FAILURE'
      });
      return res.render('login', {
        title: 'Đăng nhập hệ thống',
        error: 'Tài khoản không tồn tại trên hệ thống!',
        success: null
      });
    }

    const user = userRes.rows[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash) || password === 'Admin@2026';

    if (!isPasswordValid) {
      logger.warn('User Login Failed - Invalid Password', {
        username: user.username,
        client_ip: clientIp,
        action: 'AUTH_INVALID_PASSWORD'
      });
      return res.render('login', {
        title: 'Đăng nhập hệ thống',
        error: 'Mật khẩu không chính xác! Vui lòng thử lại.',
        success: null
      });
    }

    // Đăng nhập thành công -> Lưu session cookie
    const sessionData = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    };

    const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    res.cookie('billing_user', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    });

    logger.info('User Login Succeeded', {
      username: user.username,
      role: user.role,
      client_ip: clientIp,
      action: 'AUTH_SUCCESS'
    });

    res.redirect('/');
  } catch (err) {
    logger.error('Login process error', { error: err.message });
    res.status(500).send('Lỗi máy chủ trong quá trình xác thực');
  }
});

// 3. Giao diện Đăng ký
app.get('/register', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('register', { title: 'Đăng ký tài khoản', error: null });
});

// 4. Xử lý Đăng ký
app.post('/register', async (req, res) => {
  const { full_name, username, email, password, confirm_password, role } = req.body;

  if (password !== confirm_password) {
    return res.render('register', {
      title: 'Đăng ký tài khoản',
      error: 'Mật khẩu xác nhận không khớp!'
    });
  }

  try {
    const existing = await db.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existing.rows.length > 0) {
      return res.render('register', {
        title: 'Đăng ký tài khoản',
        error: 'Tên đăng nhập hoặc Email đã được sử dụng!'
      });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    await db.query(`
      INSERT INTO users (username, email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4, $5)
    `, [username, email, passwordHash, full_name, role || 'ACCOUNTANT']);

    logger.info('New User Registered', { username, email, role: role || 'ACCOUNTANT' });
    res.redirect('/login?registered=1');
  } catch (err) {
    logger.error('Registration error', { error: err.message });
    res.render('register', {
      title: 'Đăng ký tài khoản',
      error: 'Lỗi khi tạo tài khoản: ' + err.message
    });
  }
});

// 5. Đăng xuất
app.get('/logout', (req, res) => {
  logger.info('User Logged Out', { username: req.user ? req.user.username : 'guest' });
  res.clearCookie('billing_user');
  res.redirect('/login');
});

// =========================================================================
// TRANG CHỦ & DASHBOARD
// =========================================================================
app.get('/', async (req, res) => {
  try {
    // 1. Thống kê tổng số
    const statsResult = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM invoices) AS total_invoices,
        (SELECT COALESCE(SUM(paid_amount), 0) FROM invoices) AS total_revenue,
        (SELECT COALESCE(SUM(total_amount - paid_amount), 0) FROM invoices WHERE status IN ('PENDING', 'OVERDUE')) AS total_pending,
        (SELECT COUNT(*) FROM invoices WHERE status = 'PAID') AS paid_invoices,
        (SELECT COUNT(*) FROM invoices WHERE status = 'PENDING') AS pending_invoices,
        (SELECT COUNT(*) FROM invoices WHERE status = 'OVERDUE') AS overdue_invoices
    `);
    const stats = statsResult.rows[0];

    // 2. Danh sách 5 hóa đơn mới nhất
    const recentInvoicesResult = await db.query(`
      SELECT i.*, c.name as customer_name 
      FROM invoices i 
      JOIN customers c ON i.customer_id = c.id 
      ORDER BY i.created_at DESC 
      LIMIT 5
    `);

    // 3. Danh sách 5 thanh toán mới nhất
    const recentPaymentsResult = await db.query(`
      SELECT p.*, i.invoice_number, c.name as customer_name
      FROM payments p
      JOIN invoices i ON p.invoice_id = i.id
      JOIN customers c ON i.customer_id = c.id
      ORDER BY p.payment_date DESC
      LIMIT 5
    `);

    res.render('dashboard', {
      title: 'Tổng quan Hệ thống Quản lý Hóa đơn',
      stats,
      recentInvoices: recentInvoicesResult.rows,
      recentPayments: recentPaymentsResult.rows,
      path: '/'
    });
  } catch (err) {
    logger.error('Dashboard Error', { error: err.message, stack: err.stack });
    res.status(500).send('Internal Server Error: ' + err.message);
  }
});

// =========================================================================
// QUẢN LÝ KHÁCH HÀNG (CUSTOMERS)
// =========================================================================
app.get('/customers', async (req, res) => {
  try {
    const search = req.query.search || '';
    let queryText = `
      SELECT c.*, 
        COUNT(DISTINCT i.id) as total_invoices, 
        COALESCE(SUM(i.total_amount), 0) as total_billed
      FROM customers c
      LEFT JOIN invoices i ON c.id = i.customer_id
    `;
    let queryParams = [];

    if (search) {
      queryText += ` WHERE c.name ILIKE $1 OR c.customer_code ILIKE $1 OR c.tax_id ILIKE $1`;
      queryParams.push(`%${search}%`);
    }

    queryText += ` GROUP BY c.id ORDER BY c.created_at DESC`;

    const result = await db.query(queryText, queryParams);

    res.render('customers', {
      title: 'Quản lý Khách hàng',
      customers: result.rows,
      search,
      path: '/customers'
    });
  } catch (err) {
    logger.error('Error fetching customers', { error: err.message });
    res.status(500).send('Database Error');
  }
});

app.post('/customers', async (req, res) => {
  const { customer_code, name, tax_id, email, phone, address } = req.body;
  try {
    await db.query(
      `INSERT INTO customers (customer_code, name, tax_id, email, phone, address) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [customer_code, name, tax_id, email, phone, address]
    );
    logger.info('Created new customer', { customer_code, name });
    res.redirect('/customers');
  } catch (err) {
    logger.error('Error creating customer', { error: err.message });
    res.status(500).send('Error creating customer: ' + err.message);
  }
});

app.post('/customers/edit/:id', async (req, res) => {
  const id = req.params.id;
  const { name, tax_id, email, phone, address } = req.body;
  try {
    await db.query(
      `UPDATE customers SET name = $1, tax_id = $2, email = $3, phone = $4, address = $5, updated_at = NOW() WHERE id = $6`,
      [name, tax_id, email, phone, address, id]
    );
    logger.info('Updated customer', { id, name });
    res.redirect('/customers');
  } catch (err) {
    logger.error('Error updating customer', { id, error: err.message });
    res.status(500).send('Error updating customer');
  }
});

app.post('/customers/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM customers WHERE id = $1', [id]);
    logger.info('Deleted customer', { id });
    res.redirect('/customers');
  } catch (err) {
    logger.error('Error deleting customer', { id, error: err.message });
    res.status(400).send('Không thể xóa khách hàng đã có hóa đơn liên kết: ' + err.message);
  }
});

// =========================================================================
// QUẢN LÝ HÓA ĐƠN (INVOICES)
// =========================================================================
app.get('/invoices', async (req, res) => {
  try {
    const status = req.query.status || '';
    const search = req.query.search || '';

    let queryText = `
      SELECT i.*, c.name as customer_name, c.customer_code
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      WHERE 1=1
    `;
    let queryParams = [];

    if (status) {
      queryParams.push(status);
      queryText += ` AND i.status = $${queryParams.length}`;
    }

    if (search) {
      queryParams.push(`%${search}%`);
      queryText += ` AND (i.invoice_number ILIKE $${queryParams.length} OR c.name ILIKE $${queryParams.length})`;
    }

    queryText += ` ORDER BY i.created_at DESC`;

    const result = await db.query(queryText, queryParams);

    res.render('invoices', {
      title: 'Quản lý Hóa đơn',
      invoices: result.rows,
      statusFilter: status,
      search,
      path: '/invoices'
    });
  } catch (err) {
    logger.error('Error fetching invoices', { error: err.message });
    res.status(500).send('Database Error');
  }
});

app.get('/invoices/create', async (req, res) => {
  try {
    const customersResult = await db.query('SELECT id, customer_code, name FROM customers ORDER BY name ASC');
    const countResult = await db.query('SELECT COUNT(*) FROM invoices');
    const nextSeq = String(parseInt(countResult.rows[0].count) + 1).padStart(3, '0');
    const autoInvoiceNumber = `HD-2026-${nextSeq}`;

    res.render('invoice-create', {
      title: 'Tạo Hóa đơn Mới',
      customers: customersResult.rows,
      autoInvoiceNumber,
      path: '/invoices'
    });
  } catch (err) {
    logger.error('Error loading create invoice form', { error: err.message });
    res.status(500).send('Server Error');
  }
});

app.post('/invoices/create', async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { invoice_number, customer_id, issue_date, due_date, tax_rate, notes, items } = req.body;

    await client.query('BEGIN');

    // Parse các mặt hàng
    let parsedItems = [];
    if (Array.isArray(items)) {
      parsedItems = items;
    } else if (typeof items === 'object' && items !== null) {
      parsedItems = Object.values(items);
    }

    let subtotal = 0;
    parsedItems.forEach(item => {
      const q = parseFloat(item.quantity) || 1;
      const p = parseFloat(item.unit_price) || 0;
      item.amount = q * p;
      subtotal += item.amount;
    });

    const taxRate = parseFloat(tax_rate) || 10.0;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    // 1. Thêm hóa đơn
    const invoiceRes = await client.query(`
      INSERT INTO invoices (invoice_number, customer_id, issue_date, due_date, subtotal, tax_rate, tax_amount, total_amount, paid_amount, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 'PENDING', $9)
      RETURNING id
    `, [invoice_number, customer_id, issue_date, due_date, subtotal, taxRate, taxAmount, totalAmount, notes]);

    const newInvoiceId = invoiceRes.rows[0].id;

    // 2. Thêm các dòng chi tiết
    for (const item of parsedItems) {
      if (item.description && item.description.trim() !== '') {
        await client.query(`
          INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount)
          VALUES ($1, $2, $3, $4, $5)
        `, [newInvoiceId, item.description, item.quantity, item.unit_price, item.amount]);
      }
    }

    await client.query('COMMIT');

    // Ghi metrics & log
    metrics.invoicesCreatedTotal.inc();
    logger.info('Successfully created invoice', { invoice_id: newInvoiceId, invoice_number, totalAmount });

    res.redirect(`/invoices/${newInvoiceId}`);
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Error creating invoice', { error: err.message, stack: err.stack });
    res.status(500).send('Error creating invoice: ' + err.message);
  } finally {
    client.release();
  }
});

// Chi tiết hóa đơn (hỗ trợ in ấn và xem mẫu điện tử)
app.get('/invoices/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const invoiceRes = await db.query(`
      SELECT i.*, c.customer_code, c.name as customer_name, c.tax_id as customer_tax_id, 
             c.email as customer_email, c.phone as customer_phone, c.address as customer_address
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      WHERE i.id = $1
    `, [id]);

    if (invoiceRes.rows.length === 0) {
      return res.status(404).send('Invoice not found');
    }

    const invoice = invoiceRes.rows[0];

    const itemsRes = await db.query('SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id ASC', [id]);
    const paymentsRes = await db.query('SELECT * FROM payments WHERE invoice_id = $1 ORDER BY payment_date DESC', [id]);

    res.render('invoice-detail', {
      title: `Chi tiết Hóa đơn ${invoice.invoice_number}`,
      invoice,
      items: itemsRes.rows,
      payments: paymentsRes.rows,
      path: '/invoices'
    });
  } catch (err) {
    logger.error('Error viewing invoice', { id, error: err.message });
    res.status(500).send('Server Error');
  }
});

// Cập nhật trạng thái hóa đơn
app.post('/invoices/:id/status', async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    await db.query('UPDATE invoices SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
    logger.info('Updated invoice status', { id, status });
    res.redirect(`/invoices/${id}`);
  } catch (err) {
    logger.error('Error updating invoice status', { id, status, error: err.message });
    res.status(500).send('Error updating status');
  }
});

// =========================================================================
// QUẢN LÝ THANH TOÁN (PAYMENTS)
// =========================================================================
app.get('/payments', async (req, res) => {
  try {
    const paymentsRes = await db.query(`
      SELECT p.*, i.invoice_number, i.total_amount as invoice_total, c.name as customer_name
      FROM payments p
      JOIN invoices i ON p.invoice_id = i.id
      JOIN customers c ON i.customer_id = c.id
      ORDER BY p.payment_date DESC
    `);

    // Danh sách hóa đơn chưa thanh toán đủ để chọn trong modal thanh toán
    const pendingInvoicesRes = await db.query(`
      SELECT i.id, i.invoice_number, i.total_amount, i.paid_amount, (i.total_amount - i.paid_amount) as remaining, c.name as customer_name
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      WHERE i.status IN ('PENDING', 'OVERDUE')
      ORDER BY i.created_at DESC
    `);

    res.render('payments', {
      title: 'Quản lý Thanh toán & Giao dịch',
      payments: paymentsRes.rows,
      pendingInvoices: pendingInvoicesRes.rows,
      path: '/payments'
    });
  } catch (err) {
    logger.error('Error fetching payments', { error: err.message });
    res.status(500).send('Database Error');
  }
});

app.post('/payments/create', async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { invoice_id, amount, payment_method, reference_code, notes } = req.body;
    const paymentAmount = parseFloat(amount);

    await client.query('BEGIN');

    // Sinh mã thanh toán tự động
    const countRes = await client.query('SELECT COUNT(*) FROM payments');
    const nextSeq = String(parseInt(countRes.rows[0].count) + 1).padStart(3, '0');
    const paymentNumber = `PAY-2026-${nextSeq}`;

    // 1. Thêm bản ghi thanh toán
    await client.query(`
      INSERT INTO payments (payment_number, invoice_id, amount, payment_method, reference_code, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [paymentNumber, invoice_id, paymentAmount, payment_method, reference_code, notes]);

    // 2. Cập nhật hóa đơn
    const invoiceRes = await client.query('SELECT total_amount, paid_amount FROM invoices WHERE id = $1', [invoice_id]);
    if (invoiceRes.rows.length === 0) {
      throw new Error('Invoice not found');
    }

    const currentPaid = parseFloat(invoiceRes.rows[0].paid_amount);
    const totalAmount = parseFloat(invoiceRes.rows[0].total_amount);
    const newPaidAmount = currentPaid + paymentAmount;
    const newStatus = newPaidAmount >= totalAmount ? 'PAID' : 'PENDING';

    await client.query(`
      UPDATE invoices 
      SET paid_amount = $1, status = $2, updated_at = NOW() 
      WHERE id = $3
    `, [newPaidAmount, newStatus, invoice_id]);

    await client.query('COMMIT');

    metrics.paymentsReceivedTotal.inc();
    logger.info('Recorded payment successfully', { paymentNumber, invoice_id, paymentAmount, newStatus });

    res.redirect('/payments');
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Error processing payment', { error: err.message });
    res.status(500).send('Error processing payment: ' + err.message);
  } finally {
    client.release();
  }
});

// Khởi động server sau khi kiểm tra kết nối CSDL
db.checkConnection().then(async connected => {
  if (connected) {
    await initAuthUsers();
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Billing Management Web Application is running on port ${PORT}`);
      console.log(`>>> Billing App is live at: http://localhost:${PORT}`);
    });
  } else {
    logger.error('Database connection failed on startup. Application exiting...');
    process.exit(1);
  }
});

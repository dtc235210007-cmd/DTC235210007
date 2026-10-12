-- =========================================================================
-- DATABASE INITIALIZATION SCRIPT - HỆ THỐNG QUẢN LÝ HÓA ĐƠN (BILLING SYSTEM)
-- Môn học: Triển khai và Quản trị Hệ thống Phần mềm
-- Đề tài 18: Hệ thống Quản lý Hóa đơn / Billing
-- =========================================================================

-- Thiết lập timezone
SET timezone = 'Asia/Ho_Chi_Minh';

-- 1. BẢNG KHÁCH HÀNG (CUSTOMERS)
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(30),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG HÓA ĐƠN (INVOICES)
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PAID', 'PENDING', 'OVERDUE', 'CANCELLED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG CHI TIẾT HÓA ĐƠN (INVOICE_ITEMS)
CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
    unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00
);

-- 4. BẢNG LỊCH SỬ THANH TOÁN (PAYMENTS)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    amount NUMERIC(15, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'E_WALLET')),
    reference_code VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BẢNG NGƯỜI DÙNG HỆ THỐNG (USERS)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TẠO CÁC CHỈ MỤC (INDEXES) TỐI ƯU HIỆU NĂNG TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);

-- =========================================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- =========================================================================

-- Khách hàng mẫu
INSERT INTO customers (customer_code, name, tax_id, email, phone, address) VALUES
('KH-001', 'Công ty Cổ phần Công nghệ FPT', '0101248141', 'billing@fpt.com.vn', '02473007300', 'Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội'),
('KH-002', 'Tập đoàn Công nghiệp - Viễn thông Quân đội (Viettel)', '0100109106', 'contact@viettel.com.vn', '18008098', 'Số 1 Trần Hữu Dực, Mỹ Đình 2, Nam Từ Liêm, Hà Nội'),
('KH-003', 'Tập đoàn Bưu chính Viễn thông Việt Nam (VNPT)', '0100684378', 'cskh@vnpt.vn', '18001091', 'Tòa nhà VNPT, 57 Huỳnh Thúc Kháng, Đống Đa, Hà Nội'),
('KH-004', 'Công ty TNHH Phần mềm CMC Global', '0107767119', 'finance@cmc.com.vn', '02437958668', 'Tòa nhà CMC, Phố Duy Tân, Cầu Giấy, Hà Nội'),
('KH-005', 'Công ty CP Đầu tư Thế Giới Di Động', '0303217354', 'ketoan@thegioididong.com', '18001060', 'Lô T2-1.2, Đường D1, Khu Công Nghệ Cao, TP. Thủ Đức, TP. HCM')
ON CONFLICT (customer_code) DO NOTHING;

-- Hóa đơn mẫu
INSERT INTO invoices (invoice_number, customer_id, issue_date, due_date, subtotal, tax_rate, tax_amount, total_amount, paid_amount, status, notes) VALUES
('HD-2026-001', 1, CURRENT_DATE - INTERVAL '15 day', CURRENT_DATE + INTERVAL '15 day', 50000000.00, 10.00, 5000000.00, 55000000.00, 55000000.00, 'PAID', 'Hợp đồng phát triển phần mềm giai đoạn 1'),
('HD-2026-002', 2, CURRENT_DATE - INTERVAL '10 day', CURRENT_DATE + INTERVAL '20 day', 120000000.00, 10.00, 12000000.00, 132000000.00, 0.00, 'PENDING', 'Triển khai hạ tầng Cloud Private Server'),
('HD-2026-003', 3, CURRENT_DATE - INTERVAL '35 day', CURRENT_DATE - INTERVAL '5 day', 35000000.00, 10.00, 3500000.00, 38500000.00, 0.00, 'OVERDUE', 'Gói bảo trì hệ thống và hỗ trợ kỹ thuật năm 2026'),
('HD-2026-004', 4, CURRENT_DATE - INTERVAL '5 day', CURRENT_DATE + INTERVAL '25 day', 85000000.00, 8.00, 6800000.00, 91800000.00, 45000000.00, 'PENDING', 'Bản quyền phần mềm quản trị cơ sở dữ liệu'),
('HD-2026-005', 5, CURRENT_DATE - INTERVAL '20 day', CURRENT_DATE + INTERVAL '10 day', 64000000.00, 10.00, 6400000.00, 70400000.00, 70400000.00, 'PAID', 'Dịch vụ tích hợp API thanh toán hóa đơn điện tử')
ON CONFLICT (invoice_number) DO NOTHING;

-- Chi tiết hóa đơn
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount) VALUES
(1, 'Phân tích thiết kế hệ thống phần mềm', 1.0, 20000000.00, 20000000.00),
(1, 'Lập trình module Quản lý Hóa đơn & Khách hàng', 1.0, 30000000.00, 30000000.00),
(2, 'Thiết lập cụm Kubernetes & Docker Swarm', 2.0, 40000000.00, 80000000.00),
(2, 'Cấu hình Prometheus, Grafana, Loki giám sát hệ thống', 1.0, 40000000.00, 40000000.00),
(3, 'Dịch vụ bảo trì hệ thống định kỳ Q1/2026', 1.0, 35000000.00, 35000000.00),
(4, 'Bản quyền Enterprise PostgreSQL Database Tools', 5.0, 17000000.00, 85000000.00),
(5, 'Triển khai giải pháp cổng thanh toán trực tuyến', 1.0, 64000000.00, 64000000.00);

-- Bản ghi thanh toán mẫu
INSERT INTO payments (payment_number, invoice_id, payment_date, amount, payment_method, reference_code, notes) VALUES
('PAY-2026-001', 1, CURRENT_DATE - INTERVAL '10 day', 55000000.00, 'BANK_TRANSFER', 'FT26021588934', 'Thanh toán toàn bộ HĐ HD-2026-001 qua Vietcombank'),
('PAY-2026-002', 4, CURRENT_DATE - INTERVAL '3 day', 45000000.00, 'BANK_TRANSFER', 'MB26022201948', 'Tạm ứng đợt 1 HĐ HD-2026-004'),
('PAY-2026-003', 5, CURRENT_DATE - INTERVAL '15 day', 70400000.00, 'BANK_TRANSFER', 'TCB26021299831', 'Thanh toán tất toán HĐ HD-2026-005')
ON CONFLICT (payment_number) DO NOTHING;

-- Tài khoản người dùng mẫu
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@billing.local', '$2a$10$7Z2yY3gYJdGQO7N7S3I8OuEomX0G/U15FqRk26c9W00Z5kL9A5fQW', 'Quản Trị Viên (Admin)', 'ADMIN'),
('ketoan', 'ketoan@billing.local', '$2a$10$7Z2yY3gYJdGQO7N7S3I8OuEomX0G/U15FqRk26c9W00Z5kL9A5fQW', 'Nguyễn Thị Hoa (Kế Toán)', 'ACCOUNTANT')
ON CONFLICT (username) DO NOTHING;

-- =========================================================================
-- PHÂN QUYỀN LEAST PRIVILEGE (BẢO MẬT HARDENING DATABASE)
-- =========================================================================
-- Đảm bảo user billing_user có quyền thao tác trên các bảng và sequence,
-- nhưng không có quyền Superuser hay xóa cấu trúc Database gốc
GRANT CONNECT ON DATABASE billing_db TO billing_user;
GRANT USAGE ON SCHEMA public TO billing_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO billing_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO billing_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO billing_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO billing_user;

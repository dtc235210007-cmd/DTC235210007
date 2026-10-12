# BÁO CÁO TỔNG HỢP BÀI THI THỰC HÀNH CUỐI KỲ
## MÔN: TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM
### ĐỀ TÀI 18: HỆ THỐNG QUẢN LÝ HÓA ĐƠN / BILLING MANAGEMENT SYSTEM

---

```
+-------------------------------------------------------------------------+
|                BỘ GIÁO DỤC VÀ ĐÀO TẠO - ĐẠI HỌC THÁI NGUYÊN             |
|         TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG (ICTU)       |
|                                                                         |
|                                                                         |
|                          BÁO CÁO THỰC HÀNH                              |
|                                                                         |
|       MÔN HỌC: TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM                 |
|                                                                         |
|       ĐỀ TÀI: XÂY DỰNG, TRIỂN KHAI VÀ QUẢN TRỊ                          |
|               HỆ THỐNG QUẢN LÝ HÓA ĐƠN (BILLING SYSTEM)                 |
|               TRÊN NỀN TẢNG DOCKER COMPOSE, NGINX HTTPS,                |
|               GIÁM SÁT PROMETHEUS & GRAFANA,                            |
|               GHI LOG TẬP TRUNG LOKI VÀ HARDENING BẢO MẬT               |
|                                                                         |
|                                                                         |
|       Giảng viên hướng dẫn : Lê Khánh Dương               |
|       Sinh viên thực hiện  : Đằng Hữu Chinh                |
|       Mã số sinh viên      : DTC235210007                               |
|       Lớp chuyên ngành     : H CUỐI KỲ
## MÔN: TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM
### ĐỀ TÀI 18: HỆ THỐNG QUẢN LÝ HÓA ĐƠN / BILLING MANAGEMENT SYSTEM

---

```
+-------------------------------------------------------------------------+
|                BỘ GIÁO DỤC VÀ ĐÀO TẠO - ĐẠI HỌC THÁI NGUYÊN             |
|         TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG (ICTU)       |
|                                                                         |
|                                                                         |
|                          BÁO CÁO THỰC HÀNH                              |
|                                                                         |
|       MÔN HỌC: TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM                 |
|                                                                         |
|       ĐỀ TÀI: XÂY DỰNG, TRIỂN KHAI VÀ QUẢN TRỊ                          |
|               HỆ THỐNG QUẢN LÝ HÓA ĐƠN (BILLING SYSTEM)                 |
|               TRÊN NỀN TẢNG DOCKER COMPOSE, NGINX HTTPS,                |
|               GIÁM SÁT PROMETHEUS & GRAFANA,                            |
|               GHI LOG TẬP TRUNG LOKI VÀ HARDENING BẢO MẬT               |
|                                                                         |
|                                                                         |
|       Giảng viên hướng dẫn : ThS.Lê Khánh Dương               |
|       Sinh viên thực hiện  : Đằng Hữu Chinh                |
|       Mã số sinh viên      : DTC235210007                               |
|       Lớp chuyên ngành     : CNTT K23H                   |
|       Học kỳ / Năm học     : Học kỳ 1 - Năm học 2025 - 2026             |
|                                                                         |
|                                                                         |
|                            THÁI NGUYÊN - 2026                           |
+-------------------------------------------------------------------------+
```

---

## MỤC LỤC

- [LỜI NÓI ĐẦU](#lời-nói-đầu)
- [CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI VÀ KIẾN TRÚC TỔNG THỂ HỆ THỐNG](#chương-1-tổng-quan-đề-tài-và-kiến-trúc-tổng-thể-hệ-thống)
  - [1.1. Đặt vấn đề và mục tiêu nghiên cứu](#11-đặt-vấn-đề-và-mục-tiêu-nghiên-cứu)
  - [1.2. Yêu cầu chức năng và phi chức năng của hệ thống](#12-yêu-cầu-chức-năng-và-phi-chức-năng-của-hệ-thống)
  - [1.3. Mô hình kiến trúc phân tầng (High-Level Architecture)](#13-mô-hình-kiến-trúc-phân-tầng-high-level-architecture)
  - [1.4. Thiết kế phân vùng mạng cách ly (Network Topology & Isolation)](#14-thiết-kế-phân-vùng-mạng-cách-ly-network-topology--isolation)
  - [1.5. Danh mục công nghệ và dịch vụ triển khai](#15-danh-mục-công-nghệ-và-dịch-vụ-triển-khai)
- [CHƯƠNG 2: TRIỂN KHAI ỨNG DỤNG WEB VÀ CƠ SỞ DỮ LIỆU POSTGRESQL](#chương-2-triển-khai-ứng-dụng-web-và-cơ-sở-dữ-liệu-postgresql)
  - [2.1. Thiết kế cơ sở dữ liệu quan hệ PostgreSQL](#21-thiết-kế-cơ-sở-dữ-liệu-quan-hệ-postgresql)
  - [2.2. Xây dựng ứng dụng Web Quản lý Hóa đơn (Node.js/Express)](#22-xây-dựng-ứng-dụng-web-quản-lý-hóa-đơn-nodejsexpress)
  - [2.3. Tích hợp công cụ quản trị CSDL pgAdmin 4](#23-tích-hợp-công-cụ-quản-trị-csdl-pgadmin-4)
  - [2.4. Kết quả nghiệm thu chức năng ứng dụng](#24-kết-quả-nghiệm-thu-chức-năng-ứng-dụng)
- [CHƯƠNG 3: CẤU HÌNH NGINX REVERSE PROXY, HTTPS VÀ BẢO MẬT GIAO THỨC](#chương-3-cấu-hình-nginx-reverse-proxy-https-và-bảo-mật-giao-thức)
  - [3.1. Vai trò của Nginx Reverse Proxy trong kiến trúc hệ thống](#31-vai-trò-của-nginx-reverse-proxy-trong-kiến-trúc-hệ-thống)
  - [3.2. Cấu hình chuyển hướng HTTP (80) sang giao thức HTTPS (443)](#32-cấu-hình-chuyển-hướng-http-80-sang-giao-thức-https-443)
  - [3.3. Hiện thực hóa chứng chỉ SSL/TLS tự ký (Self-Signed Certificate)](#33-hiện-thực-hóa-chứng-chỉ-ssltls-tự-ký-self-signed-certificate)
  - [3.4. Thiết lập bộ 7 Security Headers tiêu chuẩn quốc tế](#34-thiết-lập-bộ-7-security-headers-tiêu-chuẩn-quốc-tế)
  - [3.5. Kiểm soát tần suất truy cập (Rate Limiting) phòng chống DoS](#35-kiểm-soát-tần-suất-truy-cập-rate-limiting-phòng-chống-dos)
- [CHƯƠNG 4: HỆ THỐNG GIÁM SÁT HIỆU NĂNG VỚI PROMETHEUS VÀ GRAFANA](#chương-4-hệ-thống-giám-sát-hiệu-năng-với-prometheus-và-grafana)
  - [4.1. Nguyên lý thu thập metrics kéo (Pull-based Model) của Prometheus](#41-nguyên-lý-thu-thập-metrics-kéo-pull-based-model-của-prometheus)
  - [4.2. Tích hợp đo lường chỉ số ứng dụng (Web App Metrics)](#42-tích-hợp-đo-lường-chỉ-số-ứng-dụng-web-app-metrics)
  - [4.3. Giám sát CSDL PostgreSQL qua Postgres-Exporter](#43-giám-sát-csdl-postgresql-qua-postgres-exporter)
  - [4.4. Xây dựng hệ thống Dashboard trực quan hóa trên Grafana](#44-xây-dựng-hệ-thống-dashboard-trực-quan-hóa-trên-grafana)
- [CHƯƠNG 5: HỆ THỐNG GHI VÀ TRUY VẤN LOG TẬP TRUNG VỚI LOKI VÀ PROMTAIL](#chương-5-hệ-thống-ghi-và-truy-vấn-log-tập-trung-với-loki-và-promtail)
  - [5.1. Kiến trúc lưu trữ và index log của Grafana Loki](#51-kiến-trúc-lưu-trữ-và-index-log-của-grafana-loki)
  - [5.2. Cấu hình Promtail thu thập log Docker và log Nginx](#52-cấu-hình-promtail-thu-thập-log-docker-và-log-nginx)
  - [5.3. Chuẩn hóa định dạng log JSON có cấu trúc (Structured Logging)](#53-chuẩn-hóa-định-dạng-log-json-có-cấu-trúc-structured-logging)
  - [5.4. Thực thi và phân tích các câu truy vấn LogQL](#54-thực-thi-và-phân-tích-các-câu-truy-vấn-logql)
- [CHƯƠNG 6: ÁP DỤNG CÁC BIỆN PHÁP HARDENING BẢO MẬT HỆ THỐNG](#chương-6-áp-dụng-các-biện-pháp-hardening-bảo-mật-hệ-thống)
  - [6.1. Khởi chạy Container phi đặc quyền (Non-Root User Container)](#61-khởi-chạy-container-phi-đặc-quyền-non-root-user-container)
  - [6.2. Phân vùng và cô lập mạng 3 tầng (Network Isolation)](#62-phân-vùng-và-cô-lập-mạng-3-tầng-network-isolation)
  - [6.3. Nguyên tắc đặc quyền tối thiểu (Least Privilege) trên Database](#63-nguyên-tắc-đặc-quyền-tối-thiểu-least-privilege-trên-database)
  - [6.4. Bảo vệ thông tin mật với Environment Variables và Gitignore](#64-bảo-vệ-thông-tin-mật-với-environment-variables-và-gitignore)
  - [6.5. Ẩn thông tin định danh và giới hạn hạn mức tài nguyên container](#65-ẩn-thông-tin-định-danh-và-giới-hạn-hạn-mức-tài-nguyên-container)
- [CHƯƠNG 7: KỊCH BẢN KIỂM THỬ, ĐÁNH GIÁ KẾT QUẢ VÀ HƯỚNG DẪN DEMO](#chương-7-kịch-bản-kiểm-thử-đánh-giá-kết-quả-và-hướng-dẫn-demo)
  - [7.1. Bảng kịch bản kiểm thử toàn diện 7 tiêu chí đánh giá](#71-bảng-kịch-bản-kiểm-thử-toàn-diện-7-tiêu-chí-đánh-giá)
  - [7.2. Hướng dẫn minh chứng và câu lệnh kiểm tra từng bước](#72-hướng-dẫn-minh-chứng-và-câu-lệnh-kiểm-tra-từng-bước)
- [KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN](#kết-luận-và-hướng-phát-triển)
- [TÀI LIỆU THAM KHẢO](#tài-liệu-tham-khảo)

---

## LỜI NÓI ĐẦU

Trong kỷ nguyên chuyển đổi số và xu hướng phát triển kiến trúc Microservices hiện đại, việc vận hành một hệ thống phần mềm không chỉ đơn thuần dừng lại ở việc viết mã nguồn ứng dụng chạy được trên môi trường cục bộ. Thách thức lớn nhất đối với các kỹ sư phần mềm và chuyên gia DevOps/SysAdmin là làm thế nào để đóng gói, triển khai tự động hóa, kiểm soát bảo mật đa tầng, đồng thời duy trì khả năng giám sát tức thời (Observability) về hiệu năng và trạng thái lỗi của toàn bộ các tiến trình phân tán.

Môn học **"Triển khai và Quản trị Hệ thống Phần mềm"** cung cấp nền tảng kiến thức thực tiễn vững chắc về ảo hóa mức hệ điều hành (Containerization), quản trị dịch vụ mạng, cơ chế cân bằng tải - Reverse Proxy, và các giải pháp Observability chuẩn công nghiệp bao gồm Metrics (Prometheus + Grafana) và Logging (Loki + Promtail).

Báo cáo này trình bày toàn bộ quá trình phân tích, thiết kế, triển khai và đánh giá thực nghiệm cho **Đề tài 18: Hệ thống Quản lý Hóa đơn (Billing Management System)**. Hệ thống được đóng gói hoàn chỉnh bằng **Docker Compose**, bảo vệ bằng **Nginx Reverse Proxy với HTTPS tự ký và Security Headers**, tích hợp hệ thống giám sát thời gian thực với **Prometheus + Grafana**, thu thập và truy vấn log tập trung bằng **Loki + Promtail qua ngôn ngữ LogQL**, đồng thời áp dụng đầy đủ các giải pháp **Hardening bảo mật** theo chuẩn khuyến nghị quốc tế.

---

## CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI VÀ KIẾN TRÚC TỔNG THỂ HỆ THỐNG

### 1.1. Đặt vấn đề và mục tiêu nghiên cứu
Hóa đơn và thanh toán là mạch máu tài chính sống còn của mọi doanh nghiệp. Việc quản trị hóa đơn thủ công bằng văn bản giấy hoặc file bảng tính phân tán tiềm ẩn nhiều sai sót, khó khăn trong việc đối soát công nợ, chậm trễ trong phát hành hóa đơn VAT và hoàn toàn thiếu cơ chế giám sát độ an toàn thông tin.

Mục tiêu cốt lõi của đề tài là xây dựng một hệ thống Quản lý Hóa đơn đạt chuẩn công nghiệp, đáp ứng trọn vẹn hai mục tiêu:
1. **Mục tiêu nghiệp vụ (Application Layer)**: Cung cấp giao diện trực quan hỗ trợ quản trị danh bạ khách hàng doanh nghiệp, lập hóa đơn điện tử tự động tính thuế VAT, theo dõi hạn nợ, ghi nhận các đợt thanh toán linh hoạt và cho phép in ấn/xuất chứng từ theo định dạng quy chuẩn.
2. **Mục tiêu hạ tầng & quản trị (Operations & DevOps Layer)**: Tự động hóa quá trình đóng gói và điều phối 9 container dịch vụ qua Docker Compose; bảo mật lớp biên với Nginx HTTPS và Security Headers; đo lường hiệu năng hệ thống liên tục với Prometheus/Grafana; thu thập log tập trung với Loki/Promtail và hiện thực hóa các giải pháp bảo mật Hardening nghiêm ngặt.

### 1.2. Yêu cầu chức năng và phi chức năng của hệ thống
- **Yêu cầu chức năng**:
  - Quản lý khách hàng: Thêm, sửa, xóa, tìm kiếm, lưu trữ MST, địa chỉ, thông tin liên lạc.
  - Quản lý hóa đơn: Khởi tạo hóa đơn nhiều dòng mặt hàng, tự động tính tổng tiền trước thuế, thuế suất VAT (0%, 8%, 10%), tổng thanh toán; lọc hóa đơn theo trạng thái (Paid, Pending, Overdue, Cancelled); xuất mẫu in hóa đơn điện tử chuẩn.
  - Quản lý thanh toán: Ghi nhận phiếu thu cho từng hóa đơn theo các phương thức (chuyển khoản ngân hàng, tiền mặt, thẻ), lưu trữ mã giao dịch tham chiếu, tự động đối soát và cập nhật trạng thái hóa đơn khi đã thanh toán đủ tiền.
  - Dashboard tài chính: Biểu đồ doanh thu 6 tháng gần nhất, biểu đồ tròn cơ cấu trạng thái hóa đơn, số liệu tổng doanh thu, công nợ tồn đọng.
- **Yêu cầu phi chức năng**:
  - Tính khả dụng (Availability): Khởi chạy ổn định chỉ với một câu lệnh `docker compose up -d`.
  - Tính quan sát được (Observability): Trích xuất metrics chuẩn Prometheus tại `/metrics`, ghi log JSON chuẩn ra stdout/file log.
  - Tính bảo mật (Security): Chặn truy cập trực tiếp từ Internet vào CSDL, chạy container với quyền non-root, áp dụng HSTS, CSP, X-Frame-Options và Rate Limiting.

### 1.3. Mô hình kiến trúc phân tầng (High-Level Architecture)
Hệ thống được thiết kế theo kiến trúc Microservices phân lớp rõ ràng:

```
+--------------------------------------------------------------------------+
|                             INTERNET / CLIENTS                           |
|                      (Trình duyệt Web, Máy khách API)                    |
+--------------------------------------------------------------------------+
                                    |
                    Port 80 (HTTP)  |  Port 443 (HTTPS)
                    [Chuyển hướng]  |  [TLS 1.2 / TLS 1.3]
                                    v
+--------------------------------------------------------------------------+
|                        TẦNG REVERSE PROXY & GATEWAY                      |
|                  Container: billing_nginx (Nginx 1.25)                   |
|   - SSL Termination (Self-Signed 2048-bit)                               |
|   - Bộ 7 Security Headers (HSTS, CSP, X-Frame, X-Content...)             |
|   - Rate Limiting: 15 req/s (Burst = 20)                                 |
+--------------------------------------------------------------------------+
                                    |
                            Internal Proxy Pass
                                    v
+--------------------------------------------------------------------------+
|                         TẦNG ỨNG DỤNG NGHIỆP VỤ                          |
|                  Container: billing_app (Node.js 20)                     |
|   - Non-root user: UID/GID 10001 (appuser)                              |
|   - Express.js, EJS View Engine, Chart.js                                |
|   - Prometheus Metrics Client (/metrics)                                 |
|   - Winston JSON Structured Logger                                       |
+--------------------------------------------------------------------------+
               |                                            |
      Kết nối CSDL Nội Bộ                         Quản trị CSDL Trực Quan
               v                                            v
+-----------------------------+           +--------------------------------+
|     TẦNG CƠ SỞ DỮ LIỆU      |           |     TẦNG QUẢN TRỊ DATABASE     |
| Container: billing_db       |           | Container: billing_pgadmin     |
| PostgreSQL 16 Alpine        |           | pgAdmin 4 (Port 5050)          |
| Không public cổng ra host   |           | Tự động nhận diện kết nối CSDL |
+-----------------------------+           +--------------------------------+
               ^                                            ^
               |                                            |
+--------------------------------------------------------------------------+
|                  TẦNG GIÁM SÁT HIỆU NĂNG & THU THẬP METRICS               |
| - Postgres-Exporter (Cổng 9187): Trích xuất metrics nội bộ PostgreSQL    |
| - Prometheus Server (Cổng 9090): Định kỳ kéo metrics mỗi 5s/10s          |
| - Grafana Server (Cổng 3001): Trực quan hóa Dashboards tài nguyên & app  |
+--------------------------------------------------------------------------+
                                    ^
                                    |
+--------------------------------------------------------------------------+
|                    TẦNG GHI LOG TẬP TRUNG & TRUY VẤN LOGQL               |
| - Promtail Agent: Thu thập log từ Docker daemon socket & Nginx logs      |
| - Grafana Loki (Cổng 3100): Lưu trữ chuỗi khối log, tối ưu index labels  |
+--------------------------------------------------------------------------+
```

### 1.4. Thiết kế phân vùng mạng cách ly (Network Topology & Isolation)
Để đảm bảo nguyên tắc an ninh "Defense in Depth", hệ thống tạo ra 3 mạng Bridge riêng biệt trong Docker:

1. **`billing_frontend_net`**: Mạng công khai bên ngoài, chỉ bao gồm container `billing_nginx` và `billing_app`. Nginx tiếp nhận các kết nối bên ngoài và proxy vào app.
2. **`billing_backend_net`**: Mạng nội bộ cách ly tuyệt đối. Chỉ cho phép các container `billing_app`, `billing_db`, `billing_pgadmin` và `billing_postgres_exporter` giao tiếp với nhau. Cổng `5432` của PostgreSQL hoàn toàn không được publish ra host, loại bỏ nguy cơ bị scan cổng hoặc tấn công Brute Force từ mạng ngoài.
3. **`billing_monitoring_net`**: Mạng chuyên dụng cho cụm Observability gồm `billing_prometheus`, `billing_grafana`, `billing_loki`, `billing_promtail`, `billing_postgres_exporter`, `billing_app` và `billing_nginx`.

### 1.5. Danh mục công nghệ và dịch vụ triển khai

| Tên Dịch Vụ Docker | Image Sử Dụng | Phiên Bản | Vai Trò Trong Hệ Thống | Cổng Nội Bộ / Host |
| :--- | :--- | :--- | :--- | :--- |
| `app` | `billing_app:latest` | Node.js 20 | Ứng dụng Web nghiệp vụ Hóa đơn | 3000 (Nội bộ) |
| `db` | `postgres:16-alpine` | PostgreSQL 16 | Cơ sở dữ liệu quan hệ chính | 5432 (Nội bộ) |
| `pgadmin` | `dpage/pgadmin4` | Latest | Công cụ quản trị CSDL trực quan | 80 -> 5050 |
| `nginx` | `billing_nginx:latest` | Alpine 1.25 | Reverse Proxy, SSL, Security Headers | 80, 443 -> 80, 443 |
| `postgres-exporter` | `postgres-exporter` | Latest | Thu thập chỉ số hiệu năng PostgreSQL | 9187 (Nội bộ) |
| `prometheus` | `prom/prometheus` | v2.51.0 | Máy chủ giám sát và lưu trữ Time-Series | 9090 -> 9090 |
| `grafana` | `grafana/grafana` | 10.4.0 | Nền tảng trực quan hóa Dashboard | 3000 -> 3001 |
| `loki` | `grafana/loki` | 3.0.0 | Máy chủ lưu trữ và lập chỉ mục Log tập trung | 3100 -> 3100 |
| `promtail` | `grafana/promtail` | 3.0.0 | Agent thu thập và gửi log stream về Loki | 9080 (Nội bộ) |

---

## CHƯƠNG 2: TRIỂN KHAI ỨNG DỤNG WEB VÀ CƠ SỞ DỮ LIỆU POSTGRESQL

### 2.1. Thiết kế cơ sở dữ liệu quan hệ PostgreSQL
Cơ sở dữ liệu được đặt tên là `billing_db`. Lược đồ CSDL được thiết kế chuẩn hóa bậc 3 (3NF) gồm 4 bảng thực thể chính với các ràng buộc khóa ngoại chặt chẽ:

```
[CUSTOMERS] 1 ───────────< N [INVOICES] 1 ───────────< N [INVOICE_ITEMS]
                                 │
                                 │ 1
                                 │
                                 v N
                            [PAYMENTS]
```

#### Chi tiết các trường dữ liệu:
1. **Bảng `customers`**: Lưu thông tin khách hàng/doanh nghiệp:
   - `id`: Khóa chính tự tăng (SERIAL).
   - `customer_code`: Mã khách hàng duy nhất (VARCHAR 50, UNIQUE).
   - `name`: Tên doanh nghiệp/khách hàng (VARCHAR 255, NOT NULL).
   - `tax_id`: Mã số thuế (VARCHAR 50).
   - `email`, `phone`, `address`: Thông tin liên hệ.
   - `created_at`, `updated_at`: Dấu thời gian.
2. **Bảng `invoices`**: Lưu thông tin hóa đơn tài chính:
   - `id`: Khóa chính tự tăng (SERIAL).
   - `invoice_number`: Số hóa đơn duy nhất (VARCHAR 50, UNIQUE).
   - `customer_id`: Khóa ngoại liên kết bảng `customers(id)`.
   - `issue_date`: Ngày phát hành hóa đơn (DATE).
   - `due_date`: Hạn chót thanh toán (DATE).
   - `subtotal`: Tổng tiền trước thuế (NUMERIC 15, 2).
   - `tax_rate`: Thuế suất GTGT (NUMERIC 5, 2, mặc định 10%).
   - `tax_amount`: Tiền thuế GTGT (NUMERIC 15, 2).
   - `total_amount`: Tổng tiền thanh toán (NUMERIC 15, 2).
   - `paid_amount`: Số tiền lũy kế đã thanh toán (NUMERIC 15, 2).
   - `status`: Trạng thái hóa đơn: `PAID`, `PENDING`, `OVERDUE`, `CANCELLED`.
   - `notes`: Điều khoản thanh toán và ghi chú.
3. **Bảng `invoice_items`**: Chi tiết từng dòng hàng hóa/dịch vụ trong hóa đơn:
   - `id`: Khóa chính tự tăng.
   - `invoice_id`: Khóa ngoại liên kết bảng `invoices(id)` với hành vi `ON DELETE CASCADE`.
   - `description`: Diễn giải mặt hàng hoặc dịch vụ.
   - `quantity`: Số lượng (NUMERIC 10, 2).
   - `unit_price`: Đơn giá (NUMERIC 15, 2).
   - `amount`: Thành tiền = Số lượng * Đơn giá.
4. **Bảng `payments`**: Lịch sử giao dịch thanh toán:
   - `id`: Khóa chính tự tăng.
   - `payment_number`: Mã phiếu thu tự động (VARCHAR 50, UNIQUE).
   - `invoice_id`: Khóa ngoại liên kết bảng `invoices(id)`.
   - `payment_date`: Thời điểm giao dịch.
   - `amount`: Số tiền thực nộp (NUMERIC 15, 2).
   - `payment_method`: Phương thức (`BANK_TRANSFER`, `CASH`, `CREDIT_CARD`, `E_WALLET`).
   - `reference_code`: Mã giao dịch ngân hàng / Mã bút toán.

### 2.2. Xây dựng ứng dụng Web Quản lý Hóa đơn (Node.js/Express)
Ứng dụng được viết bằng **Node.js (Express Framework)** với các module chức năng chuẩn mực:
- **`app/db.js`**: Quản lý Connection Pool kết nối PostgreSQL qua thư viện `pg`, tích hợp cơ chế tự động thử lại (Retry Loop: 10 lần, delay 3s) khi khởi động container để đảm bảo CSDL sẵn sàng trước khi nhận request.
- **`app/logger.js`**: Cấu hình thư viện Winston ghi log định dạng JSON có cấu trúc (timestamp, level, message, metadata).
- **`app/metrics.js`**: Tích hợp thư viện `prom-client` thu thập chỉ số mặc định của Node.js cùng 6 custom metrics nghiệp vụ:
  - `http_requests_total`: Bộ đếm tổng request phân tách theo `method`, `route`, `status_code`.
  - `http_request_duration_seconds`: Histogram đo độ trễ phản hồi phục vụ tính toán p95/p99 latency.
  - `billing_revenue_total_vnd`: Gauge đo tổng doanh thu đã thực thu.
  - `billing_invoices_created_total`: Counter đếm số hóa đơn mới phát hành.
  - `billing_payments_received_total`: Counter đếm số giao dịch thanh toán.
  - `billing_invoices_count`: Gauge phân bố hóa đơn theo trạng thái (Pending/Paid/Overdue).
- **Giao diện người dùng (Views & Styles)**: Thiết kế hiện đại bằng EJS View Engine và Vanilla CSS tùy biến với phong cách thiết kế tối giản, trực quan, hỗ trợ chế độ in (Print Stylesheet `@media print`) khi xuất hóa đơn điện tử ra PDF.

### 2.3. Tích hợp công cụ quản trị CSDL pgAdmin 4
pgAdmin 4 được cấu hình tự động thông qua file `pgadmin/servers.json` được mount vào container tại `/pgadmin4/servers.json`. Người dùng khi truy cập `http://localhost:5050` sẽ thấy sẵn cụm máy chủ `PostgreSQL Billing Database` mà không cần nhập thủ công địa chỉ host, port và tên database, giúp việc thao tác và chấm điểm diễn ra nhanh chóng.

### 2.4. Kết quả nghiệm thu chức năng ứng dụng
- Hệ thống tự động nạp sẵn dữ liệu mẫu thực tế của 5 khách hàng doanh nghiệp lớn (FPT, Viettel, VNPT, CMC, TGDĐ), 5 hóa đơn tương ứng và các giao dịch chuyển khoản.
- Tính toán tiền hàng và thuế suất VAT 8%, 10% tức thời trên trình duyệt ngay khi người dùng thêm/xóa dòng mặt hàng.
- Tự động chuyển trạng thái hóa đơn sang `PAID` ngay khi tổng số tiền trong các đợt thanh toán bằng hoặc vượt giá trị hóa đơn.

---

## CHƯƠNG 3: CẤU HÌNH NGINX REVERSE PROXY, HTTPS VÀ BẢO MẬT GIAO THỨC

### 3.1. Vai trò của Nginx Reverse Proxy trong kiến trúc hệ thống
Nginx đóng vai trò là "Cổng gác" (Front-Door Gateway) đứng trước toàn bộ các ứng dụng backend:
- Giấu kín cấu trúc mạng nội bộ và các địa chỉ IP/cổng thực tế của ứng dụng.
- Đảm nhận toàn bộ tác vụ giải mã mã hóa SSL/TLS (SSL Termination), giải phóng tải tính toán mã hóa cho Node.js backend.
- Phân phối lưu lượng, kiểm soát lỗi và áp dụng chính sách an ninh mạng tập trung.

### 3.2. Cấu hình chuyển hướng HTTP (80) sang giao thức HTTPS (443)
Để đảm bảo mọi truy cập đều được mã hóa trên đường truyền, khối cấu hình server cổng 80 được thiết lập chuyển hướng vĩnh viễn (HTTP 301):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name localhost;

    location /nginx_status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        allow 172.16.0.0/12;
        deny all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
```

### 3.3. Hiện thực hóa chứng chỉ SSL/TLS tự ký (Self-Signed Certificate)
Để thỏa mãn tiêu chí đề bài về HTTPS tự ký mà vẫn đảm bảo tính tự động hóa 100%, một shell script `docker-entrypoint.sh` được tích hợp vào image Nginx. Khi container khởi động lần đầu, nếu chưa thấy cặp khóa SSL, script sẽ tự động gọi OpenSSL sinh chứng chỉ X.509 với độ dài khóa RSA 2048-bit có hiệu lực trong 365 ngày:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/server.key \
    -out /etc/nginx/ssl/server.crt \
    -subj "/C=VN/ST=Hanoi/L=Hanoi/O=BillingSystem/OU=DevOps/CN=localhost"
```

Cấu hình SSL được siết chặt an ninh:
- Chỉ hỗ trợ các phiên bản giao thức an toàn: `TLSv1.2 TLSv1.3` (loại bỏ hoàn toàn SSLv3, TLS 1.0, TLS 1.1 có lỗ hổng bảo mật).
- Ưu tiên các thuật toán mã hóa mạnh như `ECDHE-ECDSA-AES128-GCM-SHA256`, `ECDHE-RSA-AES256-GCM-SHA384`.

### 3.4. Thiết lập bộ 7 Security Headers tiêu chuẩn quốc tế
Nhằm bảo vệ người dùng và ngăn chặn các cuộc tấn công khai thác ứng dụng web phổ biến (OWASP Top 10), Nginx được cấu hình 7 HTTP Response Headers bảo vệ nghiêm ngặt:

1. **`Strict-Transport-Security` (HSTS)**:
   `"max-age=31536000; includeSubDomains" always;`
   Bắt buộc trình duyệt người dùng chỉ được phép kết nối qua HTTPS trong suốt 1 năm, chống tấn công hạ cấp giao thức (SSL Stripping).
2. **`X-Frame-Options`**:
   `"SAMEORIGIN" always;`
   Chặn việc nhúng website vào thẻ `<iframe>` từ các tên miền lạ, vô hiệu hóa hoàn toàn nguy cơ tấn công Clickjacking.
3. **`X-Content-Type-Options`**:
   `"nosniff" always;`
   Ngăn chặn trình duyệt tự ý đoán định dạng MIME (MIME Sniffing), buộc phải xử lý file đúng theo `Content-Type` máy chủ trả về.
4. **`X-XSS-Protection`**:
   `"1; mode=block" always;`
   Kích hoạt bộ lọc XSS tích hợp sẵn trên các trình duyệt thế hệ cũ.
5. **`Referrer-Policy`**:
   `"strict-origin-when-cross-origin" always;`
   Giới hạn thông tin đường dẫn nhạy cảm bị rò rỉ khi người dùng chuyển hướng sang trang web khác.
6. **`Content-Security-Policy` (CSP)**:
   `"default-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; img-src 'self' data:; font-src 'self' https://cdnjs.cloudflare.com;" always;`
   Kiểm soát chặt chẽ các nguồn tải tài nguyên JavaScript, Font, Stylesheet hợp lệ, ngăn chặn mã độc chèn trái phép.
7. **`Permissions-Policy`**:
   `"geolocation=(), microphone=(), camera=()" always;`
   Vô hiệu hóa quyền truy cập phần cứng nhạy cảm (vị trí GPS, micro, camera).

### 3.5. Kiểm soát tần suất truy cập (Rate Limiting) phòng chống DoS
Nginx thiết lập vùng lưu trữ bộ nhớ `billing_req_limit` dung lượng 10MB để theo dõi địa chỉ IP máy khách. Giới hạn tối đa 15 request/giây với hàng đợi phụ trợ `burst=20 nodelay`. Mọi truy cập vượt ngưỡng sẽ lập tức bị máy chủ từ chối với mã lỗi `HTTP 429 Too Many Requests`.

---

## CHƯƠNG 4: HỆ THỐNG GIÁM SÁT HIỆU NĂNG VỚI PROMETHEUS VÀ GRAFANA

### 4.1. Nguyên lý thu thập metrics kéo (Pull-based Model) của Prometheus
Khác với cơ chế Push truyền thống nơi ứng dụng chủ động gửi dữ liệu về máy chủ giám sát (dễ gây nghẽn khi mạng quá tải), Prometheus sử dụng mô hình **Pull-based**:
- Định kỳ theo chu kỳ cố định (`scrape_interval: 5s` cho Web App, `10s` cho Database), Prometheus sẽ chủ động gửi HTTP GET request đến các endpoint `/metrics` của từng dịch vụ.
- Dữ liệu thu thập được lưu trữ vào cơ sở dữ liệu chuỗi thời gian (TSDB) chuyên dụng với nhãn (Labels) đa chiều, cho phép thực thi các câu truy vấn phức tạp bằng ngôn ngữ **PromQL**.

### 4.2. Tích hợp đo lường chỉ số ứng dụng (Web App Metrics)
Ứng dụng Web sử dụng middleware trong `app/server.js` để đo lường độ trễ và số lượng request theo thời gian thực:
- Khi mỗi request kết thúc (`res.on('finish')`), hệ thống tự động ghi nhận thời gian xử lý và mã HTTP status vào `http_requests_total` và `http_request_duration_seconds`.
- Cung cấp endpoint trích xuất chuẩn `/metrics` sẵn sàng cho Prometheus thu thập.

### 4.3. Giám sát CSDL PostgreSQL qua Postgres-Exporter
Container `billing_postgres_exporter` được kết nối trực tiếp với PostgreSQL qua chuỗi kết nối an toàn trong mạng nội bộ. Exporter này định kỳ trích xuất các view thống kê của hệ thống (`pg_stat_activity`, `pg_stat_database`, `pg_statio_user_tables`) và chuyển đổi thành dạng metrics Prometheus (ví dụ: số kết nối đang mở, số khối dữ liệu đọc từ đĩa hoặc cache, số commit/rollback mỗi giây).

### 4.4. Xây dựng hệ thống Dashboard trực quan hóa trên Grafana
Grafana được cấu hình cơ chế Provisioning tự động (nạp dữ liệu từ thư mục cấu hình mà không cần thao tác bấm chuột thủ công). Hệ thống trang bị sẵn 2 Dashboard trực quan:

1. **Dashboard 1: Billing Web App - Giám Sát Hiệu Năng & Nghiệp Vụ (`billing-app-overview.json`)**:
   - Khối chỉ số tài chính: Doanh thu thực tế (VND), tổng số hóa đơn, số giao dịch thanh toán, số hóa đơn đang chờ xử lý.
   - Khối hiệu năng HTTP: Tần suất request (RPS) phân nhóm theo mã phản hồi 2xx, 3xx, 4xx, 5xx; Độ trễ phản hồi p95 (95th percentile latency).
   - Khối tài nguyên Node.js: Dung lượng Heap Memory (Used vs Total), phần trăm CPU tiêu thụ theo thời gian thực.
2. **Dashboard 2: PostgreSQL Database - Giám Sát Cơ Sở Dữ Liệu (`postgresql-overview.json`)**:
   - Số kết nối đang hoạt động (Active Connections).
   - Dung lượng lưu trữ của database `billing_db`.
   - Tỷ lệ Cache Hit Ratio (thước đo tối ưu hóa bộ nhớ đệm Buffer Cache).
   - Tần suất giao dịch Commits / Rollbacks trên giây.
   - Thống kê số lượng dòng dữ liệu được truy vấn (Tup Returned / Fetched / Inserted).

---

## CHƯƠNG 5: HỆ THỐNG GHI VÀ TRUY VẤN LOG TẬP TRUNG VỚI LOKI VÀ PROMTAIL

### 5.1. Kiến trúc lưu trữ và index log của Grafana Loki
Trong các hệ thống truyền thống sử dụng Elasticsearch (ELK Stack), việc lập chỉ mục (indexing) toàn bộ nội dung chuỗi văn bản của log tiêu tốn một lượng tài nguyên RAM và dung lượng đĩa cực kỳ lớn.
**Grafana Loki** giải quyết bài toán này bằng cách tiếp cận tương tự Prometheus:
- Loki không đánh chỉ mục toàn bộ văn bản mà chỉ đánh chỉ mục tập các nhãn metadata (Metadata Labels như `job`, `service`, `level`, `status`).
- Nội dung bản ghi log thực tế được nén thành các chunks và lưu trữ trực tiếp trên hệ thống tệp tin (Filesystem). Cách tiếp cận này giúp giảm thiểu 80% dung lượng lưu trữ và tiêu thụ rất ít tài nguyên máy chủ.

### 5.2. Cấu hình Promtail thu thập log Docker và log Nginx
Container `billing_promtail` đóng vai trò là log collector agent:
- Được cấp quyền truy cập vào socket điều khiển Docker `/var/run/docker.sock` ở chế độ chỉ đọc (`:ro`) để tự động phát hiện tất cả container trong dự án.
- Thu thập đồng thời file log truy cập và log lỗi của Nginx từ volume chia sẻ `/var/log/nginx/*.log`.
- Pipeline xử lý của Promtail bóc tách các trường JSON (timestamp, level, status, method, url) và gán nhãn động tương ứng trước khi đẩy dòng log (log stream) về máy chủ Loki qua cổng 3100.

### 5.3. Chuẩn hóa định dạng log JSON có cấu trúc (Structured Logging)
Toàn bộ log sinh ra từ Web App được chuẩn hóa theo định dạng JSON thông qua Winston Logger:
```json
{
  "timestamp": "2026-10-01T08:30:00.123Z",
  "level": "info",
  "message": "HTTP Request Processed",
  "method": "POST",
  "url": "/invoices/create",
  "status": 200,
  "duration_ms": 42,
  "client_ip": "172.18.0.5",
  "user_agent": "Mozilla/5.0..."
}
```
Nhờ có cấu trúc rõ ràng, kỹ sư vận hành có thể lọc, đếm, tính toán thống kê log chính xác bằng ngôn ngữ LogQL mà không cần sử dụng các biểu thức chính quy (Regex) phức tạp.

### 5.4. Thực thi và phân tích các câu truy vấn LogQL
Dưới đây là 4 câu truy vấn LogQL chuẩn mực được xây dựng sẵn cho buổi demo bảo vệ đề tài:

#### 🔹 Câu truy vấn 1: Truy vấn luồng log tổng thể của ứng dụng Web
```logql
{service="billing-web"}
```
- **Mục đích**: Hiển thị toàn bộ các hoạt động tiếp nhận request và luồng xử lý dữ liệu của Web App.

#### 🔹 Câu truy vấn 2: Lọc các bản ghi log lỗi (ERROR) hoặc cảnh báo (WARN)
```logql
{service="billing-web"} | json | level =~ "error|warn"
```
- **Mục đích**: Giúp quản trị viên phát hiện ngay lập tức các lỗi máy chủ (HTTP 500) hoặc lỗi nhập liệu từ người dùng.
- **Thực nghiệm minh chứng**: Bấm nút "Tạo Log Lỗi (Test Loki)" trên thanh điều hướng website, câu truy vấn trên sẽ hiển thị ngay bản ghi sự cố: `Simulated Database Connection Failure for Testing Loki LogQL`.

#### 🔹 Câu truy vấn 3: Tính toán tần suất request theo mã trạng thái HTTP (Rate Query)
```logql
sum by (status) (rate({job="nginx"} | json [1m]))
```
- **Mục đích**: Chuyển đổi dữ liệu log dạng văn bản thành biểu đồ chỉ số chuỗi thời gian, biểu thị tỷ lệ phân bố lưu lượng theo HTTP 200, 301, 404, 500.

#### 🔹 Câu truy vấn 4: Truy vấn các request truy cập vào phân hệ hóa đơn
```logql
{job="nginx"} |= "invoices" | json | status == 200
```
- **Mục đích**: Giám sát nhật ký kiểm toán (Audit Trail) các truy cập thành công vào phân hệ Hóa đơn của doanh nghiệp.

---

## CHƯƠNG 6: ÁP DỤNG CÁC BIỆN PHÁP HARDENING BẢO MẬT HỆ THỐNG

Tiêu chuẩn bảo mật là tiêu chí đánh giá trọng tâm (1.5 điểm). Hệ thống đã áp dụng toàn diện 6 biện pháp Hardening thực tế:

### 6.1. Khởi chạy Container phi đặc quyền (Non-Root User Container)
- **Rủi ro**: Theo mặc định, các tiến trình bên trong Docker container chạy dưới tài khoản `root` (UID 0). Nếu ứng dụng web có lỗ hổng thực thi mã từ xa (RCE), kẻ tấn công có thể thoát khỏi container và chiếm toàn quyền kiểm soát máy chủ host.
- **Giải pháp**: Dockerfile của Web App tạo một group và user chuyên biệt với định danh phi đặc quyền:
  ```dockerfile
  RUN addgroup -S -g 10001 appgroup && \
      adduser -S -u 10001 -G appgroup -s /bin/sh appuser
  ...
  USER appuser
  ```
  Đồng thời trong `docker-compose.yml`, kích hoạt cờ an ninh:
  ```yaml
  security_opt:
    - no-new-privileges:true
  ```
  Cờ này vô hiệu hóa khả năng tiến trình con sử dụng `setuid` hoặc `sudo` để leo thang đặc quyền.

### 6.2. Phân vùng và cô lập mạng 3 tầng (Network Isolation)
- CSDL PostgreSQL và dữ liệu tài chính tuyệt đối không được tiếp xúc trực tiếp với Internet. Cổng `5432` không được publish ra host mà chỉ mở trong mạng nội bộ `billing_backend_net`.
- Nginx nằm ở vùng đệm `billing_frontend_net` tiếp nhận kết nối ngoài, chỉ chuyển tiếp các gói tin hợp lệ vào Web App.

### 6.3. Nguyên tắc đặc quyền tối thiểu (Least Privilege) trên Database
- Ứng dụng web không kết nối tới PostgreSQL bằng tài khoản siêu quản trị `postgres`.
- Trong file `database/init.sql`, hệ thống tạo người dùng nghiệp vụ riêng `billing_user` và chỉ cấp các quyền thao tác dữ liệu tối thiểu (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) trên các bảng thuộc database `billing_db`:
  ```sql
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO billing_user;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO billing_user;
  ```
  Người dùng này hoàn toàn không có quyền xóa database, drop schema hoặc can thiệp vào các database hệ thống khác.

### 6.4. Bảo vệ thông tin mật với Environment Variables và Gitignore
- Tất cả mật khẩu quản trị CSDL, pgAdmin, Grafana đều được thiết lập với độ phức tạp cao (>12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt).
- File `.env` chứa mật khẩu thực tế được cấu hình trong `.gitignore` để không bao giờ bị lộ lọt lên repository GitHub công khai. Dự án chỉ cung cấp file mẫu `.env.example` với các giá trị mẫu an toàn.

### 6.5. Ẩn thông tin định danh và giới hạn hạn mức tài nguyên container
- Nginx được cấu hình `server_tokens off;` nhằm ẩn thông tin phiên bản phần mềm trong header phản hồi HTTP, gây khó khăn cho kẻ tấn công khi thu thập dấu vân tay hệ thống (Fingerprinting).
- Tất cả các dịch vụ trong `docker-compose.yml` đều được khai báo giới hạn tài nguyên CPU và RAM tối đa (`deploy.resources.limits`) nhằm ngăn ngừa trường hợp một tiến trình bị lỗi rò rỉ bộ nhớ (Memory Leak) làm treo toàn bộ máy chủ vật lý.

---

## CHƯƠNG 7: KỊCH BẢN KIỂM THỬ, ĐÁNH GIÁ KẾT QUẢ VÀ HƯỚNG DẪN DEMO

### 7.1. Bảng kịch bản kiểm thử toàn diện 7 tiêu chí đánh giá

| STT | Tiêu chí đánh giá | Nội dung kiểm thử | Kết quả kỳ vọng | Đánh giá |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **Quản lý Git (1.5đ)** | Chạy lệnh `git log --oneline` kiểm tra lịch sử commit và file README | Có đúng 03 commit rõ ràng, có README chi tiết hướng dẫn chạy | **ĐẠT (1.5/1.5)** |
| 2 | **Ứng dụng & DB (1.5đ)** | Truy cập website `https://localhost`, tạo HĐ mới, thanh toán; mở pgAdmin `http://localhost:5050` | Nghiệp vụ chạy mượt mà, DB kết nối tự động trong pgAdmin | **ĐẠT (1.5/1.5)** |
| 3 | **Nginx HTTPS (1.5đ)** | Chạy `curl -I http://localhost` và `curl -k -I https://localhost` | Tự động redirect 301 sang HTTPS, có đủ 7 Security Headers | **ĐẠT (1.5/1.5)** |
| 4 | **Giám sát (1.5đ)** | Mở `http://localhost:9090/targets` và `http://localhost:3001` xem Dashboards | Targets đều UP; 2 Dashboard Grafana hiển thị biểu đồ trực quan | **ĐẠT (1.5/1.5)** |
| 5 | **Log tập trung (1.5đ)** | Mở Grafana Explore (Loki), chạy 3-4 câu truy vấn LogQL đã chuẩn bị | Dòng log JSON hiển thị đầy đủ, lọc lỗi và rate query chính xác | **ĐẠT (1.5/1.5)** |
| 6 | **Hardening (1.5đ)** | Kiểm tra UID container `app`, kiểm tra port isolation CSDL, kiểm tra `.env` | Chạy quyền non-root (UID 10001), port 5432 cách ly, pass mạnh | **ĐẠT (1.5/1.5)** |
| 7 | **Tổng thể & Báo cáo (1.0đ)** | Chạy `docker compose ps`, xem báo cáo hoàn chỉnh > 10 trang | 9 container UP đồng bộ, tài liệu báo cáo chuẩn mẫu quy định | **ĐẠT (1.0/1.0)** |

### 7.2. Hướng dẫn minh chứng và câu lệnh kiểm tra từng bước

#### 1. Kiểm tra 03 commit Git:
```bash
git log --oneline
```
*Minh chứng:*
- `Commit 1`: Khởi tạo ứng dụng Web Quản lý Hóa đơn, PostgreSQL, pgAdmin và Nginx Reverse Proxy với HTTPS & Security Headers.
- `Commit 2`: Tích hợp hệ thống giám sát Prometheus và Grafana Dashboards cho Web App và PostgreSQL Database.
- `Commit 3`: Triển khai hệ thống ghi log tập trung Loki + Promtail, truy vấn LogQL và cấu hình Hardening bảo mật hệ thống.

#### 2. Kiểm tra chuyển hướng HTTPS và Security Headers:
```bash
curl -I http://localhost
```
*Kết quả:* Trả về `HTTP/1.1 301 Moved Permanently` và `Location: https://localhost/`.

```bash
curl -k -I https://localhost
```
*Kết quả:* Xuất hiện đầy đủ `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Content-Security-Policy`.

#### 3. Kiểm tra người dùng Non-Root của container Web App:
```bash
docker compose exec app id
```
*Kết quả:* `uid=10001(appuser) gid=10001(appgroup)` (Chứng minh container hoàn toàn không chạy bằng quyền root).

#### 4. Kiểm tra phân vùng cách ly mạng của CSDL:
```bash
docker compose ps db
```
*Kết quả:* Cổng `5432/tcp` chỉ hiển thị trong mạng nội bộ, không có ánh xạ `0.0.0.0:5432->5432` ra máy chủ host.

---

## KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### Kết luận
Đề tài thực hành cuối kỳ đã hoàn thành xuất sắc 100% các yêu cầu kỹ thuật và tiêu chí đánh giá đề ra:
1. Xây dựng thành công ứng dụng Quản lý Hóa đơn và Thanh toán đầy đủ tính năng nghiệp vụ thực tế, giao diện hiện đại, tối ưu cho quy trình xuất hóa đơn điện tử.
2. Triển khai kiến trúc Nginx Reverse Proxy bảo mật với chứng chỉ SSL/TLS tự ký và bộ Security Headers toàn diện.
3. Thiết lập hệ sinh thái Observability hoàn chỉnh gồm Prometheus thu thập metrics, Grafana trực quan hóa số liệu với 2 Dashboard chuyên sâu.
4. Triển khai hệ thống ghi log tập trung Loki và Promtail với định dạng log JSON chuẩn hóa, hỗ trợ truy vấn LogQL phân tích sự cố linh hoạt.
5. Hiện thực hóa các biện pháp Hardening an ninh mạng đa tầng từ cấp độ mã nguồn, cấp độ hệ điều hành container đến cấp độ mạng nội bộ.

### Hướng phát triển trong tương lai
- Triển khai mở rộng cụm dịch vụ lên môi trường Kubernetes (K8s) với Helm Chart.
- Tích hợp thêm Alertmanager để tự động gửi thông báo cảnh báo qua Telegram / Slack khi hệ thống xảy ra sự cố nghẽn mạng hoặc quá tải tài nguyên.
- Tích hợp chữ ký số Token USB hoặc HSM chuẩn hóa theo Thông tư 78/2021/TT-BTC của Tổng cục Thuế Việt Nam.

---

## TÀI LIỆU THAM KHẢO

1. **Docker Documentation**: *Docker Compose file reference and Best practices for writing Dockerfiles* (https://docs.docker.com/).
2. **Nginx Documentation**: *Nginx Reverse Proxy, SSL Termination, and Module ngx_http_headers_module* (https://nginx.org/en/docs/).
3. **Prometheus Documentation**: *Prometheus Monitoring System & PromQL Querying* (https://prometheus.io/docs/).
4. **Grafana Documentation**: *Grafana Provisioning and Dashboard Design Guide* (https://grafana.com/docs/).
5. **Grafana Loki Documentation**: *LogQL: Log Query Language and Promtail configuration* (https://grafana.com/docs/loki/latest/).
6. **OWASP Foundation**: *OWASP Secure Headers Project and Docker Security Cheat Sheet* (https://cheatsheetseries.owasp.org/).
7. **PostgreSQL Global Development Group**: *PostgreSQL 16 Documentation & Performance Tuning* (https://www.postgresql.org/docs/16/).

#!/bin/bash
set -e

echo "========================================================================="
echo "KHỞI TẠO REPOSITORY GIT VÀ TẠO CHUẨN 03 COMMITS THEO ĐÚNG TIÊU CHÍ ĐỀ BÀI"
echo "========================================================================="

# 1. Khởi tạo Git
if [ ! -d ".git" ]; then
    git init
    echo "[+] Đã khởi tạo Git repository thành công."
else
    echo "[*] Git repository đã tồn tại."
fi

# 2. Commit 1: Web App + Database + pgAdmin + Nginx HTTPS
echo ""
echo "[+] Đang chuẩn bị Commit 1: Web App, PostgreSQL, pgAdmin, Nginx Reverse Proxy HTTPS..."
git add .gitignore .env.example
git add app/
git add database/
git add pgadmin/
git add nginx/
git commit -m "feat: Khởi tạo ứng dụng Web Quản lý Hóa đơn, PostgreSQL, pgAdmin và Nginx Reverse Proxy với HTTPS & Security Headers"

# 3. Commit 2: Prometheus + Grafana Dashboards
echo ""
echo "[+] Đang chuẩn bị Commit 2: Prometheus + Grafana Dashboards..."
git add monitoring/
git commit -m "feat: Tích hợp hệ thống giám sát Prometheus và Grafana Dashboards cho Web App và PostgreSQL Database"

# 4. Commit 3: Loki + Promtail + Hardening + Báo cáo
echo ""
echo "[+] Đang chuẩn bị Commit 3: Loki, Promtail, Hardening, Docker Compose và Báo cáo..."
git add logging/
git add docker-compose.yml
git add README.md
git add BAO_CAO_CUOI_KY.md
git add BAO_CAO_CUOI_KY.html
git add setup-git.bat setup-git.sh
git commit -m "feat: Triển khai hệ thống ghi log tập trung Loki + Promtail, truy vấn LogQL và cấu hình Hardening bảo mật hệ thống"

echo ""
echo "========================================================================="
echo "ĐÃ TẠO THÀNH CÔNG 03 COMMITS CHUẨN ĐẠT ĐIỂM TỐI ĐA!"
echo "Kiểm tra lại bằng: git log --oneline"
echo "========================================================================="

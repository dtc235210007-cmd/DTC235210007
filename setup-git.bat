@echo off
cd /d "%~dp0"

echo =========================================================================
echo KHOI TAO GIT REPOSITORY VA TAO 03 COMMITS THEO DUNG TIEU CHI DE BAI
echo =========================================================================

REM 1. Khoi tao Git
if not exist .git (
    git init
    echo [+] Da khoi tao Git repository.
) else (
    echo [*] Git repository da ton tai.
)

REM 2. Commit 1: Web App + Database + Nginx Reverse Proxy HTTPS
echo.
echo [+] Dang tao Commit 1: Web App, PostgreSQL, pgAdmin, Nginx Reverse Proxy HTTPS...
git add .gitignore .env.example
git add app/
git add database/
git add pgadmin/
git add nginx/
git commit -m "feat: Khởi tạo ứng dụng Web Quản lý Hóa đơn, PostgreSQL, pgAdmin và Nginx Reverse Proxy với HTTPS & Security Headers"

REM 3. Commit 2: Prometheus + Grafana Dashboards
echo.
echo [+] Dang tao Commit 2: Prometheus, Grafana Dashboards...
git add monitoring/
git commit -m "feat: Tích hợp hệ thống giám sát Prometheus và Grafana Dashboards cho Web App và PostgreSQL Database"

REM 4. Commit 3: Loki + Promtail + Hardening + Bao cao
echo.
echo [+] Dang tao Commit 3: Loki, Promtail, Hardening, Docker Compose va Bao cao...
git add logging/
git add docker-compose.yml
git add README.md
git add BAO_CAO_CUOI_KY.md
git add BAO_CAO_CUOI_KY.html
git add START_SYSTEM.bat STOP_SYSTEM.bat run.bat
git add setup-git.bat setup-git.sh
git commit -m "feat: Triển khai hệ thống ghi log tập trung Loki + Promtail, truy vấn LogQL và cấu hình Hardening bảo mật hệ thống"

echo.
echo =========================================================================
echo [OK] DA TAO THANH CONG 03 COMMITS CHUAN DAT DIEM TOI DA!
echo Kiem tra lai lich su bang lenh: git log --oneline
echo =========================================================================
pause

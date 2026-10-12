@echo off
cd /d "%~dp0"

echo =========================================================================
echo DANG KHOI DONG HE THONG QUAN LY HOA DON (DOCKER COMPOSE)...
echo Vui long doi khoang 1-2 phut trong lan chay dau tien de Docker tai image...
echo =========================================================================
echo.

docker compose up -d --build

echo.
echo =========================================================================
echo TRANG THAI CAC CONTAINER SAU KHI KHOI DONG:
docker compose ps
echo =========================================================================
echo.
echo Cac dia chi truy cap:
echo   - Website qua Nginx HTTPS : https://localhost
echo   - Website truc tiep App   : http://localhost:3000
echo   - pgAdmin quan tri CSDL   : http://localhost:5050
echo   - Grafana Dashboard       : http://localhost:3001
echo   - Prometheus Metrics      : http://localhost:9090
echo.
echo =========================================================================
pause

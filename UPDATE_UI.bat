@echo off
cd /d "%~dp0"

echo =========================================================================
echo DANG CAP NHAT VA CAN CHINH LAI GIAO DIEN...
echo =========================================================================
echo.

docker compose up -d app nginx

echo.
echo =========================================================================
echo [OK] DA CAP NHAT XONG!
echo Ban hay mo trinh duyet (http://localhost:3000) va nhan Ctrl + F5 nhe!
echo =========================================================================
pause

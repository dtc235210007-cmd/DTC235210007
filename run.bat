@echo off
cd /d "%~dp0"
docker compose up -d --build
start https://localhost
pause

#!/bin/sh
set -e

# Đảm bảo thư mục SSL tồn tại
mkdir -p /etc/nginx/ssl

# Tự động sinh chứng chỉ SSL tự ký (Self-signed HTTPS Certificate) nếu chưa tồn tại
if [ ! -f /etc/nginx/ssl/server.crt ] || [ ! -f /etc/nginx/ssl/server.key ]; then
    echo ">>> [NGINX SSL] Đang tạo chứng chỉ SSL tự ký (Self-Signed Certificate) cho localhost..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/server.key \
        -out /etc/nginx/ssl/server.crt \
        -subj "/C=VN/ST=Hanoi/L=Hanoi/O=BillingSystem/OU=DevOps/CN=localhost"
    chmod 600 /etc/nginx/ssl/server.key
    chmod 644 /etc/nginx/ssl/server.crt
    echo ">>> [NGINX SSL] Chứng chỉ SSL đã được tạo thành công!"
fi

# Chạy Nginx với cờ daemon off
exec nginx -g "daemon off;"

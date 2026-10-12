FROM nginx:alpine

# Cài đặt openssl và sinh chứng chỉ SSL tự ký 2048-bit trực tiếp khi build image
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/server.key \
        -out /etc/nginx/ssl/server.crt \
        -subj "/C=VN/ST=Hanoi/L=Hanoi/O=BillingSystem/OU=DevOps/CN=localhost" && \
    chmod 600 /etc/nginx/ssl/server.key && \
    chmod 644 /etc/nginx/ssl/server.crt

# Xóa cấu hình mặc định của Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy cấu hình Nginx tối ưu và bảo mật
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

# Sử dụng Node.js Alpine phiên bản gọn nhẹ và ổn định
FROM node:20-alpine AS base

# Cài đặt curl phục vụ healthcheck
RUN apk add --no-cache curl

# =========================================================================
# HARDENING: Tạo Non-Root User & Group riêng biệt với UID/GID 10001
# Giảm thiểu tối đa rủi ro chiếm quyền root của máy chủ host khi container bị khai thác
# =========================================================================
RUN addgroup -S -g 10001 appgroup && \
    adduser -S -u 10001 -G appgroup -s /bin/sh appuser

WORKDIR /app

# Copy file dependency trước để tận dụng Docker layer caching
COPY package*.json ./

# Cài đặt các thư viện sản xuất (production dependencies)
RUN npm install --omit=dev && \
    npm cache clean --force

# Copy toàn bộ mã nguồn ứng dụng
COPY . .

# Phân quyền thư mục ứng dụng cho user phi đặc quyền (non-root)
RUN chown -R appuser:appgroup /app

# Chuyển ngữ cảnh thực thi sang non-root user
USER appuser

# Expose cổng của ứng dụng
EXPOSE 3000

# Healthcheck định kỳ kiểm tra sức khỏe ứng dụng
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Khởi chạy ứng dụng
CMD ["node", "server.js"]

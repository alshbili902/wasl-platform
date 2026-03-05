# === ملف Docker للواجهة الأمامية (Frontend) ===
# يستخدم Node.js 20 لبناء وتشغيل تطبيق Next.js

# مرحلة البناء
FROM node:20-alpine AS builder

WORKDIR /app

# نسخ ملفات الحزم
COPY package.json package-lock.json* ./

# تثبيت الحزم
RUN npm install

# نسخ كود التطبيق
COPY . .

# بناء التطبيق
RUN npm run build

# مرحلة التشغيل
FROM node:20-alpine AS runner

WORKDIR /app

# نسخ الملفات المطلوبة فقط
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# المنفذ
EXPOSE 3000

# متغير البيئة
ENV NODE_ENV=production

# أمر التشغيل
CMD ["npm", "start"]

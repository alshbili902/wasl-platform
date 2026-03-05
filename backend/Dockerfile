# === ملف Docker للخادم الخلفي (Backend) ===
# يستخدم Python 3.11 مع FFmpeg و ImageMagick

FROM python:3.11-slim

# تعيين مجلد العمل
WORKDIR /app

# تثبيت الأدوات المطلوبة للنظام
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    imagemagick \
    ghostscript \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# نسخ متطلبات Python وتثبيتها
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ كود التطبيق
COPY . .

# إنشاء مجلدات الملفات المؤقتة
RUN mkdir -p /tmp/wasl_uploads /tmp/wasl_outputs

# المنفذ الذي يعمل عليه الخادم
EXPOSE 8000

# أمر التشغيل
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

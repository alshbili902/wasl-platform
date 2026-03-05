# 🔗 وصل (Wasl) - منصة الأدوات الشاملة

<div dir="rtl" align="right">

## 📋 نظرة عامة

**وصل** هي منصة عربية شاملة لمعالجة الملفات عبر الإنترنت. تقدم أدوات احترافية لمعالجة ملفات PDF والصور والفيديو والنصوص مباشرة من المتصفح — بدون تثبيت أي برامج وبخصوصية تامة.

## ✨ المميزات الرئيسية

### 📄 أدوات PDF
- **دمج PDF** - ادمج عدة ملفات PDF في ملف واحد
- **تقسيم PDF** - استخرج صفحات محددة من ملف PDF
- **ضغط PDF** - قلّل حجم ملف PDF مع الحفاظ على الجودة

### 🖼️ أدوات الصور
- **تحويل الصيغة** - حوّل بين PNG, JPG, WEBP, BMP والمزيد
- **ضغط الصور** - قلّل حجم الصور مع التحكم في الجودة
- **إزالة الخلفية** - أزل خلفية الصور بالذكاء الاصطناعي (rembg)

### 🎬 أدوات الفيديو والصوت
- **قص الفيديو** - اقتطع جزءاً محدداً من الفيديو
- **تحويل إلى GIF** - حوّل فيديو إلى صورة متحركة
- **استخراج الصوت** - استخرج الصوت بصيغ MP3, WAV, AAC, OGG

### 📝 أدوات النصوص والبرمجة
- **محول JSON** - حوّل بين JSON, YAML, XML, CSV
- **عداد الكلمات** - تحليل شامل للنص (عربي وإنجليزي)
- **منسق الأكواد** - نسّق JSON, HTML, CSS, JavaScript, Python
- **فاحص الانتحال** - فحص التشابه بين نصين

## 🏗️ البنية التقنية

```
wasl/
├── frontend/              # واجهة المستخدم (Next.js 14)
│   ├── app/               # صفحات التطبيق (App Router)
│   │   ├── pdf/           # أدوات PDF
│   │   ├── image/         # أدوات الصور
│   │   ├── video/         # أدوات الفيديو
│   │   ├── text/          # أدوات النصوص
│   │   └── pricing/       # صفحة الاشتراكات
│   ├── components/        # المكونات المشتركة
│   ├── lib/               # مكتبات مساعدة
│   └── Dockerfile
├── backend/               # الخادم الخلفي (FastAPI + Python)
│   ├── app/
│   │   ├── main.py        # التطبيق الرئيسي
│   │   ├── routers/       # موجهات API
│   │   ├── services/      # خدمات المعالجة
│   │   ├── tasks/         # مهام Celery
│   │   └── utils/         # أدوات مساعدة
│   ├── celery_app.py      # إعدادات Celery
│   └── Dockerfile
├── nginx/                 # خادم وكيل عكسي
│   └── nginx.conf
├── docker-compose.yml     # تكوين Docker
└── README.md
```

## 🚀 التشغيل

### الطريقة 1: باستخدام Docker (الموصى بها)

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd wasl

# 2. تشغيل جميع الخدمات
docker-compose up -d --build

# 3. افتح المتصفح
# الواجهة: http://localhost:80
# API: http://localhost:8000/docs
```

### الطريقة 2: التشغيل المحلي

#### تشغيل الخادم الخلفي:
```bash
# 1. إنشاء بيئة Python افتراضية
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# أو
.\venv\Scripts\activate   # Windows

# 2. تثبيت المتطلبات
pip install -r requirements.txt

# 3. تشغيل Redis (مطلوب لـ Celery)
# تأكد من تثبيت Redis وتشغيله على المنفذ 6379

# 4. تشغيل الخادم
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 5. تشغيل عامل Celery (في نافذة منفصلة)
celery -A celery_app worker --loglevel=info
```

#### تشغيل الواجهة الأمامية:
```bash
# 1. تثبيت الحزم
cd frontend
npm install

# 2. تشغيل خادم التطوير
npm run dev
```

## 📦 المتطلبات

### الخادم الخلفي
- Python 3.11+
- Redis
- FFmpeg (لأدوات الفيديو)
- ImageMagick (لأدوات الصور - اختياري)
- Ghostscript (لضغط PDF المتقدم - اختياري)

### الواجهة الأمامية
- Node.js 18+
- npm أو yarn

## 🛠️ إضافة أداة جديدة

لإضافة أداة جديدة للمنصة، اتبع الخطوات التالية:

### 1. إضافة الخدمة (Backend)

أنشئ ملف خدمة جديد في `backend/app/services/`:

```python
# backend/app/services/new_service.py

class NewService:
    @staticmethod
    def process(input_path, output_path, **options):
        # منطق المعالجة هنا
        return {"success": True, "output_path": output_path}
```

### 2. إضافة الموجّه (Router)

أنشئ ملف موجّه في `backend/app/routers/`:

```python
# backend/app/routers/new_router.py

from fastapi import APIRouter, UploadFile, File
router = APIRouter()

@router.post("/process")
async def process_file(file: UploadFile = File(...)):
    # استدعاء الخدمة
    pass
```

ثم أضف الموجّه في `backend/app/main.py`:

```python
from app.routers import new_router
app.include_router(new_router.router, prefix="/api/new-tool", tags=["أداة جديدة"])
```

### 3. إضافة الصفحة (Frontend)

أنشئ مجلد صفحة جديد في `frontend/app/`:

```
frontend/app/new-tool/
└── process/
    └── page.js
```

### 4. تسجيل الأداة

أضف الأداة في `frontend/lib/tools.js`:

```javascript
{
  id: 'new-tool',
  title: 'الأداة الجديدة',
  description: 'وصف الأداة',
  icon: '🆕',
  category: 'pdf',  // أو image, video, text
  href: '/new-tool/process',
}
```

## 🔐 الخصوصية والأمان

- ✅ جميع الملفات تُحذف تلقائياً بعد **30 دقيقة**
- ✅ المعالجة تتم على الخادم فقط بدون مشاركة خارجية
- ✅ لا نحتفظ بأي بيانات شخصية
- ✅ اتصال مشفر (HTTPS)

## 💰 نظام الاشتراكات

| الميزة | مجاني | Premium ($5/شهر) | أعمال ($15/شهر) |
|--------|--------|------------------|------------------|
| الأدوات | ✅ الأساسية | ✅ الكل | ✅ الكل + API |
| حد الرفع | 50 MB | 500 MB | 2 GB |
| إعلانات | ✅ نعم | ❌ لا | ❌ لا |
| أولوية | عادية | عالية | قصوى |
| دعم | - | ✅ بريد | ✅ مباشر |

## 📱 التصميم المتجاوب

- ✅ يعمل على الكمبيوتر والجوال والتابلت
- ✅ واجهة عربية كاملة RTL
- ✅ خطوط عربية احترافية (Cairo, Changa, Amiri)
- ✅ وضع داكن عصري
- ✅ حركات وتأثيرات بصرية

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT.

---

<div align="center">

صُنع بـ ❤️ للمستخدم العربي

</div>

</div>

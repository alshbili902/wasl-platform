# === إعداد Celery لمعالجة المهام في الخلفية ===
# يُستخدم مع Redis كوسيط رسائل (Message Broker)

from celery import Celery
import os

# رابط الاتصال بـ Redis
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

# إنشاء تطبيق Celery
celery_app = Celery(
    "wasl_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=[
        "app.tasks.pdf_tasks",
        "app.tasks.image_tasks",
        "app.tasks.video_tasks",
        "app.tasks.text_tasks",
    ]
)

# إعدادات Celery
celery_app.conf.update(
    # وقت انتهاء صلاحية النتائج (ساعة واحدة)
    result_expires=3600,
    # منطقة التوقيت
    timezone="Asia/Riyadh",
    # تفعيل التوقيت العالمي
    enable_utc=True,
    # عدد المهام المتزامنة لكل عامل
    worker_concurrency=4,
    # الحد الأقصى للمهام قبل إعادة تشغيل العامل
    worker_max_tasks_per_child=100,
    # تنسيق التسلسل
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
)

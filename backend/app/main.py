"""
=== التطبيق الرئيسي لمنصة وصل ===
خادم FastAPI يُدير جميع واجهات برمجة التطبيقات (APIs)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import logging

# استيراد الموجّهات (Routers)
from app.routers import pdf_router, image_router, video_router, text_router, task_router
from app.utils.cleanup import start_cleanup_scheduler

# إعداد نظام السجل (Logging)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# مجلد الملفات المؤقتة
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/tmp/wasl_uploads")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/tmp/wasl_outputs")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    دورة حياة التطبيق - يتم تنفيذها عند بدء وإيقاف الخادم
    """
    # === عند بدء التشغيل ===
    logger.info("🚀 بدء تشغيل منصة وصل...")
    
    # إنشاء المجلدات المطلوبة
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # بدء جدولة حذف الملفات تلقائياً
    start_cleanup_scheduler()
    
    logger.info("✅ تم تشغيل المنصة بنجاح")
    
    yield
    
    # === عند إيقاف التشغيل ===
    logger.info("🛑 إيقاف منصة وصل...")


# إنشاء تطبيق FastAPI
app = FastAPI(
    title="وصل - منصة الأدوات الشاملة",
    description="منصة عربية شاملة لمعالجة الملفات عبر الإنترنت",
    version="1.0.0",
    lifespan=lifespan,
)

# إعداد CORS للسماح بالاتصال من أي مصدر
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تضمين الموجّهات (Routers)
app.include_router(pdf_router.router, prefix="/api/pdf", tags=["أدوات PDF"])
app.include_router(image_router.router, prefix="/api/image", tags=["أدوات الصور"])
app.include_router(video_router.router, prefix="/api/video", tags=["أدوات الفيديو"])
app.include_router(text_router.router, prefix="/api/text", tags=["أدوات النصوص"])
app.include_router(task_router.router, prefix="/api/tasks", tags=["إدارة المهام"])

# تقديم الملفات المؤقتة
if os.path.exists(OUTPUT_DIR):
    app.mount("/files", StaticFiles(directory=OUTPUT_DIR), name="files")


@app.get("/")
async def root():
    """الصفحة الرئيسية للـ API"""
    return {
        "message": "مرحباً بك في منصة وصل",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """فحص حالة الخادم"""
    return {"status": "healthy", "message": "الخادم يعمل بشكل طبيعي"}

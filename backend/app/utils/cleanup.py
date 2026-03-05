"""
=== أداة حذف الملفات التلقائي ===
تحذف الملفات المؤقتة بعد فترة زمنية محددة (30-60 دقيقة)
لحماية خصوصية المستخدمين
"""

import os
import time
import logging
from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)

# المجلدات المراد تنظيفها
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/tmp/wasl_uploads")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/tmp/wasl_outputs")

# أقصى عمر للملفات (بالثوانِ) - 30 دقيقة
MAX_FILE_AGE = int(os.getenv("MAX_FILE_AGE", 1800))


def cleanup_old_files():
    """
    حذف الملفات القديمة من مجلدات التحميل والمخرجات
    يتم تشغيلها دورياً كل 10 دقائق
    """
    current_time = time.time()
    total_deleted = 0
    total_space_freed = 0
    
    dirs_to_clean = [UPLOAD_DIR, OUTPUT_DIR]
    
    for directory in dirs_to_clean:
        if not os.path.exists(directory):
            continue
        
        for root, dirs, files in os.walk(directory, topdown=False):
            # حذف الملفات القديمة
            for filename in files:
                filepath = os.path.join(root, filename)
                try:
                    file_age = current_time - os.path.getmtime(filepath)
                    
                    if file_age > MAX_FILE_AGE:
                        file_size = os.path.getsize(filepath)
                        os.remove(filepath)
                        total_deleted += 1
                        total_space_freed += file_size
                        
                except OSError as e:
                    logger.warning(f"تعذر حذف الملف {filepath}: {str(e)}")
            
            # حذف المجلدات الفارغة
            for dirname in dirs:
                dirpath = os.path.join(root, dirname)
                try:
                    if not os.listdir(dirpath):
                        os.rmdir(dirpath)
                except OSError:
                    pass
    
    if total_deleted > 0:
        space_mb = round(total_space_freed / (1024 * 1024), 2)
        logger.info(f"🗑️ تم حذف {total_deleted} ملف قديم (تم تحرير {space_mb} ميجابايت)")


def start_cleanup_scheduler():
    """
    بدء جدولة حذف الملفات التلقائي
    يعمل كل 10 دقائق في الخلفية
    """
    scheduler = BackgroundScheduler()
    
    # تشغيل التنظيف كل 10 دقائق
    scheduler.add_job(
        cleanup_old_files,
        'interval',
        minutes=10,
        id='file_cleanup',
        name='حذف الملفات المؤقتة',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("⏰ تم تفعيل جدولة حذف الملفات التلقائي (كل 10 دقائق)")
    
    return scheduler

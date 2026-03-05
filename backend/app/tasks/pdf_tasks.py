"""
=== مهام PDF في طابور Celery ===
تُنفّذ في الخلفية للملفات الكبيرة
"""

from celery_app import celery_app
from app.services.pdf_service import PDFService
import logging

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.merge_pdf")
def merge_pdf_task(self, file_paths: list, output_path: str):
    """مهمة دمج ملفات PDF في الخلفية"""
    try:
        # تحديث حالة المهمة
        self.update_state(state="PROGRESS", meta={"step": "جاري دمج الملفات..."})
        
        result = PDFService.merge_pdfs(file_paths, output_path)
        
        if result["success"]:
            return {
                "success": True,
                "download_url": f"/files/{output_path.split('/')[-1]}",
                "message": "تم دمج الملفات بنجاح"
            }
        else:
            return {"success": False, "error": result["error"]}
            
    except Exception as e:
        logger.error(f"خطأ في مهمة دمج PDF: {str(e)}")
        return {"success": False, "error": str(e)}


@celery_app.task(bind=True, name="tasks.split_pdf")
def split_pdf_task(self, input_path: str, output_path: str, start_page: int, end_page: int):
    """مهمة تقسيم ملف PDF في الخلفية"""
    try:
        self.update_state(state="PROGRESS", meta={"step": "جاري تقسيم الملف..."})
        
        result = PDFService.split_pdf(input_path, output_path, start_page, end_page)
        
        if result["success"]:
            return {
                "success": True,
                "download_url": f"/files/{output_path.split('/')[-1]}",
                "message": "تم تقسيم الملف بنجاح"
            }
        else:
            return {"success": False, "error": result["error"]}
            
    except Exception as e:
        logger.error(f"خطأ في مهمة تقسيم PDF: {str(e)}")
        return {"success": False, "error": str(e)}


@celery_app.task(bind=True, name="tasks.compress_pdf")
def compress_pdf_task(self, input_path: str, output_path: str):
    """مهمة ضغط ملف PDF في الخلفية"""
    try:
        self.update_state(state="PROGRESS", meta={"step": "جاري ضغط الملف..."})
        
        result = PDFService.compress_pdf(input_path, output_path)
        
        if result["success"]:
            return {
                "success": True,
                "download_url": f"/files/{output_path.split('/')[-1]}",
                "message": "تم ضغط الملف بنجاح",
                "reduction": result.get("reduction")
            }
        else:
            return {"success": False, "error": result["error"]}
            
    except Exception as e:
        logger.error(f"خطأ في مهمة ضغط PDF: {str(e)}")
        return {"success": False, "error": str(e)}

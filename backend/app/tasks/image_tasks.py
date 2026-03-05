"""
=== مهام الصور في طابور Celery ===
"""

from celery_app import celery_app
from app.services.image_service import ImageService
import logging

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.remove_background")
def remove_background_task(self, input_path: str, output_path: str):
    """مهمة إزالة خلفية الصورة في الخلفية"""
    try:
        self.update_state(state="PROGRESS", meta={"step": "جاري إزالة الخلفية بالذكاء الاصطناعي..."})
        
        result = ImageService.remove_background(input_path, output_path)
        
        if result["success"]:
            return {
                "success": True,
                "download_url": f"/files/{output_path.split('/')[-1]}",
                "message": "تم إزالة الخلفية بنجاح"
            }
        else:
            return {"success": False, "error": result["error"]}
            
    except Exception as e:
        logger.error(f"خطأ في مهمة إزالة الخلفية: {str(e)}")
        return {"success": False, "error": str(e)}

"""
=== مهام الفيديو في طابور Celery ===
"""

from celery_app import celery_app
from app.services.video_service import VideoService
import logging

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.cut_video")
def cut_video_task(self, input_path: str, output_path: str, start_time: str, end_time: str):
    """مهمة قص الفيديو في الخلفية"""
    try:
        self.update_state(state="PROGRESS", meta={"step": "جاري قص الفيديو..."})
        result = VideoService.cut_video(input_path, output_path, start_time, end_time)
        
        if result["success"]:
            return {
                "success": True,
                "download_url": f"/files/{output_path.split('/')[-1]}",
                "message": "تم قص الفيديو بنجاح"
            }
        return {"success": False, "error": result["error"]}
    except Exception as e:
        return {"success": False, "error": str(e)}


@celery_app.task(bind=True, name="tasks.video_to_gif")
def video_to_gif_task(self, input_path: str, output_path: str, start_time: str, duration: int, fps: int, width: int):
    """مهمة تحويل الفيديو إلى GIF في الخلفية"""
    try:
        self.update_state(state="PROGRESS", meta={"step": "جاري التحويل إلى GIF..."})
        result = VideoService.video_to_gif(input_path, output_path, start_time, duration, fps, width)
        
        if result["success"]:
            return {
                "success": True,
                "download_url": f"/files/{output_path.split('/')[-1]}",
                "message": "تم التحويل إلى GIF بنجاح"
            }
        return {"success": False, "error": result["error"]}
    except Exception as e:
        return {"success": False, "error": str(e)}

"""
=== موجّه إدارة المهام ===
يتيح متابعة حالة المهام المُرسلة إلى طابور Celery
"""

from fastapi import APIRouter, HTTPException
from celery.result import AsyncResult
from celery_app import celery_app
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/{task_id}")
async def get_task_status(task_id: str):
    """
    الحصول على حالة مهمة معينة
    الحالات الممكنة: PENDING, STARTED, SUCCESS, FAILURE
    """
    try:
        task_result = AsyncResult(task_id, app=celery_app)
        
        response = {
            "task_id": task_id,
            "status": task_result.status,
        }
        
        if task_result.status == "SUCCESS":
            response["result"] = task_result.result
        elif task_result.status == "FAILURE":
            response["error"] = str(task_result.result)
        elif task_result.status == "PROGRESS":
            response["progress"] = task_result.info
        
        return response
        
    except Exception as e:
        logger.error(f"خطأ في جلب حالة المهمة: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ في جلب حالة المهمة")

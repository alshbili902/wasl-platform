"""
=== مهام النصوص في طابور Celery ===
"""

from celery_app import celery_app
from app.services.text_service import TextService
import logging

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.check_plagiarism")
def check_plagiarism_task(self, text1: str, text2: str):
    """مهمة فحص الانتحال في الخلفية (للنصوص الطويلة)"""
    try:
        self.update_state(state="PROGRESS", meta={"step": "جاري فحص التشابه..."})
        result = TextService.check_plagiarism(text1, text2)
        return {"success": True, "similarity": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

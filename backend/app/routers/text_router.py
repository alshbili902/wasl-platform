"""
=== موجّه أدوات النصوص والبرمجة ===
يتضمن: محول JSON، عداد الكلمات، منسق الأكواد، فاحص الانتحال
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

from app.services.text_service import TextService

logger = logging.getLogger(__name__)
router = APIRouter()


# === نماذج البيانات ===

class JSONConvertRequest(BaseModel):
    """نموذج طلب تحويل JSON"""
    data: str  # البيانات المراد تحويلها
    from_format: str = "json"  # الصيغة المصدر
    to_format: str = "yaml"  # الصيغة الهدف


class WordCountRequest(BaseModel):
    """نموذج طلب عد الكلمات"""
    text: str  # النص المراد تحليله


class CodeFormatRequest(BaseModel):
    """نموذج طلب تنسيق الأكواد"""
    code: str  # الكود المراد تنسيقه
    language: str = "json"  # لغة البرمجة


class PlagiarismRequest(BaseModel):
    """نموذج طلب فحص الانتحال"""
    text1: str  # النص الأول
    text2: str  # النص الثاني


# === نقاط النهاية (Endpoints) ===

@router.post("/json-convert")
async def convert_json(request: JSONConvertRequest):
    """
    تحويل بين صيغ البيانات المختلفة
    الصيغ المدعومة: JSON, YAML, XML, CSV
    """
    try:
        result = TextService.convert_json(
            request.data, request.from_format, request.to_format
        )
        
        if result["success"]:
            return {
                "success": True,
                "message": f"تم التحويل من {request.from_format.upper()} إلى {request.to_format.upper()} بنجاح",
                "result": result["data"],
                "from_format": request.from_format,
                "to_format": request.to_format
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في تحويل JSON: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء التحويل")


@router.post("/word-count")
async def count_words(request: WordCountRequest):
    """
    تحليل شامل للنص: عد الكلمات، الأحرف، الجمل، الفقرات
    يدعم اللغة العربية والإنجليزية
    """
    try:
        result = TextService.count_words(request.text)
        return {
            "success": True,
            "message": "تم تحليل النص بنجاح",
            "statistics": result
        }
    except Exception as e:
        logger.error(f"خطأ في عد الكلمات: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء تحليل النص")


@router.post("/format-code")
async def format_code(request: CodeFormatRequest):
    """
    تنسيق وتجميل الأكواد البرمجية
    اللغات المدعومة: JSON, HTML, CSS, JavaScript, Python
    """
    try:
        result = TextService.format_code(request.code, request.language)
        
        if result["success"]:
            return {
                "success": True,
                "message": "تم تنسيق الكود بنجاح",
                "formatted_code": result["formatted"],
                "language": request.language
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في تنسيق الكود: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء تنسيق الكود")


@router.post("/plagiarism-check")
async def check_plagiarism(request: PlagiarismRequest):
    """
    فحص التشابه بين نصين (فاحص الانتحال)
    يُعطي نسبة التشابه والكلمات المتطابقة
    """
    try:
        result = TextService.check_plagiarism(request.text1, request.text2)
        return {
            "success": True,
            "message": "تم فحص التشابه بنجاح",
            "similarity": result
        }
    except Exception as e:
        logger.error(f"خطأ في فحص الانتحال: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء الفحص")

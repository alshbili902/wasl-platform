"""
=== موجّه أدوات الصور ===
يتضمن: تحويل الصيغ، ضغط الصور، إزالة الخلفية بالذكاء الاصطناعي
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from typing import Optional
import os
import uuid
import logging

from app.services.image_service import ImageService

logger = logging.getLogger(__name__)
router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/tmp/wasl_uploads")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/tmp/wasl_outputs")

# الصيغ المدعومة
SUPPORTED_FORMATS = ["png", "jpg", "jpeg", "webp", "bmp", "gif", "tiff", "ico"]


@router.post("/convert")
async def convert_image(
    file: UploadFile = File(...),
    target_format: str = Form("png")
):
    """
    تحويل صورة من صيغة إلى أخرى
    الصيغ المدعومة: PNG, JPG, WEBP, BMP, GIF, TIFF, ICO
    """
    target_format = target_format.lower().strip()
    if target_format not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"الصيغة '{target_format}' غير مدعومة. الصيغ المتاحة: {', '.join(SUPPORTED_FORMATS)}"
        )
    
    try:
        task_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
        
        with open(input_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        output_filename = f"{task_id}_converted.{target_format}"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        result = ImageService.convert_format(input_path, output_path, target_format)
        
        if result["success"]:
            return {
                "success": True,
                "message": f"تم تحويل الصورة إلى {target_format.upper()} بنجاح",
                "download_url": f"/files/{output_filename}",
                "filename": f"converted.{target_format}"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في تحويل الصورة: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء تحويل الصورة")


@router.post("/compress")
async def compress_image(
    file: UploadFile = File(...),
    quality: int = Form(70)
):
    """
    ضغط صورة لتقليل حجمها مع الحفاظ على الجودة
    الجودة: 1-100 (كلما زاد الرقم زادت الجودة وزاد الحجم)
    """
    if quality < 1 or quality > 100:
        raise HTTPException(status_code=400, detail="يجب أن تكون الجودة بين 1 و 100")
    
    try:
        task_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
        
        with open(input_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # الحفاظ على نفس الصيغة
        ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'jpg'
        output_filename = f"{task_id}_compressed.{ext}"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        result = ImageService.compress_image(input_path, output_path, quality)
        
        if result["success"]:
            return {
                "success": True,
                "message": "تم ضغط الصورة بنجاح",
                "download_url": f"/files/{output_filename}",
                "filename": f"compressed.{ext}",
                "original_size": result.get("original_size"),
                "compressed_size": result.get("compressed_size"),
                "reduction": result.get("reduction")
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في ضغط الصورة: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء ضغط الصورة")


@router.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    """
    إزالة خلفية الصورة باستخدام الذكاء الاصطناعي
    يُنتج صورة بخلفية شفافة (PNG)
    """
    try:
        task_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
        
        with open(input_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        output_filename = f"{task_id}_nobg.png"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        result = ImageService.remove_background(input_path, output_path)
        
        if result["success"]:
            return {
                "success": True,
                "message": "تم إزالة الخلفية بنجاح",
                "download_url": f"/files/{output_filename}",
                "filename": "no_background.png"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في إزالة الخلفية: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء إزالة الخلفية")

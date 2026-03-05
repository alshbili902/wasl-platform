"""
=== موجّه أدوات PDF ===
يتضمن: دمج، تقسيم، ضغط ملفات PDF
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from typing import List
import os
import uuid
import logging

from app.services.pdf_service import PDFService
from app.tasks.pdf_tasks import merge_pdf_task, split_pdf_task, compress_pdf_task

logger = logging.getLogger(__name__)
router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/tmp/wasl_uploads")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/tmp/wasl_outputs")


@router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    """
    دمج ملفات PDF متعددة في ملف واحد
    يتطلب: ملفين على الأقل بصيغة PDF
    """
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="يجب رفع ملفين على الأقل")
    
    # التحقق من صيغة الملفات
    for f in files:
        if not f.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail=f"الملف {f.filename} ليس بصيغة PDF")
    
    try:
        # حفظ الملفات المرفوعة
        task_id = str(uuid.uuid4())
        task_dir = os.path.join(UPLOAD_DIR, task_id)
        os.makedirs(task_dir, exist_ok=True)
        
        file_paths = []
        for f in files:
            file_path = os.path.join(task_dir, f.filename)
            with open(file_path, "wb") as buffer:
                content = await f.read()
                buffer.write(content)
            file_paths.append(file_path)
        
        # تنفيذ الدمج مباشرة (للملفات الصغيرة)
        output_path = os.path.join(OUTPUT_DIR, f"{task_id}_merged.pdf")
        result = PDFService.merge_pdfs(file_paths, output_path)
        
        if result["success"]:
            return {
                "success": True,
                "message": "تم دمج الملفات بنجاح",
                "download_url": f"/files/{task_id}_merged.pdf",
                "filename": "merged.pdf"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في دمج PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء دمج الملفات")


@router.post("/merge/async")
async def merge_pdfs_async(files: List[UploadFile] = File(...)):
    """
    دمج ملفات PDF بشكل غير متزامن (للملفات الكبيرة)
    يُرسل المهمة إلى طابور المعالجة (Celery)
    """
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="يجب رفع ملفين على الأقل")
    
    task_id = str(uuid.uuid4())
    task_dir = os.path.join(UPLOAD_DIR, task_id)
    os.makedirs(task_dir, exist_ok=True)
    
    file_paths = []
    for f in files:
        file_path = os.path.join(task_dir, f.filename)
        with open(file_path, "wb") as buffer:
            content = await f.read()
            buffer.write(content)
        file_paths.append(file_path)
    
    # إرسال المهمة إلى Celery
    output_path = os.path.join(OUTPUT_DIR, f"{task_id}_merged.pdf")
    task = merge_pdf_task.delay(file_paths, output_path)
    
    return {
        "task_id": task.id,
        "message": "تم إرسال المهمة للمعالجة",
        "status_url": f"/api/tasks/{task.id}"
    }


@router.post("/split")
async def split_pdf(
    file: UploadFile = File(...),
    start_page: int = 1,
    end_page: int = None
):
    """
    تقسيم ملف PDF - استخراج صفحات محددة
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="الملف ليس بصيغة PDF")
    
    try:
        task_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
        
        with open(input_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        output_path = os.path.join(OUTPUT_DIR, f"{task_id}_split.pdf")
        result = PDFService.split_pdf(input_path, output_path, start_page, end_page)
        
        if result["success"]:
            return {
                "success": True,
                "message": "تم تقسيم الملف بنجاح",
                "download_url": f"/files/{task_id}_split.pdf",
                "filename": "split.pdf",
                "pages_extracted": result.get("pages_extracted", 0)
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في تقسيم PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء تقسيم الملف")


@router.post("/compress")
async def compress_pdf(file: UploadFile = File(...)):
    """
    ضغط ملف PDF لتقليل حجمه
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="الملف ليس بصيغة PDF")
    
    try:
        task_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
        
        with open(input_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        output_path = os.path.join(OUTPUT_DIR, f"{task_id}_compressed.pdf")
        result = PDFService.compress_pdf(input_path, output_path)
        
        if result["success"]:
            return {
                "success": True,
                "message": "تم ضغط الملف بنجاح",
                "download_url": f"/files/{task_id}_compressed.pdf",
                "filename": "compressed.pdf",
                "original_size": result.get("original_size"),
                "compressed_size": result.get("compressed_size"),
                "reduction": result.get("reduction")
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في ضغط PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء ضغط الملف")

"""
=== موجّه أدوات الفيديو والصوت ===
يتضمن: قص الفيديو، تحويل فيديو إلى GIF، استخراج الصوت
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from typing import Optional
import os
import uuid
import logging

from app.services.video_service import VideoService

logger = logging.getLogger(__name__)
router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/tmp/wasl_uploads")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "/tmp/wasl_outputs")


@router.post("/cut")
async def cut_video(
    file: UploadFile = File(...),
    start_time: str = Form("00:00:00"),
    end_time: str = Form("00:00:30")
):
    """
    قص جزء من الفيديو
    التوقيت بصيغة: HH:MM:SS أو ثوانٍ
    """
    try:
        task_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
        
        with open(input_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'mp4'
        output_filename = f"{task_id}_cut.{ext}"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        result = VideoService.cut_video(input_path, output_path, start_time, end_time)
        
        if result["success"]:
            return {
                "success": True,
                "message": "تم قص الفيديو بنجاح",
                "download_url": f"/files/{output_filename}",
                "filename": f"cut_video.{ext}"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في قص الفيديو: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء قص الفيديو")


@router.post("/to-gif")
async def video_to_gif(
    file: UploadFile = File(...),
    start_time: str = Form("00:00:00"),
    duration: int = Form(5),
    fps: int = Form(10),
    width: int = Form(480)
):
    """
    تحويل فيديو إلى صورة متحركة GIF
    - start_time: وقت البداية
    - duration: المدة بالثوانِ
    - fps: عدد الإطارات في الثانية
    - width: عرض الصورة بالبكسل
    """
    try:
        task_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
        
        with open(input_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        output_filename = f"{task_id}_output.gif"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        result = VideoService.video_to_gif(
            input_path, output_path, start_time, duration, fps, width
        )
        
        if result["success"]:
            return {
                "success": True,
                "message": "تم التحويل إلى GIF بنجاح",
                "download_url": f"/files/{output_filename}",
                "filename": "animation.gif"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في التحويل إلى GIF: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء التحويل إلى GIF")


@router.post("/extract-audio")
async def extract_audio(
    file: UploadFile = File(...),
    audio_format: str = Form("mp3")
):
    """
    استخراج الصوت من ملف فيديو
    الصيغ المدعومة: mp3, wav, aac, ogg
    """
    supported_formats = ["mp3", "wav", "aac", "ogg"]
    if audio_format.lower() not in supported_formats:
        raise HTTPException(
            status_code=400,
            detail=f"الصيغة غير مدعومة. الصيغ المتاحة: {', '.join(supported_formats)}"
        )
    
    try:
        task_id = str(uuid.uuid4())
        input_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
        
        with open(input_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        output_filename = f"{task_id}_audio.{audio_format}"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        result = VideoService.extract_audio(input_path, output_path, audio_format)
        
        if result["success"]:
            return {
                "success": True,
                "message": "تم استخراج الصوت بنجاح",
                "download_url": f"/files/{output_filename}",
                "filename": f"audio.{audio_format}"
            }
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"خطأ في استخراج الصوت: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء استخراج الصوت")

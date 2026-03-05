"""
=== خدمة معالجة الفيديو والصوت ===
توفر وظائف: قص الفيديو، تحويل إلى GIF، استخراج الصوت
تستخدم مكتبة ffmpeg-python
"""

import os
import logging
import subprocess

logger = logging.getLogger(__name__)


class VideoService:
    """خدمة معالجة الفيديو والصوت باستخدام FFmpeg"""
    
    @staticmethod
    def _run_ffmpeg(cmd: list) -> dict:
        """
        تنفيذ أمر FFmpeg
        دالة مساعدة لتشغيل أوامر FFmpeg مع التقاط المخرجات والأخطاء
        """
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300  # حد أقصى 5 دقائق
            )
            
            if result.returncode != 0:
                logger.error(f"خطأ FFmpeg: {result.stderr}")
                return {"success": False, "error": result.stderr}
            
            return {"success": True}
            
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "انتهت مهلة المعالجة (5 دقائق)"}
        except FileNotFoundError:
            return {"success": False, "error": "FFmpeg غير مثبت على النظام"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def cut_video(input_path: str, output_path: str, start_time: str, end_time: str) -> dict:
        """
        قص جزء من الفيديو
        
        المعاملات:
            input_path: مسار الفيديو المصدر
            output_path: مسار الفيديو الناتج
            start_time: وقت البداية (HH:MM:SS)
            end_time: وقت النهاية (HH:MM:SS)
        """
        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            cmd = [
                "ffmpeg", "-y",
                "-i", input_path,
                "-ss", start_time,
                "-to", end_time,
                "-c", "copy",  # نسخ بدون إعادة ترميز (أسرع)
                "-avoid_negative_ts", "make_zero",
                output_path
            ]
            
            result = VideoService._run_ffmpeg(cmd)
            
            if result["success"]:
                logger.info(f"✅ تم قص الفيديو: {start_time} → {end_time}")
                result["output_path"] = output_path
                result["output_size"] = os.path.getsize(output_path)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في قص الفيديو: {str(e)}")
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def video_to_gif(
        input_path: str, output_path: str,
        start_time: str = "00:00:00", duration: int = 5,
        fps: int = 10, width: int = 480
    ) -> dict:
        """
        تحويل فيديو إلى صورة متحركة GIF
        
        المعاملات:
            input_path: مسار الفيديو المصدر
            output_path: مسار ملف GIF الناتج
            start_time: وقت البداية
            duration: المدة بالثواني
            fps: عدد الإطارات في الثانية
            width: عرض الصورة بالبكسل
        """
        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # إنشاء لوحة الألوان أولاً لجودة أفضل
            palette_path = output_path.replace('.gif', '_palette.png')
            
            # الخطوة 1: إنشاء لوحة الألوان
            palette_cmd = [
                "ffmpeg", "-y",
                "-ss", start_time,
                "-t", str(duration),
                "-i", input_path,
                "-vf", f"fps={fps},scale={width}:-1:flags=lanczos,palettegen",
                palette_path
            ]
            
            result = VideoService._run_ffmpeg(palette_cmd)
            if not result["success"]:
                # إذا فشل إنشاء اللوحة، استخدم الطريقة البسيطة
                simple_cmd = [
                    "ffmpeg", "-y",
                    "-ss", start_time,
                    "-t", str(duration),
                    "-i", input_path,
                    "-vf", f"fps={fps},scale={width}:-1:flags=lanczos",
                    output_path
                ]
                result = VideoService._run_ffmpeg(simple_cmd)
            else:
                # الخطوة 2: إنشاء GIF باستخدام اللوحة
                gif_cmd = [
                    "ffmpeg", "-y",
                    "-ss", start_time,
                    "-t", str(duration),
                    "-i", input_path,
                    "-i", palette_path,
                    "-lavfi", f"fps={fps},scale={width}:-1:flags=lanczos[x];[x][1:v]paletteuse",
                    output_path
                ]
                result = VideoService._run_ffmpeg(gif_cmd)
                
                # حذف ملف اللوحة المؤقت
                if os.path.exists(palette_path):
                    os.remove(palette_path)
            
            if result["success"]:
                logger.info("✅ تم التحويل إلى GIF بنجاح")
                result["output_path"] = output_path
                result["output_size"] = os.path.getsize(output_path)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في التحويل إلى GIF: {str(e)}")
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def extract_audio(input_path: str, output_path: str, audio_format: str = "mp3") -> dict:
        """
        استخراج الصوت من ملف فيديو
        
        المعاملات:
            input_path: مسار الفيديو المصدر
            output_path: مسار ملف الصوت الناتج
            audio_format: صيغة الصوت المطلوبة (mp3, wav, aac, ogg)
        """
        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # إعدادات الترميز حسب الصيغة
            codec_map = {
                "mp3": ["libmp3lame", "-q:a", "2"],
                "wav": ["pcm_s16le"],
                "aac": ["aac", "-b:a", "192k"],
                "ogg": ["libvorbis", "-q:a", "5"],
            }
            
            codec_args = codec_map.get(audio_format, ["libmp3lame", "-q:a", "2"])
            
            cmd = [
                "ffmpeg", "-y",
                "-i", input_path,
                "-vn",  # إزالة الفيديو
                "-acodec", codec_args[0],
            ] + codec_args[1:] + [output_path]
            
            result = VideoService._run_ffmpeg(cmd)
            
            if result["success"]:
                logger.info(f"✅ تم استخراج الصوت بصيغة {audio_format}")
                result["output_path"] = output_path
                result["output_size"] = os.path.getsize(output_path)
                result["format"] = audio_format
            
            return result
            
        except Exception as e:
            logger.error(f"❌ خطأ في استخراج الصوت: {str(e)}")
            return {"success": False, "error": str(e)}

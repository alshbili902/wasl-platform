"""
=== خدمة معالجة الصور ===
توفر وظائف: تحويل الصيغ، الضغط، إزالة الخلفية
تستخدم مكتبات: Pillow, rembg
"""

import os
import logging
from PIL import Image

logger = logging.getLogger(__name__)


class ImageService:
    """خدمة معالجة الصور"""
    
    @staticmethod
    def convert_format(input_path: str, output_path: str, target_format: str) -> dict:
        """
        تحويل صورة من صيغة إلى أخرى
        
        المعاملات:
            input_path: مسار الصورة المصدر
            output_path: مسار الصورة الناتجة
            target_format: الصيغة المطلوبة (png, jpg, webp, etc.)
        """
        try:
            img = Image.open(input_path)
            
            # تحويل الوضع إذا لزم الأمر (مثلاً RGBA إلى RGB لصيغة JPEG)
            if target_format.lower() in ['jpg', 'jpeg'] and img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            elif target_format.lower() == 'png' and img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # حفظ بالصيغة المطلوبة
            save_format = target_format.upper()
            if save_format == 'JPG':
                save_format = 'JPEG'
            
            img.save(output_path, format=save_format)
            
            logger.info(f"✅ تم تحويل الصورة إلى {target_format}")
            
            return {
                "success": True,
                "output_path": output_path,
                "original_format": img.format or "unknown",
                "target_format": target_format,
                "dimensions": f"{img.width}x{img.height}"
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في تحويل الصورة: {str(e)}")
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def compress_image(input_path: str, output_path: str, quality: int = 70) -> dict:
        """
        ضغط صورة لتقليل حجمها
        
        المعاملات:
            input_path: مسار الصورة المصدر
            output_path: مسار الصورة المضغوطة
            quality: جودة الضغط (1-100)
        """
        try:
            original_size = os.path.getsize(input_path)
            img = Image.open(input_path)
            
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # تحديد صيغة الحفظ
            ext = output_path.rsplit('.', 1)[-1].lower()
            save_format = ext.upper()
            if save_format == 'JPG':
                save_format = 'JPEG'
            
            # تحويل الوضع إذا لزم الأمر
            if save_format == 'JPEG' and img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # حفظ مع تحسين الجودة
            save_kwargs = {
                'format': save_format,
                'optimize': True,
            }
            
            if save_format in ['JPEG', 'WEBP']:
                save_kwargs['quality'] = quality
            elif save_format == 'PNG':
                save_kwargs['compress_level'] = max(1, min(9, (100 - quality) // 10))
            
            img.save(output_path, **save_kwargs)
            
            compressed_size = os.path.getsize(output_path)
            reduction = round((1 - compressed_size / original_size) * 100, 1) if original_size > 0 else 0
            
            logger.info(f"✅ تم ضغط الصورة: {reduction}% توفير")
            
            return {
                "success": True,
                "output_path": output_path,
                "original_size": original_size,
                "compressed_size": compressed_size,
                "reduction": f"{reduction}%",
                "quality": quality
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في ضغط الصورة: {str(e)}")
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def remove_background(input_path: str, output_path: str) -> dict:
        """
        إزالة خلفية الصورة باستخدام الذكاء الاصطناعي
        تستخدم مكتبة rembg المبنية على نموذج U2-Net
        """
        try:
            from rembg import remove
            
            # قراءة الصورة
            with open(input_path, "rb") as f:
                input_data = f.read()
            
            # إزالة الخلفية
            output_data = remove(input_data)
            
            # حفظ النتيجة
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, "wb") as f:
                f.write(output_data)
            
            logger.info("✅ تم إزالة خلفية الصورة بنجاح")
            
            return {
                "success": True,
                "output_path": output_path,
                "original_size": os.path.getsize(input_path),
                "output_size": os.path.getsize(output_path)
            }
            
        except ImportError:
            logger.warning("⚠️ مكتبة rembg غير مثبتة، يتم استخدام البديل")
            # بديل بسيط: تحويل إلى شفاف (للتطوير فقط)
            try:
                img = Image.open(input_path).convert("RGBA")
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                img.save(output_path, "PNG")
                return {
                    "success": True,
                    "output_path": output_path,
                    "note": "تم التحويل بدون إزالة الخلفية (مكتبة rembg غير متاحة)"
                }
            except Exception as e:
                return {"success": False, "error": str(e)}
                
        except Exception as e:
            logger.error(f"❌ خطأ في إزالة الخلفية: {str(e)}")
            return {"success": False, "error": str(e)}

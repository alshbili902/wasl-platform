"""
=== خدمة معالجة ملفات PDF ===
توفر وظائف: الدمج، التقسيم، الضغط
تستخدم مكتبة PyPDF2
"""

import os
import logging
from PyPDF2 import PdfMerger, PdfReader, PdfWriter

logger = logging.getLogger(__name__)


class PDFService:
    """خدمة معالجة ملفات PDF"""
    
    @staticmethod
    def merge_pdfs(file_paths: list, output_path: str) -> dict:
        """
        دمج ملفات PDF متعددة في ملف واحد
        
        المعاملات:
            file_paths: قائمة مسارات ملفات PDF المراد دمجها
            output_path: مسار الملف الناتج
        
        يُرجع:
            قاموس يحتوي على حالة العملية ومعلومات إضافية
        """
        try:
            merger = PdfMerger()
            
            for path in file_paths:
                if not os.path.exists(path):
                    return {"success": False, "error": f"الملف غير موجود: {path}"}
                merger.append(path)
            
            # حفظ الملف المدمج
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            merger.write(output_path)
            merger.close()
            
            logger.info(f"✅ تم دمج {len(file_paths)} ملفات PDF بنجاح")
            
            return {
                "success": True,
                "output_path": output_path,
                "files_merged": len(file_paths),
                "output_size": os.path.getsize(output_path)
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في دمج PDF: {str(e)}")
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def split_pdf(input_path: str, output_path: str, start_page: int = 1, end_page: int = None) -> dict:
        """
        تقسيم ملف PDF - استخراج صفحات محددة
        
        المعاملات:
            input_path: مسار ملف PDF المصدر
            output_path: مسار الملف الناتج
            start_page: رقم الصفحة الأولى (يبدأ من 1)
            end_page: رقم الصفحة الأخيرة (اختياري)
        """
        try:
            reader = PdfReader(input_path)
            total_pages = len(reader.pages)
            
            # تحويل أرقام الصفحات (من 1 إلى 0)
            start_idx = max(0, start_page - 1)
            end_idx = min(total_pages, end_page) if end_page else total_pages
            
            if start_idx >= total_pages:
                return {"success": False, "error": "رقم صفحة البداية أكبر من عدد الصفحات"}
            
            writer = PdfWriter()
            
            for i in range(start_idx, end_idx):
                writer.add_page(reader.pages[i])
            
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, "wb") as f:
                writer.write(f)
            
            pages_extracted = end_idx - start_idx
            logger.info(f"✅ تم استخراج {pages_extracted} صفحات من PDF")
            
            return {
                "success": True,
                "output_path": output_path,
                "total_pages": total_pages,
                "pages_extracted": pages_extracted,
                "output_size": os.path.getsize(output_path)
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في تقسيم PDF: {str(e)}")
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def compress_pdf(input_path: str, output_path: str) -> dict:
        """
        ضغط ملف PDF لتقليل حجمه
        يحذف البيانات الوصفية الزائدة ويُعيد كتابة الملف
        """
        try:
            original_size = os.path.getsize(input_path)
            
            reader = PdfReader(input_path)
            writer = PdfWriter()
            
            for page in reader.pages:
                # ضغط محتوى الصفحة
                page.compress_content_streams()
                writer.add_page(page)
            
            # إزالة البيانات الوصفية الزائدة
            writer.add_metadata({
                "/Producer": "وصل - منصة الأدوات الشاملة",
            })
            
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, "wb") as f:
                writer.write(f)
            
            compressed_size = os.path.getsize(output_path)
            reduction = round((1 - compressed_size / original_size) * 100, 1) if original_size > 0 else 0
            
            logger.info(f"✅ تم ضغط PDF: {reduction}% توفير")
            
            return {
                "success": True,
                "output_path": output_path,
                "original_size": original_size,
                "compressed_size": compressed_size,
                "reduction": f"{reduction}%"
            }
            
        except Exception as e:
            logger.error(f"❌ خطأ في ضغط PDF: {str(e)}")
            return {"success": False, "error": str(e)}

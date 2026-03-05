"""
=== خدمة معالجة النصوص والأكواد ===
توفر وظائف: تحويل JSON، عد الكلمات، تنسيق الأكواد، فحص الانتحال
"""

import json
import re
import logging
from collections import Counter
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)


class TextService:
    """خدمة معالجة النصوص والأكواد البرمجية"""
    
    @staticmethod
    def convert_json(data: str, from_format: str = "json", to_format: str = "yaml") -> dict:
        """
        تحويل بين صيغ البيانات المختلفة
        يدعم: JSON ↔ YAML, JSON ↔ XML, JSON ↔ CSV
        
        المعاملات:
            data: البيانات المصدر كنص
            from_format: الصيغة المصدر
            to_format: الصيغة الهدف
        """
        try:
            # تحليل البيانات المصدر
            parsed_data = None
            
            if from_format.lower() == "json":
                parsed_data = json.loads(data)
            elif from_format.lower() == "yaml":
                # تحويل YAML إلى Python dict
                try:
                    import yaml
                    parsed_data = yaml.safe_load(data)
                except ImportError:
                    # تحليل YAML بسيط بدون مكتبة خارجية
                    parsed_data = TextService._simple_yaml_parse(data)
            elif from_format.lower() == "csv":
                parsed_data = TextService._csv_to_dict(data)
            else:
                return {"success": False, "error": f"الصيغة المصدر '{from_format}' غير مدعومة"}
            
            if parsed_data is None:
                return {"success": False, "error": "فشل في تحليل البيانات المصدر"}
            
            # تحويل إلى الصيغة الهدف
            if to_format.lower() == "json":
                result = json.dumps(parsed_data, ensure_ascii=False, indent=2)
            elif to_format.lower() == "yaml":
                try:
                    import yaml
                    result = yaml.dump(parsed_data, allow_unicode=True, default_flow_style=False)
                except ImportError:
                    result = TextService._dict_to_yaml(parsed_data)
            elif to_format.lower() == "xml":
                result = TextService._dict_to_xml(parsed_data)
            elif to_format.lower() == "csv":
                result = TextService._dict_to_csv(parsed_data)
            else:
                return {"success": False, "error": f"الصيغة الهدف '{to_format}' غير مدعومة"}
            
            return {"success": True, "data": result}
            
        except json.JSONDecodeError as e:
            return {"success": False, "error": f"خطأ في تحليل JSON: {str(e)}"}
        except Exception as e:
            logger.error(f"خطأ في التحويل: {str(e)}")
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def count_words(text: str) -> dict:
        """
        تحليل شامل للنص يشمل:
        - عدد الكلمات
        - عدد الأحرف (مع وبدون مسافات)
        - عدد الجمل
        - عدد الفقرات
        - عدد الكلمات العربية والإنجليزية
        - الكلمات الأكثر تكراراً
        - وقت القراءة المقدّر
        """
        if not text or not text.strip():
            return {
                "words": 0,
                "characters": 0,
                "characters_no_spaces": 0,
                "sentences": 0,
                "paragraphs": 0,
                "arabic_words": 0,
                "english_words": 0,
                "reading_time_minutes": 0,
                "most_common_words": []
            }
        
        # عد الأحرف
        characters = len(text)
        characters_no_spaces = len(text.replace(" ", "").replace("\n", "").replace("\t", ""))
        
        # عد الكلمات
        words = text.split()
        word_count = len(words)
        
        # عد الجمل (بالعربية والإنجليزية)
        sentences = len(re.split(r'[.!?؟!。]+', text.strip()))
        if sentences > 0 and not re.search(r'[.!?؟!。]$', text.strip()):
            sentences = max(1, sentences)
        
        # عد الفقرات
        paragraphs = len([p for p in text.split('\n') if p.strip()])
        
        # تصنيف الكلمات (عربية / إنجليزية)
        arabic_pattern = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+')
        english_pattern = re.compile(r'[a-zA-Z]+')
        
        arabic_words = sum(1 for w in words if arabic_pattern.search(w))
        english_words = sum(1 for w in words if english_pattern.search(w))
        
        # الكلمات الأكثر تكراراً (مع تجاهل الكلمات القصيرة)
        meaningful_words = [w.strip('.,!?؟!;:()[]{}') for w in words if len(w) > 2]
        word_freq = Counter(meaningful_words)
        most_common = [{"word": w, "count": c} for w, c in word_freq.most_common(10)]
        
        # وقت القراءة (متوسط 200 كلمة بالدقيقة للعربية)
        reading_time = round(word_count / 200, 1)
        
        return {
            "words": word_count,
            "characters": characters,
            "characters_no_spaces": characters_no_spaces,
            "sentences": sentences,
            "paragraphs": paragraphs,
            "arabic_words": arabic_words,
            "english_words": english_words,
            "reading_time_minutes": reading_time,
            "most_common_words": most_common
        }
    
    @staticmethod
    def format_code(code: str, language: str = "json") -> dict:
        """
        تنسيق الأكواد البرمجية
        يدعم: JSON, HTML, CSS, JavaScript, Python
        """
        try:
            language = language.lower().strip()
            
            if language == "json":
                # تنسيق JSON
                parsed = json.loads(code)
                formatted = json.dumps(parsed, ensure_ascii=False, indent=2)
                return {"success": True, "formatted": formatted}
            
            elif language in ["html", "xml"]:
                # تنسيق HTML بسيط
                formatted = TextService._format_html(code)
                return {"success": True, "formatted": formatted}
            
            elif language == "css":
                # تنسيق CSS بسيط
                formatted = TextService._format_css(code)
                return {"success": True, "formatted": formatted}
            
            elif language in ["javascript", "js"]:
                # تنسيق JavaScript بسيط
                formatted = TextService._format_js(code)
                return {"success": True, "formatted": formatted}
            
            elif language == "python":
                # تنسيق Python بسيط
                formatted = TextService._format_python(code)
                return {"success": True, "formatted": formatted}
            
            else:
                return {"success": False, "error": f"اللغة '{language}' غير مدعومة حالياً"}
                
        except json.JSONDecodeError as e:
            return {"success": False, "error": f"خطأ في تحليل JSON: {str(e)}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def check_plagiarism(text1: str, text2: str) -> dict:
        """
        فحص التشابه بين نصين
        يستخدم خوارزمية SequenceMatcher لحساب نسبة التشابه
        
        يُرجع:
            - نسبة التشابه الكلية
            - الجمل المتطابقة
            - الكلمات المشتركة
        """
        if not text1.strip() or not text2.strip():
            return {
                "similarity_percentage": 0,
                "matching_sentences": [],
                "common_words": [],
                "verdict": "لا يمكن المقارنة - أحد النصوص فارغ"
            }
        
        # حساب التشابه الكلي
        similarity = SequenceMatcher(None, text1.lower(), text2.lower()).ratio()
        similarity_percentage = round(similarity * 100, 1)
        
        # تقسيم النصوص إلى جمل
        sentences1 = [s.strip() for s in re.split(r'[.!?؟!。\n]+', text1) if s.strip()]
        sentences2 = [s.strip() for s in re.split(r'[.!?؟!。\n]+', text2) if s.strip()]
        
        # البحث عن الجمل المتطابقة
        matching_sentences = []
        for s1 in sentences1:
            for s2 in sentences2:
                s_ratio = SequenceMatcher(None, s1.lower(), s2.lower()).ratio()
                if s_ratio > 0.7:  # تشابه أكثر من 70%
                    matching_sentences.append({
                        "text1_sentence": s1,
                        "text2_sentence": s2,
                        "similarity": round(s_ratio * 100, 1)
                    })
        
        # الكلمات المشتركة
        words1 = set(w.lower().strip('.,!?؟!;:') for w in text1.split() if len(w) > 2)
        words2 = set(w.lower().strip('.,!?؟!;:') for w in text2.split() if len(w) > 2)
        common_words = list(words1 & words2)[:20]  # أول 20 كلمة مشتركة
        
        # الحكم
        if similarity_percentage >= 80:
            verdict = "🔴 نسبة تشابه عالية جداً - احتمال انتحال كبير"
        elif similarity_percentage >= 50:
            verdict = "🟡 نسبة تشابه متوسطة - يُنصح بالمراجعة"
        elif similarity_percentage >= 25:
            verdict = "🟢 نسبة تشابه منخفضة - مقبول"
        else:
            verdict = "✅ نسبة تشابه ضئيلة - النصوص مختلفة"
        
        return {
            "similarity_percentage": similarity_percentage,
            "matching_sentences": matching_sentences[:10],  # أول 10 جمل متطابقة
            "common_words": common_words,
            "common_words_count": len(words1 & words2),
            "verdict": verdict
        }
    
    # === دوال مساعدة خاصة ===
    
    @staticmethod
    def _simple_yaml_parse(yaml_str: str) -> dict:
        """تحليل YAML بسيط بدون مكتبة خارجية"""
        result = {}
        for line in yaml_str.strip().split('\n'):
            line = line.strip()
            if ':' in line and not line.startswith('#'):
                key, value = line.split(':', 1)
                result[key.strip()] = value.strip().strip('"').strip("'")
        return result
    
    @staticmethod
    def _dict_to_yaml(data, indent=0) -> str:
        """تحويل قاموس Python إلى YAML"""
        result = ""
        prefix = "  " * indent
        
        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, (dict, list)):
                    result += f"{prefix}{key}:\n"
                    result += TextService._dict_to_yaml(value, indent + 1)
                else:
                    result += f"{prefix}{key}: {value}\n"
        elif isinstance(data, list):
            for item in data:
                if isinstance(item, (dict, list)):
                    result += f"{prefix}-\n"
                    result += TextService._dict_to_yaml(item, indent + 1)
                else:
                    result += f"{prefix}- {item}\n"
        
        return result
    
    @staticmethod
    def _dict_to_xml(data, root_tag="root", indent=0) -> str:
        """تحويل قاموس Python إلى XML"""
        prefix = "  " * indent
        
        if indent == 0:
            result = '<?xml version="1.0" encoding="UTF-8"?>\n'
            result += f"<{root_tag}>\n"
            result += TextService._dict_to_xml(data, root_tag, indent + 1)
            result += f"</{root_tag}>"
            return result
        
        result = ""
        if isinstance(data, dict):
            for key, value in data.items():
                # تنظيف اسم الوسم
                tag = re.sub(r'[^\w]', '_', str(key))
                if isinstance(value, (dict, list)):
                    result += f"{prefix}<{tag}>\n"
                    result += TextService._dict_to_xml(value, tag, indent + 1)
                    result += f"{prefix}</{tag}>\n"
                else:
                    result += f"{prefix}<{tag}>{value}</{tag}>\n"
        elif isinstance(data, list):
            for item in data:
                if isinstance(item, (dict, list)):
                    result += f"{prefix}<item>\n"
                    result += TextService._dict_to_xml(item, "item", indent + 1)
                    result += f"{prefix}</item>\n"
                else:
                    result += f"{prefix}<item>{item}</item>\n"
        
        return result
    
    @staticmethod
    def _csv_to_dict(csv_str: str) -> list:
        """تحويل CSV إلى قائمة قواميس"""
        lines = csv_str.strip().split('\n')
        if len(lines) < 2:
            return []
        
        headers = [h.strip().strip('"') for h in lines[0].split(',')]
        result = []
        
        for line in lines[1:]:
            values = [v.strip().strip('"') for v in line.split(',')]
            row = dict(zip(headers, values))
            result.append(row)
        
        return result
    
    @staticmethod
    def _dict_to_csv(data) -> str:
        """تحويل قائمة قواميس إلى CSV"""
        if isinstance(data, dict):
            data = [data]
        
        if not isinstance(data, list) or not data:
            return ""
        
        if isinstance(data[0], dict):
            headers = list(data[0].keys())
            lines = [','.join(f'"{h}"' for h in headers)]
            
            for row in data:
                values = [f'"{row.get(h, "")}"' for h in headers]
                lines.append(','.join(values))
            
            return '\n'.join(lines)
        
        return str(data)
    
    @staticmethod
    def _format_html(html: str) -> str:
        """تنسيق HTML بشكل بسيط"""
        # إضافة أسطر جديدة بعد الوسوم
        formatted = re.sub(r'>\s*<', '>\n<', html)
        
        # إضافة مسافات بادئة
        indent = 0
        lines = formatted.split('\n')
        result = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # تقليل المسافة البادئة لوسوم الإغلاق
            if line.startswith('</'):
                indent = max(0, indent - 1)
            
            result.append('  ' * indent + line)
            
            # زيادة المسافة البادئة لوسوم الفتح (غير المغلقة ذاتياً)
            if re.match(r'<[^/!][^>]*[^/]>', line) and not re.search(r'</\w+>', line):
                indent += 1
        
        return '\n'.join(result)
    
    @staticmethod
    def _format_css(css: str) -> str:
        """تنسيق CSS بشكل بسيط"""
        # إضافة أسطر جديدة
        formatted = css.replace('{', ' {\n  ')
        formatted = formatted.replace('}', '\n}\n')
        formatted = formatted.replace(';', ';\n  ')
        
        # تنظيف المسافات الزائدة
        lines = [line.rstrip() for line in formatted.split('\n')]
        return '\n'.join(lines)
    
    @staticmethod
    def _format_js(js: str) -> str:
        """تنسيق JavaScript بشكل بسيط"""
        formatted = js.replace('{', ' {\n')
        formatted = formatted.replace('}', '\n}\n')
        formatted = formatted.replace(';', ';\n')
        
        # إضافة مسافات بادئة
        indent = 0
        lines = formatted.split('\n')
        result = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if line.startswith('}'):
                indent = max(0, indent - 1)
            result.append('  ' * indent + line)
            if line.endswith('{'):
                indent += 1
        
        return '\n'.join(result)
    
    @staticmethod
    def _format_python(code: str) -> str:
        """تنسيق Python بسيط - إزالة المسافات الزائدة"""
        lines = code.split('\n')
        result = []
        
        for line in lines:
            # الحفاظ على المسافات البادئة الأصلية
            stripped = line.rstrip()
            result.append(stripped)
        
        return '\n'.join(result)

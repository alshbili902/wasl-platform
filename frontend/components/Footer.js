// === مكوّن التذييل (Footer) ===
// يحتوي على معلومات الموقع وروابط سريعة

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* === العمود الأول: معلومات الموقع === */}
                    <div className="footer-brand">
                        <Link href="/" className="logo">
                            <div className="logo-icon">و</div>
                            <span className="logo-text">وصل</span>
                        </Link>
                        <p>
                            منصة عربية شاملة لمعالجة الملفات عبر الإنترنت.
                            أدوات مجانية وسهلة الاستخدام بدون تثبيت أي برامج.
                            خصوصيتك مضمونة - جميع الملفات تُحذف تلقائياً.
                        </p>
                    </div>

                    {/* === أدوات PDF === */}
                    <div className="footer-col">
                        <h4>أدوات PDF</h4>
                        <ul>
                            <li><Link href="/pdf/merge">دمج PDF</Link></li>
                            <li><Link href="/pdf/split">تقسيم PDF</Link></li>
                            <li><Link href="/pdf/compress">ضغط PDF</Link></li>
                        </ul>
                    </div>

                    {/* === أدوات الصور === */}
                    <div className="footer-col">
                        <h4>أدوات الصور</h4>
                        <ul>
                            <li><Link href="/image/convert">تحويل الصيغة</Link></li>
                            <li><Link href="/image/compress">ضغط الصور</Link></li>
                            <li><Link href="/image/remove-background">إزالة الخلفية</Link></li>
                        </ul>
                    </div>

                    {/* === أدوات أخرى === */}
                    <div className="footer-col">
                        <h4>أدوات أخرى</h4>
                        <ul>
                            <li><Link href="/video/cut">قص الفيديو</Link></li>
                            <li><Link href="/text/json-converter">محول JSON</Link></li>
                            <li><Link href="/text/word-counter">عداد الكلمات</Link></li>
                        </ul>
                    </div>
                </div>

                {/* === الشريط السفلي === */}
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} وصل. جميع الحقوق محفوظة. صُنع بـ ❤️ للمستخدم العربي.</p>
                </div>
            </div>
        </footer>
    );
}

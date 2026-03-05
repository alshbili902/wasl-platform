// === مكوّن عرض النتيجة ===
// يُستخدم لعرض نتيجة المعالجة (نجاح/فشل) مع زر التحميل

'use client';

export default function ResultDisplay({ result, onReset }) {
    if (!result) return null;

    return (
        <div className={`result-card ${result.success ? 'success' : 'error'} animate-fadeInUp`}>
            {/* أيقونة الحالة */}
            <div className="result-icon">
                {result.success ? '✅' : '❌'}
            </div>

            {/* العنوان */}
            <h3 className="result-title">
                {result.success ? 'تمت العملية بنجاح!' : 'حدث خطأ'}
            </h3>

            {/* الرسالة */}
            <p className="result-message">
                {result.message || (result.success ? 'تم معالجة ملفك بنجاح' : 'حدث خطأ أثناء المعالجة')}
            </p>

            {/* إحصائيات (إن وجدت) */}
            {result.stats && (
                <div className="result-stats">
                    {result.stats.map((stat, index) => (
                        <div key={index} className="result-stat">
                            <div className="result-stat-value">{stat.value}</div>
                            <div className="result-stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* أزرار */}
            <div>
                {result.success && result.downloadUrl && (
                    <a
                        href={result.downloadUrl}
                        download={result.filename || 'download'}
                        className="btn-primary btn-download"
                        style={{ textDecoration: 'none', display: 'inline-flex' }}
                    >
                        ⬇️ تحميل الملف
                    </a>
                )}

                <button className="btn-secondary" onClick={onReset}>
                    🔄 معالجة ملف آخر
                </button>
            </div>
        </div>
    );
}

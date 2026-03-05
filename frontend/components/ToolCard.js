// === مكوّن بطاقة الأداة ===
// يُعرض في شبكة الأدوات على الصفحة الرئيسية

import Link from 'next/link';

export default function ToolCard({ tool }) {
    return (
        <Link href={tool.href} className="tool-card">
            {/* أيقونة الأداة */}
            <div className={`tool-card-icon ${tool.category}`}>
                {tool.icon}
            </div>

            {/* عنوان الأداة */}
            <h3 className="tool-card-title">{tool.title}</h3>

            {/* وصف الأداة */}
            <p className="tool-card-desc">{tool.description}</p>

            {/* رابط الاستخدام */}
            <div className="tool-card-arrow">
                استخدم الأداة ←
            </div>
        </Link>
    );
}

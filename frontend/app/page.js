// === الصفحة الرئيسية ===
// تعرض جميع الأدوات المتاحة مع فلترة حسب الفئة

'use client';

import { useState } from 'react';
import ToolCard from '../components/ToolCard';
import AdSlot from '../components/AdSlot';
import { tools, toolCategories } from '../lib/tools';

export default function HomePage() {
    // الفئة المحددة حالياً
    const [activeCategory, setActiveCategory] = useState('all');

    // فلترة الأدوات حسب الفئة
    const filteredTools = activeCategory === 'all'
        ? tools
        : tools.filter(tool => tool.category === activeCategory);

    return (
        <>
            {/* === قسم البطل (Hero) === */}
            <section className="hero">
                <div className="container">
                    <div className="hero-badge animate-fadeInUp">
                        ✨ منصة عربية مجانية 100%
                    </div>

                    <h1 className="animate-fadeInUp delay-1">
                        كل أدوات الملفات في <span>مكان واحد</span>
                    </h1>

                    <p className="hero-subtitle animate-fadeInUp delay-2">
                        منصة وصل تقدم لك أدوات احترافية لمعالجة ملفات PDF والصور والفيديو والنصوص
                        مباشرة من المتصفح — بدون تثبيت أي برامج وبخصوصية تامة
                    </p>

                    {/* إحصائيات */}
                    <div className="hero-stats animate-fadeInUp delay-3">
                        <div className="hero-stat">
                            <div className="hero-stat-number">+13</div>
                            <div className="hero-stat-label">أداة متاحة</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">100%</div>
                            <div className="hero-stat-label">مجاني</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">🔒</div>
                            <div className="hero-stat-label">خصوصية تامة</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">⚡</div>
                            <div className="hero-stat-label">سرعة عالية</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === مساحة إعلانية === */}
            <div className="container">
                <AdSlot position="hero-bottom" />
            </div>

            {/* === قسم الأدوات === */}
            <section className="tools-section" id="tools">
                <div className="container">
                    {/* عنوان القسم */}
                    <div className="section-header">
                        <h2>🛠️ أدواتنا المميزة</h2>
                        <p>اختر الأداة التي تحتاجها وابدأ المعالجة فوراً</p>
                    </div>

                    {/* فلاتر الفئات */}
                    <div className="category-tabs">
                        {toolCategories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* شبكة الأدوات */}
                    <div className="tools-grid">
                        {filteredTools.map((tool, index) => (
                            <div key={tool.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                                <ToolCard tool={tool} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === قسم المميزات === */}
            <section className="tools-section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="section-header">
                        <h2>🌟 لماذا وصل؟</h2>
                        <p>مميزات تجعل تجربتك أسهل وأفضل</p>
                    </div>

                    <div className="tools-grid">
                        <div className="tool-card" style={{ cursor: 'default' }}>
                            <div className="tool-card-icon" style={{ background: 'rgba(108, 92, 231, 0.15)', color: '#6C5CE7' }}>
                                🔒
                            </div>
                            <h3 className="tool-card-title">خصوصية مطلقة</h3>
                            <p className="tool-card-desc">
                                جميع الملفات تُحذف تلقائياً بعد 30 دقيقة. لا نحتفظ بأي بيانات.
                            </p>
                        </div>

                        <div className="tool-card" style={{ cursor: 'default' }}>
                            <div className="tool-card-icon" style={{ background: 'rgba(0, 206, 201, 0.15)', color: '#00CEC9' }}>
                                ⚡
                            </div>
                            <h3 className="tool-card-title">سرعة فائقة</h3>
                            <p className="tool-card-desc">
                                معالجة فورية باستخدام خوادم عالية الأداء وطابور مهام ذكي.
                            </p>
                        </div>

                        <div className="tool-card" style={{ cursor: 'default' }}>
                            <div className="tool-card-icon" style={{ background: 'rgba(253, 121, 168, 0.15)', color: '#FD79A8' }}>
                                📱
                            </div>
                            <h3 className="tool-card-title">يعمل من أي جهاز</h3>
                            <p className="tool-card-desc">
                                تصميم متجاوب يعمل بكفاءة على الكمبيوتر والجوال والتابلت.
                            </p>
                        </div>

                        <div className="tool-card" style={{ cursor: 'default' }}>
                            <div className="tool-card-icon" style={{ background: 'rgba(253, 203, 110, 0.15)', color: '#FDCB6E' }}>
                                🆓
                            </div>
                            <h3 className="tool-card-title">مجاني بالكامل</h3>
                            <p className="tool-card-desc">
                                جميع الأدوات متاحة مجاناً بدون قيود. بدون تسجيل دخول.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* === مساحة إعلانية === */}
            <div className="container">
                <AdSlot position="footer-top" />
            </div>
        </>
    );
}

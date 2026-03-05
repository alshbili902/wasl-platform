// === صفحة فاحص الانتحال ===
// /text/plagiarism-check

'use client';

import { useState } from 'react';
import AdSlot from '../../../components/AdSlot';
import Link from 'next/link';

export default function PlagiarismCheckPage() {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCheck = async () => {
        if (!text1.trim() || !text2.trim()) {
            setError('يجب إدخال كلا النصين');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            // فحص محلي في المتصفح (بدون حاجة للخادم)
            const localResult = localPlagiarismCheck(text1, text2);
            setResult(localResult);
        } catch (err) {
            setError('حدث خطأ أثناء الفحص');
        } finally {
            setLoading(false);
        }
    };

    // فحص محلي كبديل (في حال عدم اتصال الخادم)
    const localPlagiarismCheck = (t1, t2) => {
        const words1 = new Set(t1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
        const words2 = new Set(t2.toLowerCase().split(/\s+/).filter(w => w.length > 2));
        const common = [...words1].filter(w => words2.has(w));
        const total = new Set([...words1, ...words2]).size;
        const similarity = total > 0 ? Math.round((common.length / total) * 100) : 0;

        let verdict;
        if (similarity >= 80) verdict = '🔴 نسبة تشابه عالية جداً';
        else if (similarity >= 50) verdict = '🟡 نسبة تشابه متوسطة';
        else if (similarity >= 25) verdict = '🟢 نسبة تشابه منخفضة';
        else verdict = '✅ النصوص مختلفة';

        return {
            similarity_percentage: similarity,
            common_words: common.slice(0, 20),
            common_words_count: common.length,
            verdict,
            matching_sentences: [],
        };
    };

    // لون شريط النسبة
    const getBarColor = (pct) => {
        if (pct >= 80) return '#E74C3C';
        if (pct >= 50) return '#F39C12';
        if (pct >= 25) return '#00B894';
        return '#00CEC9';
    };

    return (
        <div className="tool-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link href="/">الرئيسية</Link>
                    <span>/</span>
                    <span>فاحص الانتحال</span>
                </div>

                <div className="tool-page-header">
                    <h1>🔍 فاحص الانتحال والتشابه</h1>
                    <p>قارن بين نصين واكتشف نسبة التشابه والكلمات المشتركة</p>
                </div>

                <AdSlot position="tool-top" />

                {/* حقول النصوص */}
                <div className="text-area-container">
                    <label>النص الأول:</label>
                    <textarea
                        className="text-area"
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                        placeholder="أدخل النص الأول هنا..."
                        style={{ minHeight: '150px' }}
                    />
                </div>

                <div className="text-area-container">
                    <label>النص الثاني:</label>
                    <textarea
                        className="text-area"
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                        placeholder="أدخل النص الثاني هنا..."
                        style={{ minHeight: '150px' }}
                    />
                </div>

                <button className="btn-primary" onClick={handleCheck} disabled={loading}>
                    {loading ? 'جاري الفحص...' : '🔍 فحص التشابه'}
                </button>

                {error && (
                    <div className="result-card error" style={{ marginTop: 20 }}>
                        <p>❌ {error}</p>
                    </div>
                )}

                {/* عرض النتائج */}
                {result && (
                    <div className="animate-fadeInUp" style={{ marginTop: 32 }}>
                        <div className="result-card success">
                            {/* نسبة التشابه */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{
                                    fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-heading)',
                                    color: getBarColor(result.similarity_percentage)
                                }}>
                                    {result.similarity_percentage}%
                                </div>
                                <div style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>نسبة التشابه</div>

                                {/* شريط التقدم */}
                                <div style={{
                                    width: '100%', height: '12px', background: 'rgba(255,255,255,0.08)',
                                    borderRadius: '6px', overflow: 'hidden', maxWidth: '400px', margin: '0 auto'
                                }}>
                                    <div style={{
                                        width: `${result.similarity_percentage}%`, height: '100%',
                                        background: getBarColor(result.similarity_percentage),
                                        borderRadius: '6px', transition: 'width 1s ease'
                                    }} />
                                </div>
                            </div>

                            {/* الحكم */}
                            <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 20 }}>
                                {result.verdict}
                            </div>

                            {/* إحصائيات */}
                            <div className="result-stats">
                                <div className="result-stat">
                                    <div className="result-stat-value">{result.common_words_count || 0}</div>
                                    <div className="result-stat-label">كلمة مشتركة</div>
                                </div>
                                <div className="result-stat">
                                    <div className="result-stat-value">{result.matching_sentences?.length || 0}</div>
                                    <div className="result-stat-label">جملة متطابقة</div>
                                </div>
                            </div>

                            {/* الكلمات المشتركة */}
                            {result.common_words?.length > 0 && (
                                <div style={{ marginTop: 20 }}>
                                    <h4 style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>الكلمات المشتركة:</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                                        {result.common_words.map((word, i) => (
                                            <span key={i} style={{
                                                padding: '4px 12px', background: 'rgba(108, 92, 231, 0.15)',
                                                borderRadius: '20px', fontSize: '0.85rem', color: 'var(--primary-light)'
                                            }}>
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="btn-secondary" onClick={() => { setText1(''); setText2(''); setResult(null); }}>
                            🔄 فحص نصوص جديدة
                        </button>
                    </div>
                )}

                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

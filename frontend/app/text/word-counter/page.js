// === صفحة عداد الكلمات ===
// /text/word-counter
// يعمل بالكامل في المتصفح (بدون إرسال للخادم)

'use client';

import { useState, useMemo } from 'react';
import AdSlot from '../../../components/AdSlot';
import Link from 'next/link';

export default function WordCounterPage() {
    const [text, setText] = useState('');

    // حساب الإحصائيات في الوقت الفعلي
    const stats = useMemo(() => {
        if (!text.trim()) {
            return {
                words: 0, characters: 0, charactersNoSpaces: 0,
                sentences: 0, paragraphs: 0, readingTime: 0,
                arabicWords: 0, englishWords: 0
            };
        }

        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const sentences = text.split(/[.!?؟!。]+/).filter(s => s.trim()).length;
        const paragraphs = text.split('\n').filter(p => p.trim()).length;
        const readingTime = Math.ceil(wordCount / 200);

        // كلمات عربية وإنجليزية
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/;
        const englishPattern = /[a-zA-Z]+/;
        const arabicWords = words.filter(w => arabicPattern.test(w)).length;
        const englishWords = words.filter(w => englishPattern.test(w)).length;

        return {
            words: wordCount, characters, charactersNoSpaces,
            sentences, paragraphs, readingTime,
            arabicWords, englishWords
        };
    }, [text]);

    return (
        <div className="tool-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link href="/">الرئيسية</Link>
                    <span>/</span>
                    <span>عداد الكلمات</span>
                </div>

                <div className="tool-page-header">
                    <h1>🔢 عداد الكلمات والأحرف</h1>
                    <p>تحليل شامل للنص في الوقت الفعلي - يدعم العربية والإنجليزية</p>
                </div>

                <AdSlot position="tool-top" />

                {/* حقل النص */}
                <div className="text-area-container">
                    <label>أدخل النص هنا:</label>
                    <textarea
                        className="text-area"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="اكتب أو الصق النص هنا لتحليله..."
                        style={{ minHeight: '250px' }}
                    />
                </div>

                {/* شبكة الإحصائيات */}
                <div className="word-stats-grid">
                    <div className="word-stat-card">
                        <div className="word-stat-value">{stats.words}</div>
                        <div className="word-stat-label">كلمة</div>
                    </div>
                    <div className="word-stat-card">
                        <div className="word-stat-value">{stats.characters}</div>
                        <div className="word-stat-label">حرف</div>
                    </div>
                    <div className="word-stat-card">
                        <div className="word-stat-value">{stats.charactersNoSpaces}</div>
                        <div className="word-stat-label">حرف (بدون مسافات)</div>
                    </div>
                    <div className="word-stat-card">
                        <div className="word-stat-value">{stats.sentences}</div>
                        <div className="word-stat-label">جملة</div>
                    </div>
                    <div className="word-stat-card">
                        <div className="word-stat-value">{stats.paragraphs}</div>
                        <div className="word-stat-label">فقرة</div>
                    </div>
                    <div className="word-stat-card">
                        <div className="word-stat-value">{stats.readingTime}</div>
                        <div className="word-stat-label">دقيقة قراءة</div>
                    </div>
                    <div className="word-stat-card">
                        <div className="word-stat-value">{stats.arabicWords}</div>
                        <div className="word-stat-label">كلمة عربية</div>
                    </div>
                    <div className="word-stat-card">
                        <div className="word-stat-value">{stats.englishWords}</div>
                        <div className="word-stat-label">كلمة إنجليزية</div>
                    </div>
                </div>

                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

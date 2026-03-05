// === صفحة منسق الأكواد ===
// /text/code-formatter
// يعمل بالكامل في المتصفح بدون حاجة للخادم الخلفي

'use client';

import { useState } from 'react';
import AdSlot from '../../../components/AdSlot';
import Link from 'next/link';

export default function CodeFormatterPage() {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('json');
    const [formattedCode, setFormattedCode] = useState('');
    const [error, setError] = useState('');

    const languages = [
        { value: 'json', label: 'JSON' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'javascript', label: 'JavaScript' },
    ];

    // === دوال التنسيق المحلية ===

    // تنسيق JSON
    const formatJSON = (str) => {
        const parsed = JSON.parse(str);
        return JSON.stringify(parsed, null, 2);
    };

    // تنسيق HTML
    const formatHTML = (str) => {
        let formatted = str.replace(/>\s*</g, '>\n<');
        let indent = 0;
        const lines = formatted.split('\n');
        const result = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1);
            result.push('  '.repeat(indent) + trimmed);
            if (trimmed.match(/^<[^/!][^>]*[^/]>$/) && !trimmed.match(/<\/\w+>$/)) {
                indent++;
            }
        }
        return result.join('\n');
    };

    // تنسيق CSS
    const formatCSS = (str) => {
        let result = str
            .replace(/\s*{\s*/g, ' {\n  ')
            .replace(/\s*}\s*/g, '\n}\n\n')
            .replace(/;\s*/g, ';\n  ')
            .replace(/\n\s*\n\s*\n/g, '\n\n');
        // تنظيف المسافات الزائدة في نهاية الأسطر
        return result.split('\n').map(l => l.trimEnd()).join('\n').trim();
    };

    // تنسيق JavaScript
    const formatJS = (str) => {
        let formatted = str
            .replace(/\s*{\s*/g, ' {\n')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/;\s*/g, ';\n');
        let indent = 0;
        const lines = formatted.split('\n');
        const result = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1);
            result.push('  '.repeat(indent) + trimmed);
            if (trimmed.endsWith('{')) indent++;
        }
        return result.join('\n');
    };

    // === دالة التنسيق الرئيسية ===
    const handleFormat = () => {
        setError('');
        setFormattedCode('');

        if (!code.trim()) {
            setError('أدخل الكود أولاً');
            return;
        }

        try {
            let result;
            switch (language) {
                case 'json':
                    result = formatJSON(code);
                    break;
                case 'html':
                    result = formatHTML(code);
                    break;
                case 'css':
                    result = formatCSS(code);
                    break;
                case 'javascript':
                    result = formatJS(code);
                    break;
                default:
                    result = code;
            }
            setFormattedCode(result);
        } catch (e) {
            setError(`خطأ في تنسيق الكود: ${e.message}`);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedCode);
        alert('تم نسخ الكود!');
    };

    return (
        <div className="tool-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link href="/">الرئيسية</Link>
                    <span>/</span>
                    <span>منسق الأكواد</span>
                </div>

                <div className="tool-page-header">
                    <h1>💻 منسق الأكواد البرمجية</h1>
                    <p>نسّق وجمّل أكوادك البرمجية بشكل احترافي — يعمل في المتصفح مباشرة</p>
                </div>

                <AdSlot position="tool-top" />

                {/* اختيار اللغة */}
                <div className="input-group">
                    <label>لغة البرمجة:</label>
                    <select className="select-field" value={language} onChange={(e) => setLanguage(e.target.value)}>
                        {languages.map(l => (
                            <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                    </select>
                </div>

                {/* حقل الإدخال */}
                <div className="text-area-container">
                    <label>الكود المراد تنسيقه:</label>
                    <textarea
                        className="text-area code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={`الصق كود ${languages.find(l => l.value === language)?.label || ''} هنا...`}
                        style={{ minHeight: '200px', fontFamily: "'Fira Code', 'Courier New', monospace" }}
                    />
                </div>

                <button className="btn-primary" onClick={handleFormat} disabled={!code.trim()}>
                    ✨ تنسيق الكود
                </button>

                {error && (
                    <div className="result-card error" style={{ marginTop: 20 }}>
                        <p>❌ {error}</p>
                    </div>
                )}

                {formattedCode && (
                    <div className="animate-fadeInUp" style={{ marginTop: 24 }}>
                        <div className="text-area-container">
                            <label>الكود بعد التنسيق:</label>
                            <textarea
                                className="text-area code"
                                value={formattedCode}
                                readOnly
                                style={{
                                    minHeight: '200px',
                                    background: 'rgba(0, 184, 148, 0.05)',
                                    borderColor: 'rgba(0, 184, 148, 0.3)',
                                    fontFamily: "'Fira Code', 'Courier New', monospace"
                                }}
                            />
                        </div>
                        <button className="btn-secondary" onClick={handleCopy}>
                            📋 نسخ الكود المنسق
                        </button>
                    </div>
                )}

                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

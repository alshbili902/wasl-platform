// === صفحة محول JSON ===
// /text/json-converter
// يعمل بالكامل في المتصفح بدون حاجة للخادم الخلفي

'use client';

import { useState } from 'react';
import AdSlot from '../../../components/AdSlot';
import Link from 'next/link';

export default function JSONConverterPage() {
    const [inputData, setInputData] = useState('{\n  "الاسم": "أحمد",\n  "العمر": 25,\n  "المدينة": "الرياض"\n}');
    const [fromFormat, setFromFormat] = useState('json');
    const [toFormat, setToFormat] = useState('yaml');
    const [outputData, setOutputData] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // === دوال التحويل المحلية (تعمل في المتصفح) ===

    // تحليل JSON
    const parseJSON = (str) => JSON.parse(str);

    // تحليل YAML بسيط
    const parseYAML = (str) => {
        const result = {};
        const lines = str.trim().split('\n');
        for (const line of lines) {
            if (line.trim().startsWith('#') || !line.trim()) continue;
            const colonIdx = line.indexOf(':');
            if (colonIdx > -1) {
                const key = line.slice(0, colonIdx).trim();
                let value = line.slice(colonIdx + 1).trim();
                // محاولة تحويل الأرقام
                if (!isNaN(value) && value !== '') value = Number(value);
                else if (value === 'true') value = true;
                else if (value === 'false') value = false;
                else value = value.replace(/^["']|["']$/g, '');
                result[key] = value;
            }
        }
        return result;
    };

    // تحليل CSV
    const parseCSV = (str) => {
        const lines = str.trim().split('\n');
        if (lines.length < 2) return [];
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const obj = {};
            headers.forEach((h, i) => obj[h] = values[i] || '');
            return obj;
        });
    };

    // تحويل إلى JSON
    const toJSON = (data) => JSON.stringify(data, null, 2);

    // تحويل إلى YAML
    const toYAML = (data, indent = 0) => {
        let result = '';
        const prefix = '  '.repeat(indent);
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    result += `${prefix}-\n`;
                    result += toYAML(item, indent + 1);
                } else {
                    result += `${prefix}- ${item}\n`;
                }
            });
        } else if (typeof data === 'object' && data !== null) {
            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    result += `${prefix}${key}:\n`;
                    result += toYAML(value, indent + 1);
                } else {
                    result += `${prefix}${key}: ${value}\n`;
                }
            });
        }
        return result;
    };

    // تحويل إلى XML
    const toXML = (data, rootTag = 'root', indent = 0) => {
        const prefix = '  '.repeat(indent);
        let result = '';
        if (indent === 0) {
            result += '<?xml version="1.0" encoding="UTF-8"?>\n';
            result += `<${rootTag}>\n`;
            result += toXML(data, rootTag, 1);
            result += `</${rootTag}>`;
            return result;
        }
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    result += `${prefix}<item>\n`;
                    result += toXML(item, 'item', indent + 1);
                    result += `${prefix}</item>\n`;
                } else {
                    result += `${prefix}<item>${item}</item>\n`;
                }
            });
        } else if (typeof data === 'object' && data !== null) {
            Object.entries(data).forEach(([key, value]) => {
                const tag = key.replace(/[^\w]/g, '_');
                if (typeof value === 'object' && value !== null) {
                    result += `${prefix}<${tag}>\n`;
                    result += toXML(value, tag, indent + 1);
                    result += `${prefix}</${tag}>\n`;
                } else {
                    result += `${prefix}<${tag}>${value}</${tag}>\n`;
                }
            });
        }
        return result;
    };

    // تحويل إلى CSV
    const toCSV = (data) => {
        if (!Array.isArray(data)) data = [data];
        if (!data.length || typeof data[0] !== 'object') return String(data);
        const headers = Object.keys(data[0]);
        const lines = [headers.map(h => `"${h}"`).join(',')];
        data.forEach(row => {
            lines.push(headers.map(h => `"${row[h] ?? ''}"`).join(','));
        });
        return lines.join('\n');
    };

    // === دالة التحويل الرئيسية ===
    const handleConvert = () => {
        setLoading(true);
        setError('');
        setOutputData('');

        try {
            // الخطوة 1: تحليل البيانات المصدر
            let parsedData;
            if (fromFormat === 'json') {
                parsedData = parseJSON(inputData);
            } else if (fromFormat === 'yaml') {
                parsedData = parseYAML(inputData);
            } else if (fromFormat === 'csv') {
                parsedData = parseCSV(inputData);
            } else {
                throw new Error('صيغة المصدر غير مدعومة');
            }

            // الخطوة 2: تحويل إلى الصيغة الهدف
            let result;
            if (toFormat === 'json') {
                result = toJSON(parsedData);
            } else if (toFormat === 'yaml') {
                result = toYAML(parsedData);
            } else if (toFormat === 'xml') {
                result = toXML(parsedData);
            } else if (toFormat === 'csv') {
                result = toCSV(parsedData);
            } else {
                throw new Error('صيغة الهدف غير مدعومة');
            }

            setOutputData(result);
        } catch (err) {
            setError(`خطأ في التحويل: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // نسخ النتيجة
    const handleCopy = () => {
        navigator.clipboard.writeText(outputData);
        alert('تم نسخ النتيجة!');
    };

    return (
        <div className="tool-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link href="/">الرئيسية</Link>
                    <span>/</span>
                    <span>محول JSON</span>
                </div>

                <div className="tool-page-header">
                    <h1>🔄 محول JSON</h1>
                    <p>حوّل بين JSON و YAML و XML و CSV بسهولة — يعمل في المتصفح مباشرة</p>
                </div>

                <AdSlot position="tool-top" />

                {/* اختيار الصيغ */}
                <div className="input-row">
                    <div className="input-group">
                        <label>من صيغة:</label>
                        <select className="select-field" value={fromFormat} onChange={(e) => setFromFormat(e.target.value)}>
                            <option value="json">JSON</option>
                            <option value="yaml">YAML</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>إلى صيغة:</label>
                        <select className="select-field" value={toFormat} onChange={(e) => setToFormat(e.target.value)}>
                            <option value="json">JSON</option>
                            <option value="yaml">YAML</option>
                            <option value="xml">XML</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>
                </div>

                {/* حقل الإدخال */}
                <div className="text-area-container">
                    <label>البيانات المصدر ({fromFormat.toUpperCase()}):</label>
                    <textarea
                        className="text-area code"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        placeholder={`أدخل بيانات ${fromFormat.toUpperCase()} هنا...`}
                    />
                </div>

                {/* زر التحويل */}
                <button className="btn-primary" onClick={handleConvert} disabled={!inputData.trim() || loading}>
                    {loading ? 'جاري التحويل...' : `🔄 تحويل إلى ${toFormat.toUpperCase()}`}
                </button>

                {/* رسالة الخطأ */}
                {error && (
                    <div className="result-card error" style={{ marginTop: 20 }}>
                        <p>❌ {error}</p>
                    </div>
                )}

                {/* حقل النتيجة */}
                {outputData && (
                    <div className="animate-fadeInUp" style={{ marginTop: 24 }}>
                        <div className="text-area-container">
                            <label>النتيجة ({toFormat.toUpperCase()}):</label>
                            <textarea
                                className="text-area code"
                                value={outputData}
                                readOnly
                                style={{ background: 'rgba(0, 184, 148, 0.05)', borderColor: 'rgba(0, 184, 148, 0.3)' }}
                            />
                        </div>
                        <button className="btn-secondary" onClick={handleCopy} style={{ marginTop: 12 }}>
                            📋 نسخ النتيجة
                        </button>
                    </div>
                )}

                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

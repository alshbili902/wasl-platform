// === صفحة تحويل صيغة الصور ===
// /image/convert

'use client';

import { useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import ResultDisplay from '../../../components/ResultDisplay';
import AdSlot from '../../../components/AdSlot';
import { uploadFiles, getDownloadUrl } from '../../../lib/api';
import Link from 'next/link';

export default function ConvertImagePage() {
    const [files, setFiles] = useState([]);
    const [targetFormat, setTargetFormat] = useState('png');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const formats = [
        { value: 'png', label: 'PNG' },
        { value: 'jpg', label: 'JPG' },
        { value: 'webp', label: 'WEBP' },
        { value: 'bmp', label: 'BMP' },
        { value: 'gif', label: 'GIF' },
        { value: 'tiff', label: 'TIFF' },
        { value: 'ico', label: 'ICO' },
    ];

    const handleConvert = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await uploadFiles('/api/image/convert', files[0], {
                target_format: targetFormat
            });

            setResult({
                success: true,
                message: response.message || `تم تحويل الصورة إلى ${targetFormat.toUpperCase()}`,
                downloadUrl: getDownloadUrl(response.download_url),
                filename: response.filename,
            });
        } catch (error) {
            setResult({
                success: false,
                message: error.message || 'حدث خطأ أثناء التحويل',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tool-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link href="/">الرئيسية</Link>
                    <span>/</span>
                    <span>تحويل الصور</span>
                </div>

                <div className="tool-page-header">
                    <h1>🔄 تحويل صيغة الصور</h1>
                    <p>حوّل صورتك إلى أي صيغة تريدها: PNG, JPG, WEBP والمزيد</p>
                </div>

                <AdSlot position="tool-top" />

                {!result && (
                    <>
                        <FileUpload
                            accept="image/*"
                            multiple={false}
                            maxSize={20}
                            onFilesChange={setFiles}
                            uploadText="اسحب الصورة وأفلتها هنا"
                            icon="🖼️"
                        />

                        <div className="input-group">
                            <label>الصيغة الهدف:</label>
                            <select
                                className="select-field"
                                value={targetFormat}
                                onChange={(e) => setTargetFormat(e.target.value)}
                            >
                                {formats.map(f => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleConvert}
                            disabled={files.length === 0 || loading}
                        >
                            {loading ? 'جاري التحويل...' : `🔄 تحويل إلى ${targetFormat.toUpperCase()}`}
                        </button>
                    </>
                )}

                <ResultDisplay result={result} onReset={() => { setFiles([]); setResult(null); }} />
                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

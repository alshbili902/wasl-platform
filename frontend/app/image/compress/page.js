// === صفحة ضغط الصور ===
// /image/compress

'use client';

import { useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import ResultDisplay from '../../../components/ResultDisplay';
import AdSlot from '../../../components/AdSlot';
import { uploadFiles, getDownloadUrl } from '../../../lib/api';
import Link from 'next/link';

export default function CompressImagePage() {
    const [files, setFiles] = useState([]);
    const [quality, setQuality] = useState(70);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleCompress = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await uploadFiles('/api/image/compress', files[0], { quality });
            const formatSize = (bytes) => bytes ? `${(bytes / 1024).toFixed(0)} KB` : '-';

            setResult({
                success: true,
                message: response.message,
                downloadUrl: getDownloadUrl(response.download_url),
                filename: response.filename,
                stats: [
                    { value: formatSize(response.original_size), label: 'الحجم الأصلي' },
                    { value: formatSize(response.compressed_size), label: 'بعد الضغط' },
                    { value: response.reduction || '-', label: 'التوفير' },
                ]
            });
        } catch (error) {
            setResult({ success: false, message: error.message });
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
                    <span>ضغط الصور</span>
                </div>

                <div className="tool-page-header">
                    <h1>🗜️ ضغط الصور</h1>
                    <p>قلّل حجم صورتك مع التحكم في مستوى الجودة</p>
                </div>

                <AdSlot position="tool-top" />

                {!result && (
                    <>
                        <FileUpload
                            accept="image/*"
                            multiple={false}
                            maxSize={20}
                            onFilesChange={setFiles}
                            uploadText="اسحب الصورة المراد ضغطها"
                            icon="🗜️"
                        />

                        <div className="input-group">
                            <label>مستوى الجودة: {quality}%</label>
                            <input
                                type="range"
                                min={10}
                                max={100}
                                value={quality}
                                onChange={(e) => setQuality(parseInt(e.target.value))}
                                className="input-field"
                                style={{ cursor: 'pointer' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <span>ضغط عالي (حجم صغير)</span>
                                <span>جودة عالية (حجم كبير)</span>
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleCompress}
                            disabled={files.length === 0 || loading}
                        >
                            {loading ? 'جاري الضغط...' : '🗜️ ضغط الصورة'}
                        </button>
                    </>
                )}

                <ResultDisplay result={result} onReset={() => { setFiles([]); setResult(null); }} />
                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

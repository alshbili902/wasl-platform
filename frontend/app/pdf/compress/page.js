// === صفحة ضغط PDF ===
// /pdf/compress

'use client';

import { useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import ResultDisplay from '../../../components/ResultDisplay';
import AdSlot from '../../../components/AdSlot';
import { uploadFiles, getDownloadUrl } from '../../../lib/api';
import Link from 'next/link';

export default function CompressPDFPage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleCompress = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await uploadFiles('/api/pdf/compress', files[0]);

            const formatSize = (bytes) => {
                if (!bytes) return '-';
                return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
            };

            setResult({
                success: true,
                message: response.message || 'تم ضغط الملف بنجاح!',
                downloadUrl: getDownloadUrl(response.download_url),
                filename: response.filename || 'compressed.pdf',
                stats: [
                    { value: formatSize(response.original_size), label: 'الحجم الأصلي' },
                    { value: formatSize(response.compressed_size), label: 'الحجم بعد الضغط' },
                    { value: response.reduction || '-', label: 'نسبة التوفير' },
                ]
            });
        } catch (error) {
            setResult({
                success: false,
                message: error.message || 'حدث خطأ أثناء الضغط',
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
                    <span>ضغط PDF</span>
                </div>

                <div className="tool-page-header">
                    <h1>📦 ضغط ملف PDF</h1>
                    <p>قلّل حجم ملف PDF مع الحفاظ على جودة المحتوى</p>
                </div>

                <AdSlot position="tool-top" />

                {!result && (
                    <>
                        <FileUpload
                            accept=".pdf"
                            multiple={false}
                            maxSize={50}
                            onFilesChange={setFiles}
                            uploadText="اسحب ملف PDF المراد ضغطه"
                            icon="📦"
                        />

                        <button
                            className="btn-primary"
                            onClick={handleCompress}
                            disabled={files.length === 0 || loading}
                        >
                            {loading ? 'جاري الضغط...' : '📦 ضغط الملف'}
                        </button>
                    </>
                )}

                <ResultDisplay result={result} onReset={() => { setFiles([]); setResult(null); }} />
                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

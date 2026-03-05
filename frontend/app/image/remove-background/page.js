// === صفحة إزالة خلفية الصور ===
// /image/remove-background

'use client';

import { useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import ResultDisplay from '../../../components/ResultDisplay';
import AdSlot from '../../../components/AdSlot';
import { uploadFiles, getDownloadUrl } from '../../../lib/api';
import Link from 'next/link';

export default function RemoveBackgroundPage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleRemove = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await uploadFiles('/api/image/remove-background', files[0]);

            setResult({
                success: true,
                message: response.message || 'تم إزالة الخلفية بنجاح!',
                downloadUrl: getDownloadUrl(response.download_url),
                filename: response.filename || 'no_background.png',
            });
        } catch (error) {
            setResult({
                success: false,
                message: error.message || 'حدث خطأ أثناء إزالة الخلفية',
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
                    <span>إزالة الخلفية</span>
                </div>

                <div className="tool-page-header">
                    <h1>🪄 إزالة خلفية الصور بالذكاء الاصطناعي</h1>
                    <p>أزل أي خلفية من صورك تلقائياً باستخدام تقنيات الذكاء الاصطناعي المتقدمة</p>
                </div>

                <AdSlot position="tool-top" />

                {!result && (
                    <>
                        <FileUpload
                            accept="image/*"
                            multiple={false}
                            maxSize={10}
                            onFilesChange={setFiles}
                            uploadText="اسحب الصورة المراد إزالة خلفيتها"
                            uploadSubtext="يدعم: JPG, PNG, WEBP وغيرها"
                            icon="🪄"
                        />

                        <button
                            className="btn-primary"
                            onClick={handleRemove}
                            disabled={files.length === 0 || loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: 0 }}></span>
                                    جاري إزالة الخلفية...
                                </>
                            ) : (
                                '🪄 إزالة الخلفية'
                            )}
                        </button>

                        {loading && (
                            <p className="loading-text">
                                يتم الآن تحليل الصورة وإزالة الخلفية بالذكاء الاصطناعي...
                            </p>
                        )}
                    </>
                )}

                <ResultDisplay result={result} onReset={() => { setFiles([]); setResult(null); }} />
                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

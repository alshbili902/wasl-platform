// === صفحة دمج PDF ===
// /pdf/merge

'use client';

import { useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import ResultDisplay from '../../../components/ResultDisplay';
import AdSlot from '../../../components/AdSlot';
import { uploadFiles, getDownloadUrl } from '../../../lib/api';
import Link from 'next/link';

export default function MergePDFPage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // تنفيذ عملية الدمج
    const handleMerge = async () => {
        if (files.length < 2) {
            alert('يجب اختيار ملفين على الأقل');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await uploadFiles('/api/pdf/merge', files);

            setResult({
                success: true,
                message: response.message || 'تم دمج الملفات بنجاح!',
                downloadUrl: getDownloadUrl(response.download_url),
                filename: response.filename || 'merged.pdf',
                stats: [
                    { value: files.length, label: 'عدد الملفات المدمجة' },
                ]
            });
        } catch (error) {
            setResult({
                success: false,
                message: error.message || 'حدث خطأ أثناء دمج الملفات',
            });
        } finally {
            setLoading(false);
        }
    };

    // إعادة تعيين الصفحة
    const handleReset = () => {
        setFiles([]);
        setResult(null);
    };

    return (
        <div className="tool-page">
            <div className="container">
                {/* مسار التنقل */}
                <div className="breadcrumb">
                    <Link href="/">الرئيسية</Link>
                    <span>/</span>
                    <Link href="/#pdf-tools">أدوات PDF</Link>
                    <span>/</span>
                    <span>دمج PDF</span>
                </div>

                {/* عنوان الصفحة */}
                <div className="tool-page-header">
                    <h1>📑 دمج ملفات PDF</h1>
                    <p>ادمج عدة ملفات PDF في ملف واحد بترتيب محدد</p>
                </div>

                <AdSlot position="tool-top" />

                {/* منطقة رفع الملفات */}
                {!result && (
                    <>
                        <FileUpload
                            accept=".pdf"
                            multiple={true}
                            maxSize={50}
                            onFilesChange={setFiles}
                            uploadText="اسحب ملفات PDF وأفلتها هنا"
                            uploadSubtext="يمكنك اختيار ملفين أو أكثر"
                            icon="📄"
                        />

                        {/* زر الدمج */}
                        <button
                            className="btn-primary"
                            onClick={handleMerge}
                            disabled={files.length < 2 || loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: 0 }}></span>
                                    جاري الدمج...
                                </>
                            ) : (
                                <>📑 دمج {files.length} ملفات</>
                            )}
                        </button>

                        {loading && (
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '60%' }}></div>
                            </div>
                        )}
                    </>
                )}

                {/* عرض النتيجة */}
                <ResultDisplay result={result} onReset={handleReset} />

                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

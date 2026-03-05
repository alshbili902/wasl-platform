// === صفحة تقسيم PDF ===
// /pdf/split

'use client';

import { useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import ResultDisplay from '../../../components/ResultDisplay';
import AdSlot from '../../../components/AdSlot';
import { uploadFiles, getDownloadUrl } from '../../../lib/api';
import Link from 'next/link';

export default function SplitPDFPage() {
    const [files, setFiles] = useState([]);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSplit = async () => {
        if (files.length === 0) {
            alert('يجب اختيار ملف PDF');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const extraData = {
                start_page: startPage,
            };
            if (endPage) extraData.end_page = endPage;

            const response = await uploadFiles('/api/pdf/split', files[0], extraData);

            setResult({
                success: true,
                message: response.message || 'تم تقسيم الملف بنجاح!',
                downloadUrl: getDownloadUrl(response.download_url),
                filename: response.filename || 'split.pdf',
                stats: [
                    { value: response.pages_extracted || '-', label: 'صفحات مستخرجة' },
                ]
            });
        } catch (error) {
            setResult({
                success: false,
                message: error.message || 'حدث خطأ أثناء التقسيم',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFiles([]);
        setResult(null);
        setStartPage(1);
        setEndPage('');
    };

    return (
        <div className="tool-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link href="/">الرئيسية</Link>
                    <span>/</span>
                    <span>تقسيم PDF</span>
                </div>

                <div className="tool-page-header">
                    <h1>✂️ تقسيم ملف PDF</h1>
                    <p>استخرج صفحات محددة من ملف PDF إلى ملف جديد</p>
                </div>

                <AdSlot position="tool-top" />

                {!result && (
                    <>
                        <FileUpload
                            accept=".pdf"
                            multiple={false}
                            maxSize={50}
                            onFilesChange={setFiles}
                            uploadText="اسحب ملف PDF وأفلته هنا"
                            icon="✂️"
                        />

                        {/* إعدادات التقسيم */}
                        <div className="input-row" style={{ marginTop: 24 }}>
                            <div className="input-group">
                                <label>من صفحة:</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={startPage}
                                    onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                                    min={1}
                                />
                            </div>
                            <div className="input-group">
                                <label>إلى صفحة (اختياري):</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={endPage}
                                    onChange={(e) => setEndPage(e.target.value)}
                                    placeholder="آخر صفحة"
                                    min={1}
                                />
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleSplit}
                            disabled={files.length === 0 || loading}
                        >
                            {loading ? 'جاري التقسيم...' : '✂️ تقسيم الملف'}
                        </button>
                    </>
                )}

                <ResultDisplay result={result} onReset={handleReset} />
                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

// === صفحة قص الفيديو ===
// /video/cut

'use client';

import { useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import ResultDisplay from '../../../components/ResultDisplay';
import AdSlot from '../../../components/AdSlot';
import { uploadFiles, getDownloadUrl } from '../../../lib/api';
import Link from 'next/link';

export default function CutVideoPage() {
    const [files, setFiles] = useState([]);
    const [startTime, setStartTime] = useState('00:00:00');
    const [endTime, setEndTime] = useState('00:00:30');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleCut = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await uploadFiles('/api/video/cut', files[0], {
                start_time: startTime,
                end_time: endTime,
            });

            setResult({
                success: true,
                message: response.message || 'تم قص الفيديو بنجاح!',
                downloadUrl: getDownloadUrl(response.download_url),
                filename: response.filename,
                stats: [
                    { value: startTime, label: 'من' },
                    { value: endTime, label: 'إلى' },
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
                    <span>قص الفيديو</span>
                </div>

                <div className="tool-page-header">
                    <h1>✂️ قص الفيديو</h1>
                    <p>اقتطع الجزء المطلوب من الفيديو بتحديد وقت البداية والنهاية</p>
                </div>

                <AdSlot position="tool-top" />

                {!result && (
                    <>
                        <FileUpload
                            accept="video/*"
                            multiple={false}
                            maxSize={100}
                            onFilesChange={setFiles}
                            uploadText="اسحب ملف الفيديو وأفلته هنا"
                            uploadSubtext="يدعم: MP4, AVI, MOV, MKV"
                            icon="🎬"
                        />

                        <div className="input-row">
                            <div className="input-group">
                                <label>وقت البداية (HH:MM:SS):</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    placeholder="00:00:00"
                                    dir="ltr"
                                />
                            </div>
                            <div className="input-group">
                                <label>وقت النهاية (HH:MM:SS):</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    placeholder="00:00:30"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleCut}
                            disabled={files.length === 0 || loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2, margin: 0 }}></span>
                                    جاري قص الفيديو...
                                </>
                            ) : (
                                '✂️ قص الفيديو'
                            )}
                        </button>
                    </>
                )}

                <ResultDisplay result={result} onReset={() => { setFiles([]); setResult(null); }} />
                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

// === صفحة تحويل فيديو إلى GIF ===
// /video/to-gif

'use client';

import { useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import ResultDisplay from '../../../components/ResultDisplay';
import AdSlot from '../../../components/AdSlot';
import { uploadFiles, getDownloadUrl } from '../../../lib/api';
import Link from 'next/link';

export default function VideoToGifPage() {
    const [files, setFiles] = useState([]);
    const [startTime, setStartTime] = useState('00:00:00');
    const [duration, setDuration] = useState(5);
    const [fps, setFps] = useState(10);
    const [width, setWidth] = useState(480);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleConvert = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await uploadFiles('/api/video/to-gif', files[0], {
                start_time: startTime,
                duration,
                fps,
                width,
            });

            setResult({
                success: true,
                message: response.message || 'تم التحويل إلى GIF بنجاح!',
                downloadUrl: getDownloadUrl(response.download_url),
                filename: 'animation.gif',
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
                    <span>فيديو إلى GIF</span>
                </div>

                <div className="tool-page-header">
                    <h1>🎞️ تحويل فيديو إلى GIF</h1>
                    <p>حوّل أي مقطع فيديو إلى صورة متحركة GIF بجودة عالية</p>
                </div>

                <AdSlot position="tool-top" />

                {!result && (
                    <>
                        <FileUpload
                            accept="video/*"
                            multiple={false}
                            maxSize={50}
                            onFilesChange={setFiles}
                            uploadText="اسحب ملف الفيديو هنا"
                            icon="🎞️"
                        />

                        <div className="input-row">
                            <div className="input-group">
                                <label>وقت البداية:</label>
                                <input type="text" className="input-field" value={startTime} onChange={(e) => setStartTime(e.target.value)} dir="ltr" />
                            </div>
                            <div className="input-group">
                                <label>المدة (ثوانٍ):</label>
                                <input type="number" className="input-field" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 5)} min={1} max={30} />
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>إطارات/ثانية (FPS):</label>
                                <input type="number" className="input-field" value={fps} onChange={(e) => setFps(parseInt(e.target.value) || 10)} min={5} max={30} />
                            </div>
                            <div className="input-group">
                                <label>العرض (بكسل):</label>
                                <input type="number" className="input-field" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 480)} min={100} max={1920} />
                            </div>
                        </div>

                        <button className="btn-primary" onClick={handleConvert} disabled={files.length === 0 || loading}>
                            {loading ? 'جاري التحويل...' : '🎞️ تحويل إلى GIF'}
                        </button>
                    </>
                )}

                <ResultDisplay result={result} onReset={() => { setFiles([]); setResult(null); }} />
                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

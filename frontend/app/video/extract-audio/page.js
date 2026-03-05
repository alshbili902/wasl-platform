// === صفحة استخراج الصوت من الفيديو ===
// /video/extract-audio

'use client';

import { useState } from 'react';
import FileUpload from '../../../components/FileUpload';
import ResultDisplay from '../../../components/ResultDisplay';
import AdSlot from '../../../components/AdSlot';
import { uploadFiles, getDownloadUrl } from '../../../lib/api';
import Link from 'next/link';

export default function ExtractAudioPage() {
    const [files, setFiles] = useState([]);
    const [audioFormat, setAudioFormat] = useState('mp3');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleExtract = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await uploadFiles('/api/video/extract-audio', files[0], {
                audio_format: audioFormat,
            });

            setResult({
                success: true,
                message: response.message || 'تم استخراج الصوت بنجاح!',
                downloadUrl: getDownloadUrl(response.download_url),
                filename: `audio.${audioFormat}`,
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
                    <span>استخراج الصوت</span>
                </div>

                <div className="tool-page-header">
                    <h1>🎵 استخراج الصوت من الفيديو</h1>
                    <p>استخرج المسار الصوتي من أي ملف فيديو واحفظه بالصيغة المفضلة</p>
                </div>

                <AdSlot position="tool-top" />

                {!result && (
                    <>
                        <FileUpload
                            accept="video/*"
                            multiple={false}
                            maxSize={100}
                            onFilesChange={setFiles}
                            uploadText="اسحب ملف الفيديو هنا"
                            icon="🎵"
                        />

                        <div className="input-group">
                            <label>صيغة الصوت:</label>
                            <select
                                className="select-field"
                                value={audioFormat}
                                onChange={(e) => setAudioFormat(e.target.value)}
                            >
                                <option value="mp3">MP3</option>
                                <option value="wav">WAV</option>
                                <option value="aac">AAC</option>
                                <option value="ogg">OGG</option>
                            </select>
                        </div>

                        <button className="btn-primary" onClick={handleExtract} disabled={files.length === 0 || loading}>
                            {loading ? 'جاري الاستخراج...' : `🎵 استخراج الصوت بصيغة ${audioFormat.toUpperCase()}`}
                        </button>
                    </>
                )}

                <ResultDisplay result={result} onReset={() => { setFiles([]); setResult(null); }} />
                <AdSlot position="tool-bottom" />
            </div>
        </div>
    );
}

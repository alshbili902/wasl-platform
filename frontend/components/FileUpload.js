// === مكوّن رفع الملفات بالسحب والإفلات ===
// يدعم: سحب وإفلات، اختيار ملفات متعددة، عرض قائمة الملفات

'use client';

import { useState, useCallback, useRef } from 'react';

export default function FileUpload({
    accept = '*',           // أنواع الملفات المقبولة
    multiple = false,       // السماح بملفات متعددة
    maxSize = 50,           // الحد الأقصى بالميجابايت
    onFilesChange,          // دالة عند تغيير الملفات
    uploadText = 'اسحب الملفات وأفلتها هنا',
    uploadSubtext = 'أو اضغط لاختيار الملفات',
    icon = '📁'
}) {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // تنسيق حجم الملف
    const formatSize = (bytes) => {
        if (bytes === 0) return '0 بايت';
        const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    };

    // معالجة الملفات المختارة
    const handleFiles = useCallback((newFiles) => {
        const validFiles = Array.from(newFiles).filter(file => {
            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > maxSize) {
                alert(`الملف "${file.name}" أكبر من الحد المسموح (${maxSize} ميجابايت)`);
                return false;
            }
            return true;
        });

        const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
    }, [files, multiple, maxSize, onFilesChange]);

    // حذف ملف من القائمة
    const removeFile = useCallback((index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
    }, [files, onFilesChange]);

    // أحداث السحب والإفلات
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    // أيقونة نوع الملف
    const getFileIcon = (filename) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        const iconMap = {
            pdf: '📄', doc: '📝', docx: '📝',
            jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️',
            mp4: '🎬', avi: '🎬', mov: '🎬', mkv: '🎬',
            mp3: '🎵', wav: '🎵', aac: '🎵',
            json: '📋', xml: '📋', csv: '📋',
            zip: '📦', rar: '📦',
        };
        return iconMap[ext] || '📎';
    };

    return (
        <div>
            {/* === منطقة السحب والإفلات === */}
            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''} ${files.length > 0 ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="upload-icon">{icon}</div>
                <div className="upload-text">{uploadText}</div>
                <div className="upload-subtext">{uploadSubtext}</div>
                <div className="upload-subtext" style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                    الحد الأقصى: {maxSize} ميجابايت لكل ملف
                </div>

                {/* حقل إدخال الملفات المخفي */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => handleFiles(e.target.files)}
                    style={{ display: 'none' }}
                />
            </div>

            {/* === قائمة الملفات المختارة === */}
            {files.length > 0 && (
                <div className="file-list">
                    {files.map((file, index) => (
                        <div key={index} className="file-item animate-fadeInUp">
                            <span className="file-item-icon">{getFileIcon(file.name)}</span>
                            <div className="file-item-info">
                                <div className="file-item-name">{file.name}</div>
                                <div className="file-item-size">{formatSize(file.size)}</div>
                            </div>
                            <button
                                className="file-item-remove"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                                aria-label="حذف الملف"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

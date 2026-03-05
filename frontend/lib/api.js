// === مكتبة الاتصال بالـ API ===
// توفر وظائف مساعدة للتواصل مع الخادم الخلفي

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * رفع ملف/ملفات إلى الخادم
 * @param {string} endpoint - نقطة النهاية (مثل: /api/pdf/merge)
 * @param {File[]} files - قائمة الملفات
 * @param {Object} extraData - بيانات إضافية
 * @param {Function} onProgress - دالة متابعة التقدم
 */
export async function uploadFiles(endpoint, files, extraData = {}, onProgress = null) {
    const formData = new FormData();

    // إضافة الملفات
    if (Array.isArray(files)) {
        files.forEach((file) => {
            formData.append('files', file);
        });
    } else {
        formData.append('file', files);
    }

    // إضافة البيانات الإضافية
    Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `خطأ في الخادم: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('خطأ في رفع الملفات:', error);
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('الخادم الخلفي غير متصل. هذه الأداة تحتاج تشغيل الخادم الخلفي (Backend).\n\nلتشغيله:\n1. افتح نافذة أوامر جديدة\n2. cd wasl/backend\n3. pip install -r requirements.txt\n4. uvicorn app.main:app --port 8000');
        }
        throw error;
    }
}

/**
 * إرسال طلب POST مع بيانات JSON
 * @param {string} endpoint - نقطة النهاية
 * @param {Object} data - البيانات
 */
export async function postJSON(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `خطأ في الخادم: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('خطأ في الطلب:', error);
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('الخادم الخلفي غير متصل. هذه الأداة تحتاج تشغيل الخادم الخلفي (Backend).');
        }
        throw error;
    }
}

/**
 * متابعة حالة مهمة Celery
 * @param {string} taskId - معرّف المهمة
 */
export async function checkTaskStatus(taskId) {
    try {
        const response = await fetch(`${API_URL}/api/tasks/${taskId}`);
        return await response.json();
    } catch (error) {
        console.error('خطأ في متابعة المهمة:', error);
        throw error;
    }
}

/**
 * إنشاء رابط تحميل الملف
 * @param {string} downloadUrl - مسار الملف
 */
export function getDownloadUrl(downloadUrl) {
    return `${API_URL}${downloadUrl}`;
}

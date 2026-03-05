// === بيانات الأدوات ===
// قائمة جميع الأدوات المتاحة في المنصة مع معلوماتها

export const toolCategories = [
    { id: 'all', label: 'جميع الأدوات', icon: '🔧' },
    { id: 'pdf', label: 'أدوات PDF', icon: '📄' },
    { id: 'image', label: 'أدوات الصور', icon: '🖼️' },
    { id: 'video', label: 'أدوات الفيديو', icon: '🎬' },
    { id: 'text', label: 'أدوات النصوص', icon: '📝' },
];

export const tools = [
    // === أدوات PDF ===
    {
        id: 'merge-pdf',
        title: 'دمج PDF',
        description: 'ادمج عدة ملفات PDF في ملف واحد بسهولة وسرعة',
        icon: '📑',
        category: 'pdf',
        href: '/pdf/merge',
    },
    {
        id: 'split-pdf',
        title: 'تقسيم PDF',
        description: 'استخرج صفحات محددة من ملف PDF إلى ملف جديد',
        icon: '✂️',
        category: 'pdf',
        href: '/pdf/split',
    },
    {
        id: 'compress-pdf',
        title: 'ضغط PDF',
        description: 'قلّل حجم ملف PDF مع الحفاظ على جودة المحتوى',
        icon: '📦',
        category: 'pdf',
        href: '/pdf/compress',
    },

    // === أدوات الصور ===
    {
        id: 'convert-image',
        title: 'تحويل صيغة الصور',
        description: 'حوّل الصور بين الصيغ المختلفة: PNG, JPG, WEBP, BMP والمزيد',
        icon: '🔄',
        category: 'image',
        href: '/image/convert',
    },
    {
        id: 'compress-image',
        title: 'ضغط الصور',
        description: 'قلّل حجم الصور مع التحكم في مستوى الجودة',
        icon: '🗜️',
        category: 'image',
        href: '/image/compress',
    },
    {
        id: 'remove-background',
        title: 'إزالة خلفية الصور',
        description: 'أزل خلفية أي صورة بالذكاء الاصطناعي في ثوانٍ',
        icon: '🪄',
        category: 'image',
        href: '/image/remove-background',
    },

    // === أدوات الفيديو والصوت ===
    {
        id: 'cut-video',
        title: 'قص الفيديو',
        description: 'اقتطع جزءاً محدداً من الفيديو بتحديد وقت البداية والنهاية',
        icon: '✂️',
        category: 'video',
        href: '/video/cut',
    },
    {
        id: 'video-to-gif',
        title: 'تحويل فيديو إلى GIF',
        description: 'حوّل أي مقطع فيديو إلى صورة متحركة GIF',
        icon: '🎞️',
        category: 'video',
        href: '/video/to-gif',
    },
    {
        id: 'extract-audio',
        title: 'استخراج الصوت',
        description: 'استخرج المسار الصوتي من أي ملف فيديو بصيغ متعددة',
        icon: '🎵',
        category: 'video',
        href: '/video/extract-audio',
    },

    // === أدوات النصوص والبرمجة ===
    {
        id: 'json-converter',
        title: 'محول JSON',
        description: 'حوّل بين JSON و YAML و XML و CSV بسهولة',
        icon: '🔄',
        category: 'text',
        href: '/text/json-converter',
    },
    {
        id: 'word-counter',
        title: 'عداد الكلمات',
        description: 'احسب عدد الكلمات والأحرف والجمل مع تحليل شامل للنص',
        icon: '🔢',
        category: 'text',
        href: '/text/word-counter',
    },
    {
        id: 'code-formatter',
        title: 'منسق الأكواد',
        description: 'نسّق وجمّل الأكواد البرمجية: JSON, HTML, CSS, JavaScript',
        icon: '💻',
        category: 'text',
        href: '/text/code-formatter',
    },
    {
        id: 'plagiarism-check',
        title: 'فاحص الانتحال',
        description: 'تحقق من نسبة التشابه بين نصين واكتشف النسخ',
        icon: '🔍',
        category: 'text',
        href: '/text/plagiarism-check',
    },
];

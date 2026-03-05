// === التخطيط الرئيسي للتطبيق ===
// يحتوي على الرأس والتذييل ومنطقة المحتوى
// جميع الصفحات ترث هذا التخطيط

import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// === البيانات الوصفية للموقع (SEO) ===
export const metadata = {
    title: 'وصل | منصة الأدوات الشاملة - معالجة الملفات أونلاين',
    description: 'منصة وصل العربية الشاملة لمعالجة الملفات عبر الإنترنت. أدوات PDF، تعديل الصور، تحرير الفيديو، وأدوات النصوص - كل ذلك مجاناً وبدون تثبيت برامج.',
    keywords: 'أدوات PDF, دمج PDF, تحويل صور, ضغط ملفات, إزالة خلفية, قص فيديو, عداد كلمات, محول JSON',
    openGraph: {
        title: 'وصل | منصة الأدوات الشاملة',
        description: 'منصة عربية شاملة لمعالجة الملفات أونلاين - مجاناً وبدون تثبيت',
        locale: 'ar_SA',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                {/* خطوط Google العربية */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Changa:wght@200;300;400;500;600;700;800&family=Amiri:wght@400;700&display=swap"
                    rel="stylesheet"
                />
                {/* أيقونة الموقع */}
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                {/* === رأس الصفحة === */}
                <Header />

                {/* === المحتوى الرئيسي === */}
                <main className="main-content">
                    {children}
                </main>

                {/* === تذييل الصفحة === */}
                <Footer />
            </body>
        </html>
    );
}

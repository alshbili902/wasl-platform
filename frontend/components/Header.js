// === مكوّن الرأس (Header) ===
// شريط التنقل العلوي الثابت مع الشعار وروابط التنقل

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
    // حالة قائمة الموبايل
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-inner">
                {/* === الشعار === */}
                <Link href="/" className="logo">
                    <div className="logo-icon">و</div>
                    <span className="logo-text">وصل</span>
                </Link>

                {/* === زر قائمة الموبايل === */}
                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="القائمة"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>

                {/* === روابط التنقل === */}
                <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <Link href="/" onClick={() => setMenuOpen(false)}>
                        الرئيسية
                    </Link>
                    <Link href="/#pdf-tools" onClick={() => setMenuOpen(false)}>
                        أدوات PDF
                    </Link>
                    <Link href="/#image-tools" onClick={() => setMenuOpen(false)}>
                        أدوات الصور
                    </Link>
                    <Link href="/#video-tools" onClick={() => setMenuOpen(false)}>
                        أدوات الفيديو
                    </Link>
                    <Link href="/#text-tools" onClick={() => setMenuOpen(false)}>
                        أدوات النصوص
                    </Link>
                    <Link href="/pricing" className="nav-cta" onClick={() => setMenuOpen(false)}>
                        اشتراك Premium
                    </Link>
                </nav>
            </div>
        </header>
    );
}

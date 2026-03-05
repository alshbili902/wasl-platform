// === صفحة الاشتراك ===
// /pricing

import Link from 'next/link';
import AdSlot from '../../components/AdSlot';

export const metadata = {
    title: 'الاشتراكات | وصل - منصة الأدوات الشاملة',
    description: 'اشترك في وصل Premium للحصول على تجربة بدون إعلانات وحدود رفع أكبر.',
};

export default function PricingPage() {
    return (
        <div className="tool-page" style={{ maxWidth: '1000px' }}>
            <div className="container">
                <div className="tool-page-header">
                    <h1>💎 خطط الاشتراك</h1>
                    <p>اختر الخطة المناسبة لاحتياجاتك</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
                    {/* الخطة المجانية */}
                    <div className="tool-card" style={{ cursor: 'default', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem' }}>🆓</div>
                        <h3 style={{ fontSize: '1.5rem', margin: '12px 0' }}>مجاني</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary-light)' }}>
                            $0<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/شهرياً</span>
                        </div>
                        <ul style={{ listStyle: 'none', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'right' }}>
                            <li>✅ جميع الأدوات الأساسية</li>
                            <li>✅ حد رفع 50 ميجابايت</li>
                            <li>✅ معالجة فورية</li>
                            <li>❌ يتضمن إعلانات</li>
                            <li>❌ أولوية منخفضة</li>
                        </ul>
                        <Link href="/" className="btn-secondary" style={{ marginTop: '24px', display: 'block', textDecoration: 'none' }}>
                            ابدأ مجاناً
                        </Link>
                    </div>

                    {/* خطة Premium */}
                    <div className="tool-card" style={{ cursor: 'default', textAlign: 'center', borderColor: 'var(--primary)', position: 'relative' }}>
                        <div style={{
                            position: 'absolute', top: '-12px', right: '50%', transform: 'translateX(50%)',
                            background: 'var(--gradient-primary)', padding: '4px 20px', borderRadius: '20px',
                            fontSize: '0.8rem', fontWeight: 700
                        }}>
                            الأكثر شعبية
                        </div>
                        <div style={{ fontSize: '2.5rem' }}>💎</div>
                        <h3 style={{ fontSize: '1.5rem', margin: '12px 0' }}>Premium</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary-light)' }}>
                            $5<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/شهرياً</span>
                        </div>
                        <ul style={{ listStyle: 'none', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'right' }}>
                            <li>✅ جميع الأدوات المتقدمة</li>
                            <li>✅ حد رفع 500 ميجابايت</li>
                            <li>✅ معالجة بأولوية عالية</li>
                            <li>✅ بدون إعلانات</li>
                            <li>✅ دعم فني مميز</li>
                        </ul>
                        <button className="btn-primary" style={{ marginTop: '24px' }}>
                            اشترك الآن
                        </button>
                    </div>

                    {/* خطة الأعمال */}
                    <div className="tool-card" style={{ cursor: 'default', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem' }}>🏢</div>
                        <h3 style={{ fontSize: '1.5rem', margin: '12px 0' }}>الأعمال</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary-light)' }}>
                            $15<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/شهرياً</span>
                        </div>
                        <ul style={{ listStyle: 'none', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'right' }}>
                            <li>✅ كل مميزات Premium</li>
                            <li>✅ حد رفع 2 جيجابايت</li>
                            <li>✅ API مخصص</li>
                            <li>✅ معالجة دفعية</li>
                            <li>✅ دعم أولوية قصوى</li>
                        </ul>
                        <button className="btn-secondary" style={{ marginTop: '24px' }}>
                            تواصل معنا
                        </button>
                    </div>
                </div>

                <AdSlot position="pricing-bottom" />
            </div>
        </div>
    );
}

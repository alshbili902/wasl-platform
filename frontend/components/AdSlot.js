// === مكوّن مساحة الإعلانات ===
// مكان محجوز لإعلانات AdSense

export default function AdSlot({ position = 'inline' }) {
    return (
        <div className="ad-slot" data-ad-position={position}>
            {/* مساحة إعلانية - AdSense */}
            {/* 
        لتفعيل الإعلانات، استبدل هذا المحتوى بكود Google AdSense:
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true" />
      */}
            <span>مساحة إعلانية</span>
        </div>
    );
}

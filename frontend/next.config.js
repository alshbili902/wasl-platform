/** @type {import('next').NextConfig} */

// === إعدادات Next.js ===
const nextConfig = {
  // تفعيل الوضع الصارم لـ React
  reactStrictMode: true,
  
  // إعادة كتابة المسارات لتوجيه API إلى الخادم الخلفي
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
      {
        source: '/files/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/files/:path*`,
      },
    ];
  },
  
  // إعدادات الصور
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,  // Fast Refresh 충돌 방지
  experimental: {}, // 불필요한 'appDir' 제거
};

export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Игнорировать ошибки тайпскрипта при сборке (чтобы не докапывался)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорировать ошибки оформления кода
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/login',
  //       permanent: true,
  //     }
  //   ]
  // }
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://your-api-domain.com/api/:path*', // 実際の API ドメインに置き換えてください
  //     },
  //   ];
  // },
  // async headers() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       headers: [
  //         {
  //           key: 'Access-Control-Allow-Origin',
  //           value: '*', // 必要に応じて適切なオリジンを設定
  //         },
  //       ],
  //     },
  //   ];
  // },
}

module.exports = nextConfig
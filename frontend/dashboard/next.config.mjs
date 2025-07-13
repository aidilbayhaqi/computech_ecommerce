/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://localhost:5000/uploads/:path*",
      },
    ];
  },
  images: {
    domains: ["localhost"], // agar Image dari localhost:5000 tidak error
  },
};

export default nextConfig

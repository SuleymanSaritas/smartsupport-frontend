/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Proxy API requests to local backend during development
  // This avoids CORS issues when frontend and backend run on different ports
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    // Only use proxy in development (when API URL is localhost)
    if (apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1")) {
      return [
        {
          source: "/api/python/:path*",
          destination: `${apiUrl}/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;


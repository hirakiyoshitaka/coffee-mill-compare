import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hbb.afl.rakuten.co.jp",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.rakuten.co.jp",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

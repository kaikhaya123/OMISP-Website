import path from "path";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd(), "src"),
      "react-router-dom": path.resolve(process.cwd(), "src/lib/react-router-dom.tsx"),
    };

    return config;
  },
};

export default nextConfig;
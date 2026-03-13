import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  outputFileTracingRoot: path.join(__dirname, './'),
  webpack(config, { isServer }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd(), "src"),
      "react-router-dom": path.resolve(process.cwd(), "src/lib/react-router-dom.tsx"),
    };

    return config;
  },
};

export default nextConfig;
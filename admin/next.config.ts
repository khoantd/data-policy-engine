import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Docker uses standalone; Vercel uses its own Next builder (VERCEL=1).
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  turbopack: {
    root: dir,
  },
};

export default nextConfig;

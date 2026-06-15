import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project lives in an iCloud-synced Desktop folder. iCloud continuously
  // syncs the build directory while Turbopack is writing/compacting it, which
  // corrupts the cache (missing runtime chunks, missing build manifests, SST
  // write failures). macOS iCloud ignores any path ending in ".nosync", so we
  // write the build output to ".next.nosync" — it stays inside the project
  // (Turbopack refuses to write outside the project root) but iCloud leaves it
  // alone. If this project is ever moved out of iCloud, this can revert to .next.
  distDir: ".next.nosync",

  // pdf-parse is built on pdfjs-dist, which loads its worker (pdf.worker.mjs)
  // from disk at runtime. Bundling it into the server route relocates the code
  // into .next/ but not the worker file, so extraction throws "Setting up fake
  // worker failed". Keeping these external lets pdf.js resolve the worker from
  // node_modules. mammoth (DOCX) has no worker and is unaffected.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;

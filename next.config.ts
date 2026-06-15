import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse is built on pdfjs-dist, which loads its worker (pdf.worker.mjs)
  // from disk at runtime. Bundling it into the server route relocates the code
  // into .next/ but not the worker file, so extraction throws "Setting up fake
  // worker failed". Keeping these external lets pdf.js resolve the worker from
  // node_modules. mammoth (DOCX) has no worker and is unaffected.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;

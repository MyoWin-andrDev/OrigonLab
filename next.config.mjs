/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    /**
     * Remote image hosts.
     *
     * Figma caveat: thumbnail URLs returned by the Figma API are *signed* and
     * expire after a short window, so linking one directly will 404 in a few
     * hours. Download the thumbnail and commit it to /public instead — these
     * patterns are here for previewing while you work, not for production.
     */
    remotePatterns: [
      { protocol: "https", hostname: "**.figma.com" },
      { protocol: "https", hostname: "s3-alpha-sig.figma.com" },
      { protocol: "https", hostname: "figma-alpha-api.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
  },
};

export default nextConfig;

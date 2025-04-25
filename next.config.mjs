/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "doctorlistingingestionpr.azureedge.net",
      "doctorlistingingestionpr.blob.core.windows.net",
      "cmsuatstor.blob.core.windows.net",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

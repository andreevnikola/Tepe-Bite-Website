import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "typeorm",
    "pg",
    "mongoose",
    "bcryptjs",
    "reflect-metadata",
  ],
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      // The full registry moved from /initiatives/all to /initiatives when the
      // former marketing gateway was merged into /impact.
      {
        source: "/initiatives/all",
        destination: "/initiatives",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      // UploadThing (admin dashboard uploads)
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      // Placeholder photos for seeded test data (initiative covers + galleries).
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["qrmphlycjvabrzcrhcqh.supabase.co"],
  },
  async redirects() {
    return [
      {
        source: "/resume",
        destination: "/resume.pdf",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

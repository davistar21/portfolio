import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://eyitayobembe.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/private"], // Hide admin routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

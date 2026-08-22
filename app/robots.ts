import type { MetadataRoute } from "next";

const SITE = "https://www.origonlab.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The enquiry endpoint has nothing to index and shouldn't be crawled.
      disallow: ["/api/"],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { privacyIsDraft } from "@/lib/privacy";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexable) return [];
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [{ url: siteConfig.url, lastModified: now, changeFrequency: "monthly", priority: 1 }];
  if (!privacyIsDraft) {
    pages.push({ url: `${siteConfig.url}/aviso-de-privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 });
  }
  return pages;
}

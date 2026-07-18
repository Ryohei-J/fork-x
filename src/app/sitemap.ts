import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";

export const dynamic = "force-static";

const BASE_URL = "https://forkx.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/articles`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...ARTICLES.map((article) => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    {
      url: `${BASE_URL}/glossary`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

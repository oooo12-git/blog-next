export const redirectedPostTargets = {
  "korean-information-processing-engineer-practical-exam-strategy":
    "https://jeongcheogi.edugamja.com/theory/theory-expected-questions",
  "jeongcheogi-practical-exam-review-2025-2":
    "https://jeongcheogi.edugamja.com/past-exam/2025/2025-2-review",
  "jeongcheogi-difficulty-theory":
    "https://jeongcheogi.edugamja.com/theory/jeongcheogi-difficulty-theory",
} as const;

export const redirectedPostSlugs = Object.keys(redirectedPostTargets);

export const postRedirects = redirectedPostSlugs.flatMap((slug) => {
  const destination =
    redirectedPostTargets[slug as keyof typeof redirectedPostTargets];

  return [
    {
      source: `/ko/blog/${slug}`,
      destination,
    },
    {
      source: `/en/blog/${slug}`,
      destination,
    },
  ];
});

export function isRedirectedPostSlug(slug: string): boolean {
  return (redirectedPostSlugs as readonly string[]).includes(slug);
}

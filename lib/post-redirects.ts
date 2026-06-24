export const redirectedPostSlugs = [
  "korean-information-processing-engineer-practical-exam-strategy",
] as const;

export const theoryExpectedQuestionsUrl =
  "https://jeongcheogi.edugamja.com/theory/theory-expected-questions";

export const postRedirects = redirectedPostSlugs.flatMap((slug) => [
  {
    source: `/ko/blog/${slug}`,
    destination: theoryExpectedQuestionsUrl,
  },
  {
    source: `/en/blog/${slug}`,
    destination: theoryExpectedQuestionsUrl,
  },
]);

export function isRedirectedPostSlug(slug: string): boolean {
  return (redirectedPostSlugs as readonly string[]).includes(slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/contents/${slug}.mdx`);

  return <Post />;
}

export function generateStaticParams() {
  return [
    { slug: "welcome" },
    { slug: "about" },
    { slug: "featured" },
    { slug: "content1" },
    { slug: "content2" },
    { slug: "content3" },
  ];
}
//generateStaticParams는 제공된 라우트들을 미리 렌더링하는 데 사용될 수 있습니다. dynamicParams를 false로 설정함으로써, generateStaticParams에 정의되지 않은 라우트에 접근하면 404 에러가 발생하게 됩니다. https://nextjs.org/docs/app/api-reference/functions/generate-static-params

export const dynamicParams = false;
//dynamicParams = false로 설정되어 있기 때문에, 정의된 페이지 외에 다른 URL로 접근하면 404 페이지를 보게 됩니다. 이는 보안과 성능 최적화를 위한 설정입니다.

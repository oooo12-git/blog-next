import fs from "fs";
import path from "path";

interface PostMetadata {
  title: string;
  description: string;
  publishedAt: string;
  lastModifiedAt: string;
  timeToRead: string;
  heroImage: string;
  tags: string[];
}

export interface Post {
  slug: string;
  metadata: PostMetadata;
}

interface Posts {
  posts: Post[];
  totalPages: number;
}

// MDX 파일의 읽기 시간을 자동으로 계산하는 함수
function calculateReadingTime(content: string): number {
  // MDX 메타데이터 제거 (export const metadata = {...} 부분)
  const contentWithoutMetadata = content.replace(
    /export\s+const\s+metadata\s*=\s*{[\s\S]*?};\s*/,
    ""
  );

  // 마크다운 문법 제거 (제목, 링크, 굵게, 기울임 등)
  const plainText = contentWithoutMetadata
    .replace(/#{1,6}\s+/g, "") // 제목 (# ## ###)
    .replace(/\*\*(.*?)\*\*/g, "$1") // 굵게
    .replace(/\*(.*?)\*/g, "$1") // 기울임
    .replace(/`(.*?)`/g, "$1") // 인라인 코드
    .replace(/```[\s\S]*?```/g, "") // 코드 블록
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // 이미지
    .replace(/^\s*[-*+]\s+/gm, "") // 리스트
    .replace(/^\s*\d+\.\s+/gm, "") // 번호 목록
    .replace(/\n+/g, " ") // 개행을 공백으로
    .trim();

  // 한국어와 영어 단어 수 계산
  const koreanChars = (plainText.match(/[가-힣]/g) || []).length;
  const englishWords =
    plainText
      .replace(/[가-힣]/g, " ") // 한국어 제거
      .match(/\b\w+\b/g)?.length || 0;

  // 읽기 속도: 영어 250단어/분, 한국어 300자/분
  const englishReadingTime = englishWords / 250;
  const koreanReadingTime = koreanChars / 300;

  const totalMinutes = englishReadingTime + koreanReadingTime;

  // 최소 1분, 반올림
  return Math.max(1, Math.round(totalMinutes));
}

// MDX 파일의 원본 텍스트를 읽는 함수
async function readMdxContent(slug: string, locale: string): Promise<string> {
  const filePath = path.resolve(
    process.cwd(),
    `contents/${slug}/${locale}.mdx`
  );

  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Failed to read MDX file: ${filePath}`, error);
    return "";
  }
}

export async function getPost(slug: string, locale: string): Promise<Post> {
  const file = await import(`../contents/${slug}/${locale}.mdx`);

  if (file?.metadata) {
    // 옵셔널 체이닝 연산자 (?.)
    // file?.metadata는 file이 존재하고 null이나 undefined가 아닐 때만 metadata 속성에 접근합니다
    // 만약 file이 null이나 undefined라면, 에러를 발생시키지 않고 undefined를 반환
    if (
      !file.metadata.title ||
      !file.metadata.description ||
      !file.metadata.publishedAt
    ) {
      throw new Error(`Missing some required metadata fields in: ${slug}`);
    }

    if (!Array.isArray(file.metadata.tags)) {
      throw new Error(
        `Post tags must be defined as an array even if they are empty, in: ${slug}`
      );
    }

    // 자동으로 읽기 시간 계산
    let calculatedTimeToRead = file.metadata.timeToRead;

    // timeToRead가 없거나 0인 경우 자동 계산
    if (!file.metadata.timeToRead || file.metadata.timeToRead === 0) {
      const mdxContent = await readMdxContent(slug, locale);
      calculatedTimeToRead = calculateReadingTime(mdxContent);
    }

    return {
      slug,
      metadata: {
        ...file.metadata,
        timeToRead: calculatedTimeToRead,
      },
    };
  }

  throw new Error(`Unable to find metadata for ${slug}.mdx`);
}

export function getPostSlugs(): string[] {
  const postsDirectory = path.resolve(process.cwd(), "contents");
  return fs.readdirSync(postsDirectory).filter((file) => file !== ".DS_Store");
}

export async function getPosts(
  locale: string,
  limit = -1,
  offset = 0
): Promise<Posts> {
  const postSlugs = getPostSlugs();

  const posts = await Promise.all(
    postSlugs.map(async (slug) => {
      const postData = await getPost(slug, locale);

      return { ...postData, slug };
    })
  );

  return {
    posts: posts
      .sort((a, b) =>
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ? -1
          : 1
      )
      .slice(offset, limit === -1 ? posts.length : offset + limit),
    totalPages: Math.ceil(posts.length / (limit === -1 ? 1 : limit)),
  };
}

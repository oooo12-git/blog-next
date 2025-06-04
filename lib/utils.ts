import fs from "fs";
import path from "path";
import { supabase } from "./supabase";

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

// 조회수 관리를 위한 인터페이스 추가
export interface PostView {
  slug: string;
  view_count: number;
  last_viewed_at: string;
}

// 조회수 정보를 포함한 포스트 인터페이스
export interface PostWithViewCount extends Post {
  viewCount: number;
}

interface PostsWithViewCount {
  posts: PostWithViewCount[];
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

// 조회수 가져오기 함수
export async function getPostViewCount(slug: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("post_views")
      .select("view_count")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116은 "No rows found" 에러
      console.error("Error fetching view count:", error);
      return 0;
    }

    return data?.view_count || 0;
  } catch (error) {
    console.error("Error in getPostViewCount:", error);
    return 0;
  }
}

// 조회수 증가 함수
export async function incrementPostViewCount(slug: string): Promise<number> {
  try {
    // 먼저 현재 조회수를 확인
    const { data: existingData, error: selectError } = await supabase
      .from("post_views")
      .select("view_count")
      .eq("slug", slug)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking existing view count:", selectError);
      return 0;
    }

    if (existingData) {
      // 기존 레코드가 있으면 업데이트
      const newCount = existingData.view_count + 1;
      const { data, error } = await supabase
        .from("post_views")
        .update({
          view_count: newCount,
          last_viewed_at: new Date().toISOString(),
        })
        .eq("slug", slug)
        .select("view_count")
        .single();

      if (error) {
        console.error("Error updating view count:", error);
        return existingData.view_count;
      }

      return data.view_count;
    } else {
      // 새 레코드 생성
      const { data, error } = await supabase
        .from("post_views")
        .insert({
          slug,
          view_count: 1,
          last_viewed_at: new Date().toISOString(),
        })
        .select("view_count")
        .single();

      if (error) {
        console.error("Error creating view count record:", error);
        return 0;
      }

      return data.view_count;
    }
  } catch (error) {
    console.error("Error in incrementPostViewCount:", error);
    return 0;
  }
}

// 모든 태그를 가져오는 함수
export async function getAllTags(locale: string): Promise<string[]> {
  const { posts } = await getPosts(locale);

  // 모든 포스트의 태그를 수집
  const allTags = posts.reduce<string[]>((tags, post) => {
    return [...tags, ...post.metadata.tags];
  }, []);

  // 중복 제거 후 알파벳 순으로 정렬
  return [...new Set(allTags)].sort();
}

// 특정 태그를 가진 포스트들을 가져오는 함수
export async function getPostsByTag(
  locale: string,
  tag: string,
  limit = -1,
  offset = 0
): Promise<Posts> {
  const { posts } = await getPosts(locale);

  // 특정 태그를 가진 포스트들만 필터링
  const filteredPosts = posts.filter((post) =>
    post.metadata.tags.includes(tag)
  );

  return {
    posts: filteredPosts.slice(
      offset,
      limit === -1 ? filteredPosts.length : offset + limit
    ),
    totalPages: Math.ceil(filteredPosts.length / (limit === -1 ? 1 : limit)),
  };
}

// 태그별 포스트 개수를 가져오는 함수
export async function getTagCounts(
  locale: string
): Promise<Record<string, number>> {
  const { posts } = await getPosts(locale);

  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    post.metadata.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return tagCounts;
}

// 최근 쓰여진 태그를 가져오는 함수 (최대 6개)
export async function getRecentTags(
  locale: string,
  limit = 6
): Promise<string[]> {
  const { posts } = await getPosts(locale);

  // 최신 포스트 순으로 정렬 (이미 getPosts에서 정렬되어 있지만 명시적으로)
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  const recentTags: string[] = [];
  const seenTags = new Set<string>();

  // 최신 포스트부터 순회하면서 새로운 태그들을 수집
  for (const post of sortedPosts) {
    for (const tag of post.metadata.tags) {
      if (!seenTags.has(tag)) {
        recentTags.push(tag);
        seenTags.add(tag);

        // 원하는 개수에 도달하면 중단
        if (recentTags.length >= limit) {
          return recentTags;
        }
      }
    }
  }

  return recentTags;
}

// viewCount 기준으로 인기글을 가져오는 함수
export async function getPopularPosts(
  locale: string,
  limit = 10
): Promise<PostsWithViewCount> {
  const { posts } = await getPosts(locale);

  // 모든 포스트의 조회수를 가져오고 정렬하기
  const postsWithViewCount = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      viewCount: await getPostViewCount(post.slug),
    }))
  );

  // 조회수 기준으로 내림차순 정렬
  const popularPosts = postsWithViewCount
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);

  return {
    posts: popularPosts,
    totalPages: 1, // 인기글은 페이지네이션 없이 단일 페이지로 제공
  };
}

// 검색 기능을 위한 함수
export async function searchPosts(
  locale: string,
  query: string,
  limit = 10
): Promise<Post[]> {
  if (!query.trim()) {
    return [];
  }

  const postSlugs = getPostSlugs();
  const searchQuery = query.toLowerCase().trim();

  const posts = await Promise.all(
    postSlugs.map(async (slug) => {
      try {
        const postData = await getPost(slug, locale);
        return { ...postData, slug };
      } catch (error) {
        console.error(`Error loading post ${slug}:`, error);
        return null;
      }
    })
  );

  const validPosts = posts.filter((post): post is Post => post !== null);

  // 제목, 설명, 태그에서 검색
  const matchedPosts = validPosts.filter((post) => {
    const titleMatch = post.metadata.title.toLowerCase().includes(searchQuery);
    const descriptionMatch = post.metadata.description
      .toLowerCase()
      .includes(searchQuery);
    const tagsMatch = post.metadata.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery)
    );

    return titleMatch || descriptionMatch || tagsMatch;
  });

  // 관련성 점수 계산 (제목 > 설명 > 태그 순으로 우선순위)
  const scoredPosts = matchedPosts.map((post) => {
    let score = 0;
    const title = post.metadata.title.toLowerCase();
    const description = post.metadata.description.toLowerCase();

    if (title.includes(searchQuery)) {
      score += title.indexOf(searchQuery) === 0 ? 10 : 5; // 제목 시작일 때 더 높은 점수
    }
    if (description.includes(searchQuery)) {
      score += 3;
    }
    if (
      post.metadata.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    ) {
      score += 1;
    }

    return { post, score };
  });

  // 점수순으로 정렬하고 제한된 개수만 반환
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

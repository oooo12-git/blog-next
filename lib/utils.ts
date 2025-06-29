import fs from "fs";
import path from "path";
import { supabase } from "./supabase";
import { Comment, CommentFormData } from "./types";

interface ReviewRating {
  "@type": "Rating";
  ratingValue: number;
}

interface ItemReviewed {
  "@type": "Restaurant";
  image: string;
  name: string;
  servesCuisine: string;
  priceRange: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

interface PostMetadata {
  title: string;
  description: string;
  publishedAt: string;
  lastModifiedAt: string;
  timeToRead: string;
  heroImage: string;
  tags: string[];
  itemReviewed?: ItemReviewed;
  reviewRating?: ReviewRating;
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

// 검색을 위한 본문 텍스트 추출 함수
function extractSearchableContent(mdxContent: string): string {
  // MDX 메타데이터 제거 (export const metadata = {...} 부분)
  const contentWithoutMetadata = mdxContent.replace(
    /export\s+const\s+metadata\s*=\s*{[\s\S]*?};\s*/,
    ""
  );

  // 마크다운 문법 제거하여 순수 텍스트만 추출
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
    .replace(/import\s+.*?from\s+.*?;/g, "") // import 문
    .replace(/<[^>]*>/g, "") // HTML 태그
    .replace(/\n+/g, " ") // 개행을 공백으로
    .trim();

  return plainText;
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

// 좋아요 관리 인터페이스
export interface PostLike {
  slug: string;
  like_count: number;
  last_liked_at: string;
}

export interface UserLike {
  slug: string;
  user_session: string;
  liked: boolean;
}

// 통합 테이블에서 좋아요 수 가져오기 함수
export async function getPostLikeCount(slug: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("post_views")
      .select("like_count")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching like count:", error);
      return 0;
    }

    return data?.like_count || 0;
  } catch (error) {
    console.error("Error in getPostLikeCount:", error);
    return 0;
  }
}

// 통합 테이블에서 조회수와 좋아요 수 함께 가져오기
export async function getPostStats(slug: string): Promise<{
  viewCount: number;
  likeCount: number;
  engagementRate: number;
}> {
  try {
    const { data, error } = await supabase
      .from("post_views")
      .select("view_count, like_count")
      .eq("slug", slug)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching post stats:", error);
      return { viewCount: 0, likeCount: 0, engagementRate: 0 };
    }

    const viewCount = data?.view_count || 0;
    const likeCount = data?.like_count || 0;
    const engagementRate = viewCount > 0 ? (likeCount / viewCount) * 100 : 0;

    return {
      viewCount,
      likeCount,
      engagementRate: Math.round(engagementRate * 100) / 100,
    };
  } catch (error) {
    console.error("Error in getPostStats:", error);
    return { viewCount: 0, likeCount: 0, engagementRate: 0 };
  }
}

// 사용자 좋아요 상태 확인 함수
export async function getUserLikeStatus(
  slug: string,
  userSession: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_likes")
      .select("liked")
      .eq("slug", slug)
      .eq("user_session", userSession)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user like status:", error);
      return false;
    }

    return data?.liked || false;
  } catch (error) {
    console.error("Error in getUserLikeStatus:", error);
    return false;
  }
}

// 좋아요 토글 함수
export async function togglePostLike(
  slug: string,
  userSession: string
): Promise<{
  success: boolean;
  liked: boolean;
  likeCount: number;
}> {
  try {
    // 현재 사용자의 좋아요 상태 확인
    const { data: existingLike, error: selectError } = await supabase
      .from("user_likes")
      .select("liked")
      .eq("slug", slug)
      .eq("user_session", userSession)
      .single();

    let newLikedStatus: boolean;

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking existing like:", selectError);
      return { success: false, liked: false, likeCount: 0 };
    }

    if (existingLike) {
      // 기존 레코드가 있으면 상태 토글
      newLikedStatus = !existingLike.liked;
      const { error: updateError } = await supabase
        .from("user_likes")
        .update({
          liked: newLikedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", slug)
        .eq("user_session", userSession);

      if (updateError) {
        console.error("Error updating like status:", updateError);
        return { success: false, liked: existingLike.liked, likeCount: 0 };
      }
    } else {
      // 새 레코드 생성 (기본적으로 liked = true)
      newLikedStatus = true;
      const { error: insertError } = await supabase.from("user_likes").insert({
        slug,
        user_session: userSession,
        liked: newLikedStatus,
      });

      if (insertError) {
        console.error("Error creating like record:", insertError);
        return { success: false, liked: false, likeCount: 0 };
      }
    }

    // 업데이트된 좋아요 수 가져오기
    const likeCount = await getPostLikeCount(slug);

    return { success: true, liked: newLikedStatus, likeCount };
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    return { success: false, liked: false, likeCount: 0 };
  }
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

// 검색어가 매칭된 본문 스니펫 추출 함수
function extractMatchingSnippet(
  content: string,
  searchQuery: string,
  maxLength = 150
): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = searchQuery.toLowerCase();

  const matchIndex = lowerContent.indexOf(lowerQuery);
  if (matchIndex === -1) return "";

  // 매칭된 부분 앞뒤로 컨텍스트 추가
  const contextLength = Math.floor((maxLength - searchQuery.length) / 2);
  const start = Math.max(0, matchIndex - contextLength);
  const end = Math.min(
    content.length,
    matchIndex + searchQuery.length + contextLength
  );

  let snippet = content.substring(start, end);

  // 앞뒤가 잘렸으면 ... 추가
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return snippet;
}

// Post 인터페이스 확장
export interface PostWithSnippet extends Post {
  contentSnippet?: string;
}

// 검색 기능을 위한 함수
export async function searchPosts(
  locale: string,
  query: string,
  limit = 10
): Promise<PostWithSnippet[]> {
  if (!query.trim()) {
    return [];
  }

  const postSlugs = getPostSlugs();
  const searchQuery = query.toLowerCase().trim();

  const posts = await Promise.all(
    postSlugs.map(async (slug) => {
      try {
        const postData = await getPost(slug, locale);

        // 본문 내용도 검색하기 위해 MDX 파일 읽기
        const mdxContent = await readMdxContent(slug, locale);
        const searchableContent = extractSearchableContent(mdxContent);

        return {
          ...postData,
          slug,
          searchableContent: searchableContent.toLowerCase(),
          originalContent: searchableContent, // 원본 텍스트 (대소문자 유지)
        };
      } catch (error) {
        console.error(`Error loading post ${slug}:`, error);
        return null;
      }
    })
  );

  const validPosts = posts.filter(
    (
      post
    ): post is Post & { searchableContent: string; originalContent: string } =>
      post !== null
  );

  // 제목, 설명, 태그, 본문에서 검색
  const matchedPosts = validPosts.filter((post) => {
    const titleMatch = post.metadata.title.toLowerCase().includes(searchQuery);
    const descriptionMatch = post.metadata.description
      .toLowerCase()
      .includes(searchQuery);
    const tagsMatch = post.metadata.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery)
    );
    const contentMatch = post.searchableContent.includes(searchQuery);

    return titleMatch || descriptionMatch || tagsMatch || contentMatch;
  });

  // 관련성 점수 계산 및 스니펫 추출
  const scoredPosts = matchedPosts.map((post) => {
    let score = 0;
    const title = post.metadata.title.toLowerCase();
    const description = post.metadata.description.toLowerCase();

    // 제목 매칭 (가장 높은 가중치)
    if (title.includes(searchQuery)) {
      score += title.indexOf(searchQuery) === 0 ? 10 : 5;
    }

    // 설명 매칭
    if (description.includes(searchQuery)) {
      score += 3;
    }

    // 태그 매칭
    if (
      post.metadata.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    ) {
      score += 2;
    }

    // 본문 매칭 및 스니펫 추출
    let contentSnippet = "";
    if (post.searchableContent.includes(searchQuery)) {
      score += 1;
      contentSnippet = extractMatchingSnippet(
        post.originalContent,
        searchQuery
      );
    }

    return {
      post: {
        slug: post.slug,
        metadata: post.metadata,
        contentSnippet: contentSnippet || undefined,
      },
      score,
    };
  });

  // 점수순으로 정렬하고 제한된 개수만 반환
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

// ==================== 댓글 관련 함수들 ====================

// 특정 포스트의 모든 댓글 가져오기 (중첩 구조로 변환)
export async function getCommentsBySlug(slug: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("slug", slug)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return [];
    }

    if (!data) return [];

    // 데이터베이스 형식을 Comment 인터페이스 형식으로 변환
    const comments: Comment[] = data.map((comment) => ({
      id: comment.id,
      author: comment.author,
      email: comment.email,
      content: comment.content,
      createdAt: comment.created_at,
      lastModifiedAt:
        comment.updated_at !== comment.created_at
          ? comment.updated_at
          : undefined,
      parentId: comment.parent_id,
      replies: [],
      isDeleted: !comment.author || !comment.content, // author나 content가 null인 경우 삭제된 댓글
    }));

    // 중첩 구조로 변환 (부모-자식 관계 설정)
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // 먼저 모든 댓글을 Map에 저장
    comments.forEach((comment) => {
      commentMap.set(comment.id, comment);
    });

    // 부모-자식 관계 설정
    comments.forEach((comment) => {
      if (comment.parentId) {
        // 답글인 경우
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          if (!parent.replies) {
            parent.replies = [];
          }
          parent.replies.push(comment);
        }
      } else {
        // 최상위 댓글인 경우
        rootComments.push(comment);
      }
    });

    return rootComments;
  } catch (error) {
    console.error("Error in getCommentsBySlug:", error);
    return [];
  }
}

// 새 댓글 추가
export async function addComment(
  slug: string,
  data: CommentFormData,
  parentId?: string
): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  try {
    const { data: insertedComment, error } = await supabase
      .from("comments")
      .insert({
        slug,
        author: data.author,
        email: data.email,
        content: data.content,
        parent_id: parentId || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding comment:", error);
      return { success: false, error: "댓글 추가에 실패했습니다." };
    }

    // 데이터베이스 형식을 Comment 인터페이스 형식으로 변환
    const comment: Comment = {
      id: insertedComment.id,
      author: insertedComment.author,
      email: insertedComment.email,
      content: insertedComment.content,
      createdAt: insertedComment.created_at,
      parentId: insertedComment.parent_id,
      replies: [],
      isDeleted: false, // 새로 생성된 댓글은 삭제되지 않음
    };

    return { success: true, comment };
  } catch (error) {
    console.error("Error in addComment:", error);
    return { success: false, error: "댓글 추가에 실패했습니다." };
  }
}

// 댓글 수정 (이메일 인증 포함)
export async function updateComment(
  commentId: string,
  email: string,
  data: CommentFormData
): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  try {
    // 먼저 댓글 존재 여부와 이메일 일치 확인
    const { data: existingComment, error: selectError } = await supabase
      .from("comments")
      .select("*")
      .eq("id", commentId)
      .eq("email", email)
      .single();

    if (selectError || !existingComment) {
      return {
        success: false,
        error: "댓글을 찾을 수 없거나 이메일이 일치하지 않습니다.",
      };
    }

    // 이미 삭제된 댓글인지 확인
    if (!existingComment.author || !existingComment.content) {
      return {
        success: false,
        error: "삭제된 댓글은 수정할 수 없습니다.",
      };
    }

    // 댓글 업데이트
    const { data: updatedComment, error: updateError } = await supabase
      .from("comments")
      .update({
        author: data.author,
        content: data.content,
      })
      .eq("id", commentId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating comment:", updateError);
      return { success: false, error: "댓글 수정에 실패했습니다." };
    }

    // 데이터베이스 형식을 Comment 인터페이스 형식으로 변환
    const comment: Comment = {
      id: updatedComment.id,
      author: updatedComment.author,
      email: updatedComment.email,
      content: updatedComment.content,
      createdAt: updatedComment.created_at,
      lastModifiedAt: updatedComment.updated_at,
      parentId: updatedComment.parent_id,
      replies: [],
      isDeleted: false, // 수정된 댓글은 삭제되지 않음
    };

    return { success: true, comment };
  } catch (error) {
    console.error("Error in updateComment:", error);
    return { success: false, error: "댓글 수정에 실패했습니다." };
  }
}

// 댓글 소프트 삭제 (이메일 인증 포함)
export async function deleteComment(
  commentId: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 먼저 댓글 존재 여부와 이메일 일치 확인 (이미 삭제된 댓글은 제외)
    const { data: existingComment, error: selectError } = await supabase
      .from("comments")
      .select("email, author, content")
      .eq("id", commentId)
      .eq("email", email)
      .single();

    if (selectError || !existingComment) {
      return {
        success: false,
        error: "댓글을 찾을 수 없거나 이메일이 일치하지 않습니다.",
      };
    }

    // 이미 삭제된 댓글인지 확인
    if (!existingComment.author || !existingComment.content) {
      return {
        success: false,
        error: "이미 삭제된 댓글입니다.",
      };
    }

    // 소프트 삭제: author와 content를 NULL로 설정
    const { error: updateError } = await supabase
      .from("comments")
      .update({
        author: null,
        content: null,
      })
      .eq("id", commentId);

    if (updateError) {
      console.error("Error soft deleting comment:", updateError);
      return { success: false, error: "댓글 삭제에 실패했습니다." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteComment:", error);
    return { success: false, error: "댓글 삭제에 실패했습니다." };
  }
}

// 특정 포스트의 댓글 수 가져오기 (삭제되지 않은 댓글만)
export async function getCommentCount(slug: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("slug", slug)
      .not("author", "is", null)
      .not("content", "is", null);

    if (error) {
      console.error("Error fetching comment count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getCommentCount:", error);
    return 0;
  }
}

// 특정 댓글을 ID로 조회
export async function getCommentById(
  commentId: string
): Promise<Comment | null> {
  try {
    const { data: comment, error } = await supabase
      .from("comments")
      .select("*")
      .eq("id", commentId)
      .single();

    if (error || !comment) {
      console.error("Error fetching comment by ID:", error);
      return null;
    }

    // 데이터베이스 형식을 Comment 인터페이스 형식으로 변환
    const formattedComment: Comment = {
      id: comment.id,
      author: comment.author,
      email: comment.email,
      content: comment.content,
      createdAt: comment.created_at,
      parentId: comment.parent_id,
      replies: [],
      isDeleted: !comment.author || !comment.content,
    };

    return formattedComment;
  } catch (error) {
    console.error("Error in getCommentById:", error);
    return null;
  }
}

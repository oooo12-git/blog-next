import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const locale = searchParams.get("locale") || "ko";

  if (!query) {
    return NextResponse.json(
      { error: "검색어가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const results = await searchPosts(locale, query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

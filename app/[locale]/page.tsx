import { BlogPosts } from "@/app/components/Posts";
import { Inter } from "next/font/google";
import { FeaturedPost } from "@/app/components/Featured";
import { BlogPostsBottom } from "@/app/components/PostsBottom";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <main className={`${inter.className} dark:text-white`}>
      <BlogPosts params={params} />
      <FeaturedPost params={params} />
      <BlogPostsBottom params={params} />
    </main>
  );
}

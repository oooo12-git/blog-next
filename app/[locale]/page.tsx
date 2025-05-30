// import Image from "next/image";
import { BlogPosts } from "@/app/components/Posts";
import { Inter } from "next/font/google";
import { FeaturedPost } from "@/app/components/Featured";
import { BlogPostsBottom } from "@/app/components/PostsBottom";

const inter = Inter({ subsets: ["latin"] });

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // const t = useTranslations("HomePage");
  // const { locale } = await params;
  // const { posts } = await getPosts(locale, 4);

  return (
    <main className={`${inter.className} dark:text-white`}>
      <BlogPosts params={params} />
      <FeaturedPost params={params} />
      <BlogPostsBottom params={params} />
    </main>
  );
}

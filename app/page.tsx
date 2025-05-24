// import Image from "next/image";
import { BlogPosts } from "@/app/components/Posts";
import { Inter } from "next/font/google";
import { FeaturedPost } from "@/app/components/Featured";
import { BlogPostsBottom } from "./components/PostsBottom";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  return (
    <main className={`${inter.className} dark:text-white`}>
      <BlogPosts />
      <FeaturedPost />
      <BlogPostsBottom />
    </main>
  );
}

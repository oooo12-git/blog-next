import Image from "next/image";
import { featuredData } from "@/app/blog/utils";
import Link from "next/link";

const featuredMetadata = featuredData("featured");

export function FeaturedPost() {
  return (
    <Link href={`/blog/${featuredMetadata.slug}`}>
      <div className="flex justify-between py-7">
        <div className="relative w-[250px] h-[250px]">
          <Image
            src={
              featuredMetadata.metadata.image || "/images/default-featured.jpg"
            } // public 폴더는 Next.js에서 정적 파일을 제공하는 특별한 폴더입니다. 이 폴더 안의 파일들은 웹사이트의 루트 경로(/)에서 직접 접근할 수 있습니다.
            alt="Featured post image"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="w-[350px] h-[250px] flex flex-col gap-2">
          <h2 className="text-base font-semibold">Featured</h2>
          <p className="text-base font-light">
            {featuredMetadata.metadata.title}
          </p>
          <p className="text-xs font-light text-neutral-500">3 min read</p>
          <p className="text-xs font-light">
            {featuredMetadata.metadata.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}

import Image from "next/image";
import { Link } from "../../i18n/navigation";
import { getPost } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export async function FeaturedPost({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const featuredMetadata = await getPost("featured", locale);
  const t = await getTranslations("home");

  return (
    <Link href={`/blog/${featuredMetadata.slug}`}>
      <div className="flex justify-between py-7">
        <div className="relative w-[250px] h-[250px]">
          <Image
            src={
              featuredMetadata.metadata.heroImage ||
              "/images/default-featured.jpg"
            } // public 폴더는 Next.js에서 정적 파일을 제공하는 특별한 폴더입니다. 이 폴더 안의 파일들은 웹사이트의 루트 경로(/)에서 직접 접근할 수 있습니다.
            alt="Featured post image"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="w-[430px] h-[250px] flex flex-col gap-2">
          <h2 className="text-base font-semibold">{t("featured")}</h2>
          <p className="text-base font-light">
            {featuredMetadata.metadata.title}
          </p>
          <p className="text-xs font-light text-neutral-500">
            {t("timeToRead1")}
            {featuredMetadata.metadata.timeToRead}
            {t("timeToRead2")}
          </p>
          <p className="text-xs font-light">
            {featuredMetadata.metadata.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

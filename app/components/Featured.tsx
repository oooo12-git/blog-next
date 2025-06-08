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
  const featuredMetadata = await getPost("quarto-blog", locale);
  const t = await getTranslations("home");

  return (
    <Link href={`/blog/${featuredMetadata.slug}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between py-4 sm:py-7 space-y-4 sm:space-y-0 p-3 sm:p-0 rounded-lg transition-colors">
        <div className="relative w-full h-48 sm:w-[250px] sm:h-[250px] flex-shrink-0">
          <Image
            src={
              featuredMetadata.metadata.heroImage ||
              "/images/default-featured.jpg"
            }
            alt="Featured post image"
            fill
            className="object-cover rounded-md"
            priority
          />
        </div>
        <div className="w-full sm:w-[430px] sm:h-[250px] flex flex-col gap-3 sm:gap-2">
          <h2 className="text-lg sm:text-base font-semibold">
            {t("featured")}
          </h2>
          <p className="text-base font-light line-clamp-2 sm:line-clamp-none dark:hover:text-gray-400">
            {featuredMetadata.metadata.title}
          </p>
          <p className="text-sm sm:text-xs font-light text-neutral-500 dark:text-neutral-300 dark:hover:text-gray-400">
            {t("timeToRead1")}
            {featuredMetadata.metadata.timeToRead}
            {t("timeToRead2")}
          </p>
          <p className="text-sm sm:text-xs font-light text-neutral-600 dark:text-neutral-400 line-clamp-3 sm:line-clamp-none dark:hover:text-gray-400">
            {featuredMetadata.metadata.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

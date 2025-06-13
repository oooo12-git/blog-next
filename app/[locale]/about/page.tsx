import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import profileLight from "./김재현_about_light.jpeg";
import profileDark from "./김재현_about_dark.jpeg";
import Link from "next/link";

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <div className="flex flex-col sm:flex-row justify-between px-4">
      <div className="my-2 dark:text-white sm:w-[350px]">
        <h2 className="mb-4 text-2xl font-bold">{t("title")}</h2>
        {/* locale : ko - 경력  */}
        {locale === "ko" && (
          <div className="text-sm rounded-lg bg-[#ECEAEA] dark:bg-gray-800 p-2 border border-black mb-4">
            <h3 className="font-medium text-xl mb-2 text-black dark:text-white">
              경력
            </h3>
            <ul className="font-normal list-disc list-outside pl-4 space-y-1">
              <li>스튜디오 예약 시스템 개발 (2024.09 ~ 진행중)</li>
              <li>
                <Link
                  href="https://blog.naver.com/PostView.naver?blogId=n_cloudplatform&logNo=223790788385"
                  target="_blank"
                  className="text-gray-600 hover:underline hover:text-black dark:text-neutral-300 dark:hover:text-white"
                >
                  RAG 활용 재무 보고서 챗봇 개발
                </Link>
                (2024.10 ~ 2025.01)
              </li>
              <li>광고 데이터 분석 (2019.09 ~ 2022.09)</li>
            </ul>
          </div>
        )}
        {/* locale : en - 경력  */}
        {locale === "en" && (
          <div className="text-sm rounded-lg bg-[#ECEAEA] dark:bg-gray-800 p-2 border border-black mb-4">
            <h3 className="font-medium text-xl mb-2 text-black dark:text-white">
              Experience
            </h3>
            <ul className="font-normal list-disc list-outside pl-4 space-y-1">
              <li>Studio Reservation System Development (2024.09 ~ Ongoing)</li>
              <li>
                <Link
                  href="https://blog.naver.com/PostView.naver?blogId=n_cloudplatform&logNo=223790788385"
                  target="_blank"
                  className="text-gray-600 hover:underline hover:text-black dark:text-neutral-300 dark:hover:text-white"
                >
                  RAG-based Financial Report Chatbot Development
                </Link>
                (2024.10 ~ 2025.01)
              </li>
              <li>Advertising Data Analysis (2019.09 ~ 2022.09)</li>
            </ul>
          </div>
        )}
        <ul className="my-2 list-disc list-outside pl-4 font-normal">
          <li>
            <p className="inline">{t("education")}</p>
          </li>
          <li>
            <p className="inline">{t("experience")}</p>
          </li>
          <li>
            <p className="inline">{t("training")}</p>
          </li>
          <li>
            <p className="inline">{t("skills")}</p>
          </li>
          <li>
            <p className="inline">{t("certificates")}</p>
          </li>
        </ul>
      </div>
      <div className="w-[200px] sm:w-[300px]">
        <Image
          src={profileLight}
          alt="profile"
          className="mr-3 rounded-lg dark:hidden"
        />
        <Image
          src={profileDark}
          alt="profile"
          className="mr-3 rounded-lg hidden dark:block"
        />
      </div>
    </div>
  );
}

import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="px-4 my-2 sm:px-4 dark:text-white">
      <h2 className="text-2xl font-bold">{t("title")}</h2>
      <ul className="my-2 ml-4 list-disc list-inside">
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
  );
}

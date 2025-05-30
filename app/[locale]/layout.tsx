import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";

import "@/app/globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
// import ThemeProvider from "@/theme/theme-provider";

// 메타데이터는 별도의 파일이나 레이아웃 외부에 정의해야 합니다
// 클라이언트 컴포넌트에서는 직접 메타데이터를 내보낼 수 없습니다
const metadata = {
  title: "김재현",
  description: "김재현의 블로그",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className="dark:bg-black">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <div className="max-w-[700px] mx-auto">
          {/* mx-auto : 좌우 여백 동일 */}
          {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
          <NextIntlClientProvider>
            {/* NextIntlClientProvider: React의 Context API를 사용하여 번역 데이터와 로케일 정보를 하위 컴포넌트들에게 전달 */}
            {/* 서버 컴포넌트에서 NextIntlClientProvider를 렌더링할 때 다음 props들이 자동으로 상속 */}
            {/* 참고: https://next-intl.dev/docs/usage/configuration#nextintlclientprovider */}
            <Navbar />
            {children}
            <Footer />
          </NextIntlClientProvider>
          {/* </ThemeProvider> */}
        </div>
      </body>
    </html>
  );
}

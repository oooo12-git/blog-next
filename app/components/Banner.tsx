import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Banner() {
  return (
    <div className="p-3 overflow-hidden border-b-1">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          <CarouselItem className="basis-1/2">
            <Link href="https://jeongcheogi.edugamja.com/" target="_blank">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-2 md:p-1">
                    <Image
                      src="/banner/jcg-gamja-logo.webp"
                      alt="정처기 감자 로고"
                      width={50}
                      height={50}
                    />
                    <p className="text-lg md:text-xl font-normal">
                      정처기 감자
                    </p>
                  </CardContent>
                </Card>
              </div>
            </Link>
          </CarouselItem>
          <CarouselItem className="basis-1/2">
            <Link href="https://mailecho.kimjaahyun.com/" target="_blank">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-2">
                    <Image
                      src="/banner/mail-echo-for-gmail_only_logo.webp"
                      alt="mail-echo-for-gmail_only_logo"
                      width={50}
                      height={50}
                    />
                    <p className="text-sm py-1 md:text-lg font-normal ml-2 md:ml-2">
                      Mail Echo <br className="md:hidden" /> for Gmail
                    </p>
                  </CardContent>
                </Card>
              </div>
            </Link>
          </CarouselItem>
          {/* <CarouselItem className="basis-1/2">
            <Link
              href="https://www.kimjaahyun.com/ko/blog/jeongcheogi-practical-exam-review-2025-2"
              target="_blank"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-2 md:p-6">
                    <p className="text-center text-xl md:text-2xl font-semibold mt-1 md:mt-3">
                      2회 리뷰
                    </p>
                    <Image
                      src="/main/eureka_gamza.webp"
                      alt="25년 2회 리뷰"
                      width={150}
                      height={150}
                    />
                  </CardContent>
                </Card>
              </div>
            </Link>
          </CarouselItem> */}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

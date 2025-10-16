import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface HorizonBannerProps {
  href: string;
  leftImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  rightImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  text: React.ReactNode;
  className?: string;
  cardClassName?: string;
}

export default function HorizonBanner({
  href,
  leftImage,
  rightImage,
  text,
  className = "",
  cardClassName = "",
}: HorizonBannerProps) {
  return (
    <div className={`flex justify-center my-2 ${className}`}>
      <Link href={href} passHref className="w-auto">
        <Card className={`!py-1 bg-amber-50 dark:bg-amber-900 !w-auto ${cardClassName}`}>
          <div className="flex justify-center items-center gap-2 mx-5">
            {leftImage && (
              <Image
                src={leftImage.src}
                alt={leftImage.alt}
                width={leftImage.width || 50}
                height={leftImage.height || 50}
              />
            )}
            <div className="text-2xl md:text-xl font-medium">
              {text}
            </div>
            {rightImage && (
              <Image
                src={rightImage.src}
                alt={rightImage.alt}
                width={rightImage.width || 50}
                height={rightImage.height || 50}
              />
            )}
          </div>
        </Card>
      </Link>
    </div>
  );
}

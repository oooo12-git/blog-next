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
    mobileWidth?: number;
    mobileHeight?: number;
    mdWidth?: number;
    mdHeight?: number;
  };
  rightImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    mobileWidth?: number;
    mobileHeight?: number;
    mdWidth?: number;
    mdHeight?: number;
  };
  text: React.ReactNode;
  className?: string;
  cardClassName?: string;
  openInNewTab?: boolean;
}

export default function HorizonBanner({
  href,
  leftImage,
  rightImage,
  text,
  className = "",
  cardClassName = "",
  openInNewTab = false,
}: HorizonBannerProps) {
  return (
    <div className={`flex justify-center my-2 ${className}`}>
      <Link 
        href={href} 
        passHref 
        className="w-auto"
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
      >
        <Card className={`!py-1 bg-amber-50 dark:bg-amber-900 !w-auto ${cardClassName}`}>
          <div className="flex justify-center items-center gap-2 mx-5">
            {leftImage && (
              <Image
                src={leftImage.src}
                alt={leftImage.alt}
                width={leftImage.mobileWidth || leftImage.width || 50}
                height={leftImage.mobileHeight || leftImage.height || 50}
                className={`md:w-[${leftImage.mdWidth || leftImage.width || 50}px] md:h-[${leftImage.mdHeight || leftImage.height || 50}px]`}
              />
            )}
            <div className="!text-base md:text-xl font-medium">
              {text}
            </div>
            {rightImage && (
              <Image
                src={rightImage.src}
                alt={rightImage.alt}
                width={rightImage.mobileWidth || rightImage.width || 50}
                height={rightImage.mobileHeight || rightImage.height || 50}
                className={`md:w-[${rightImage.mdWidth || rightImage.width || 50}px] md:h-[${rightImage.mdHeight || rightImage.height || 50}px]`}
              />
            )}
          </div>
        </Card>
      </Link>
    </div>
  );
}

import Image from "next/image";
import { ImageProps } from "next/image";

interface ImageWithCaptionProps extends Omit<ImageProps, "alt"> {
  alt: string;
  caption?: string;
  showCaption?: boolean;
}

export default function ImageWithCaption({
  alt,
  caption,
  showCaption = true,
  style,
  src,
  ...props
}: ImageWithCaptionProps) {
  const captionText = caption || alt;

  // import된 이미지 객체인지 확인
  const isImportedImage =
    typeof src === "object" && src !== null && "src" in src;

  if (isImportedImage) {
    // import된 이미지의 경우 - 자동으로 width/height 감지
    return (
      <figure className="my-8 text-center">
        <Image
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-lg shadow-lg dark:shadow-2xl dark:shadow-gray-800"
          style={style}
          {...props}
        />
        {showCaption && captionText && (
          <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic leading-6">
            {captionText}
          </figcaption>
        )}
      </figure>
    );
  }

  // 문자열 src의 경우 - fill 사용
  return (
    <figure className="my-8 text-center">
      <div
        className="relative w-full aspect-video max-w-full mx-auto"
        style={style}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain rounded-lg shadow-lg dark:shadow-2xl dark:shadow-gray-800"
          {...props}
        />
      </div>
      {showCaption && captionText && (
        <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic leading-6">
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}

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
      <figure style={{ margin: "2rem 0", textAlign: "center" }}>
        <Image
          src={src}
          alt={alt}
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            ...style,
          }}
          {...props}
        />
        {showCaption && captionText && (
          <figcaption
            style={{
              marginTop: "0.75rem",
              fontSize: "0.875rem",
              color: "#6b7280",
              fontStyle: "italic",
              lineHeight: "1.5",
            }}
          >
            {captionText}
          </figcaption>
        )}
      </figure>
    );
  }

  // 문자열 src의 경우 - fill 사용
  return (
    <figure style={{ margin: "2rem 0", textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9", // 기본 비율
          maxWidth: "100%",
          margin: "0 auto",
          ...style,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{
            objectFit: "contain",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          {...props}
        />
      </div>
      {showCaption && captionText && (
        <figcaption
          style={{
            marginTop: "0.75rem",
            fontSize: "0.875rem",
            color: "#6b7280",
            fontStyle: "italic",
            lineHeight: "1.5",
          }}
        >
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}

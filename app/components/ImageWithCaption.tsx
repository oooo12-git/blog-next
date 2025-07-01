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

  // By removing the conditional logic for remote images (string src) that used 'fill'
  // and a fixed aspect ratio container, we now have a single, consistent implementation.
  // This component now relies on Next.js's default behavior.
  // For locally imported images, width and height are determined automatically.
  // For remote images (string src), 'width' and 'height' props must be provided
  // to prevent layout shift and ensure the image is displayed correctly.
  // This change makes the container size adapt to the actual image dimensions.
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
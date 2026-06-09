import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className = 'h-10 w-10' }: ProductImageProps) {
  if (!src) {
    return (
      <div className={`${className} rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0`}>
        <Package className="h-5 w-5 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} rounded-md object-cover flex-shrink-0`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = target.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = 'flex';
      }}
    />
  );
}

export function ProductImageWithFallback({ src, alt, className = 'h-10 w-10' }: ProductImageProps) {
  return (
    <div className="relative inline-flex">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${className} rounded-md object-cover flex-shrink-0`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : null}
      {(!src) && (
        <div className={`${className} rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0`}>
          <Package className="h-5 w-5 text-gray-400" />
        </div>
      )}
    </div>
  );
}

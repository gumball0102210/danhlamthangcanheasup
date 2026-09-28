import React, { useState } from 'react';
import { Compass, Image as ImageIcon, MapPin } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  theme?: string;
  aspectRatioClass?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt = 'Hình ảnh danh lam thắng cảnh',
  className = '',
  fallbackTitle,
  fallbackSubtitle,
  theme = 'parchment',
  aspectRatioClass = 'aspect-video',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Return fallback if error or if no source
  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950 text-stone-100 ${aspectRatioClass} ${className}`}
      >
        {/* Decorative artistic topographical background rings */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-full h-full stroke-current" fill="none">
            <circle cx="200" cy="200" r="60" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="200" cy="200" r="110" strokeWidth="1" />
            <circle cx="200" cy="200" r="160" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="200" cy="200" r="210" strokeWidth="1" />
            <path d="M 50,200 Q 150,120 200,200 T 350,200" strokeWidth="1.5" />
            <path d="M 30,260 Q 160,210 240,260 T 380,240" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-sm px-4">
          <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-stone-900/60 flex items-center justify-center mb-3 shadow-lg">
            <Compass className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <span className="text-base font-serif font-medium text-stone-100 tracking-wide line-clamp-2">
            {fallbackTitle || alt || 'Danh Thắng Di Sản'}
          </span>
          {fallbackSubtitle && (
            <span className="text-xs text-stone-400 mt-1 flex items-center gap-1 font-sans">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {fallbackSubtitle}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-stone-200/50 dark:bg-stone-800/50 ${aspectRatioClass} ${className}`}>
      {/* Skeleton / Blur placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-stone-400 opacity-40" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

// components/ImageCard.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "../../lib/utils";


export  function ImageCard({ images = [], name }: { images?: any[]; name?: string }) {
  // ✅ Always call hooks, even if images is empty
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Images container */}
      <div
        className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
        onScroll={(e) => {
          const index = Math.round(
            e.currentTarget.scrollLeft / e.currentTarget.clientWidth
          );
          setCurrentIndex(index);
        }}
      >
        {hasImages ? (
          images.map((img, i) => (
            <div key={i} className="relative w-full h-60 flex-shrink-0 snap-center">
              <Image
                src={img.attachment_url}
                alt={name || "Product image"}
                fill
                className="object-cover"
                unoptimized={img.attachment_url?.includes('cloudfront.net') || false}
              />
            </div>
          ))
        ) : (
          <div className="w-full h-60 bg-gray-200 flex items-center justify-center">
            No image
          </div>
        )}
      </div>

      {/* Dots indicator */}
      {hasImages && (
        <div className="absolute bottom-10 w-full flex justify-center space-x-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === currentIndex ? "bg-white" : "bg-gray-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

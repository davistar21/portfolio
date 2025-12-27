"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  node?: unknown; // react-markdown passes a node prop that we should accept but not pass to DOM
}

export default function MarkdownImage({
  src,
  alt,
  title,
  node, // destructure node to prevent it from leaking into ...props if we used them (though currently we don't)
  ...props
}: MarkdownImageProps) {
  if (!src) return null;

  // Pattern matching: Check alt text or title for directives
  const isCard = alt?.includes("#card") || title?.includes("#card");
  const isFloatLeft =
    alt?.includes("#float-left") || title?.includes("#float-left");
  const isFloatRight =
    alt?.includes("#float-right") || title?.includes("#float-right");
  const isShowcase = alt?.includes("#showcase") || title?.includes("#showcase");

  // Clean the caption by removing the directive
  const caption = alt
    ?.replace(/#(card|float-left|float-right|showcase)/g, "")
    .trim();

  // 1. CARD LAYOUT
  if (isCard) {
    return (
      <div className="my-10 relative group overflow-hidden rounded-2xl shadow-xl border border-border bg-card">
        <div className="relative">
          <img
            src={src}
            alt={caption || ""}
            className="w-full h-auto object-cover max-h-[600px] aspect-[16/9]"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

          {/* Caption on top of image */}
          {caption && (
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <p className="text-white text-lg md:text-xl font-bold leading-tight">
                {caption}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. FLOAT LEFT
  if (isFloatLeft) {
    return (
      <span className="float-left mr-8 mb-4 w-1/2 md:w-1/3 relative group">
        <img
          src={src}
          alt={caption || ""}
          className="w-full h-auto object-cover rounded-xl shadow-lg border border-border/50 transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {caption && (
          <span className="block mt-2 text-xs text-muted-foreground border-l-2 border-primary pl-2">
            {caption}
          </span>
        )}
      </span>
    );
  }

  // 3. FLOAT RIGHT (New)
  if (isFloatRight) {
    return (
      <span className="float-right ml-8 mb-4 w-1/2 md:w-1/3 relative group">
        <img
          src={src}
          alt={caption || ""}
          className="w-full h-auto object-cover rounded-xl shadow-lg border border-border/50 transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {caption && (
          <span className="block mt-2 text-xs text-muted-foreground text-right border-r-2 border-primary pr-2">
            {caption}
          </span>
        )}
      </span>
    );
  }

  // 4. SHOWCASE (New Custom Layout)
  // A "Polaroid" style or focused frame with a nice glassmorphism background
  if (isShowcase) {
    return (
      <div className="my-16 flex flex-col items-center">
        <div className="relative p-2 rounded-2xl bg-gradient-to-br from-primary/20 via-background to-secondary/20 shadow-2xl">
          <div className="rounded-xl overflow-hidden bg-background">
            <img
              src={src}
              alt={caption || ""}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>
        </div>
        {caption && (
          <p className="mt-4 text-center font-medium text-primary tracking-wide uppercase text-xs">
            — {caption} —
          </p>
        )}
      </div>
    );
  }

  // 5. DEFAULT
  return (
    <div className="my-8">
      <img
        src={src}
        alt={caption || ""}
        className={cn(
          "max-w-full h-auto rounded-lg shadow-md mx-auto border border-border/50",
          props.className // merge existing classes
        )}
      />
      {caption && (
        <p className="text-center text-sm text-muted-foreground mt-2 opacity-80">
          {caption}
        </p>
      )}
    </div>
  );
}

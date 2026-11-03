import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Play, X } from 'lucide-react';

type AnimationStyle =
  | 'from-bottom'
  | 'from-center'
  | 'from-top'
  | 'fade';

export interface HeroVideoDialogProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
}

const animationVariants = {
  'from-bottom': {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
  'from-center': {
    initial: { scale: 0.7, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.7, opacity: 0 },
  },
  'from-top': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export function HeroVideoDialog({
  animationStyle = 'from-center',
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = 'Video thumbnail',
  className = '',
}: HeroVideoDialogProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-md select-none"
        onClick={() => setIsVideoOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          className="w-full transition-all duration-300 group-hover:brightness-[0.92] group-hover:scale-105 object-cover aspect-video"
        />

        {/* Backdrop vignette */}
        <div className="absolute inset-0 bg-radial-at-center from-black/20 via-black/40 to-black/75 group-hover:from-black/10 transition-colors" />

        {/* Pulse Ripple & Play Button */}
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring */}
            <span className="absolute inline-flex h-24 w-24 sm:h-28 sm:w-28 animate-ping rounded-full bg-blue-500/30 opacity-75 pointer-events-none" />

            {/* Frosted glass halo */}
            <div className="relative flex items-center justify-center rounded-full backdrop-blur-md size-20 sm:size-24 border border-white/50 bg-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-110">
              {/* Play gradient core */}
              <div className="flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-500 size-14 sm:size-16 rounded-full shadow-lg">
                <Play className="size-6 sm:size-7 text-white fill-white translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom preview banner badge */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs font-semibold text-[11px] border border-white/10">
            Click to watch lecture · HD
          </span>
          <span className="px-2 py-1 rounded-md bg-blue-600/90 font-mono text-[10px] font-bold">
            Interactive Video Dialog
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-4xl aspect-video mx-auto shadow-2xl rounded-2xl overflow-hidden border border-white/20 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-3 right-3 z-30 text-white/80 hover:text-white bg-black/70 hover:bg-black/90 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                aria-label="Close video"
              >
                <X className="size-5" />
              </button>

              <iframe
                src={videoSrc.includes('?') ? `${videoSrc}&autoplay=1` : `${videoSrc}?autoplay=1`}
                className="w-full h-full rounded-2xl"
                title={thumbnailAlt}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

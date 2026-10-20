import React, { useRef, useState, useEffect } from 'react';

interface ScrollDrivenTableProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: string;
}

export const ScrollDrivenTable: React.FC<ScrollDrivenTableProps> = ({
  children,
  className = '',
  minWidth = 'min-w-[540px]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidthPercent, setThumbWidthPercent] = useState(42);
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 1) {
      setHasOverflow(true);
      setScrollProgress(scrollLeft / maxScroll);
      const ratio = Math.max(0.25, Math.min(0.5, clientWidth / scrollWidth));
      setThumbWidthPercent(ratio * 100);
    } else {
      setHasOverflow(false);
      setScrollProgress(0);
    }
  };

  useEffect(() => {
    updateScroll();
    const handleResize = () => updateScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children]);

  return (
    <div className={`w-full max-w-full min-w-0 overflow-hidden ${className}`}>
      {/* Scrollable Container with horizontal scroll and hidden native scrollbars */}
      <div
        ref={containerRef}
        onScroll={updateScroll}
        className={`overflow-x-auto w-full max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${minWidth ? `[&>table]:${minWidth}` : ''}`}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>

      {/* Custom Scroll-Driven Indicator matching Dashboard */}
      {hasOverflow && (
        <div className="mt-3.5 mb-1 px-1">
          <div className="w-full h-1 sm:h-1.5 bg-slate-200/90 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-slate-500 rounded-full transition-all duration-75"
              style={{
                width: `${thumbWidthPercent}%`,
                marginLeft: `${scrollProgress * (100 - thumbWidthPercent)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

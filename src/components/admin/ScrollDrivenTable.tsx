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

  const updateScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(scrollLeft / maxScroll);
      const ratio = Math.max(0.3, Math.min(0.5, clientWidth / scrollWidth));
      setThumbWidthPercent(ratio * 100);
    } else {
      setScrollProgress(0);
    }
  };

  useEffect(() => {
    updateScroll();
    const handleResize = () => updateScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* Scrollable Container with horizontal scroll */}
      <div
        ref={containerRef}
        onScroll={updateScroll}
        className={`overflow-x-auto w-full ${minWidth ? `[&>table]:${minWidth}` : ''}`}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>

      {/* Mobile Scroll-Driven Indicator strictly matching reference image */}
      <div className="sm:hidden mt-3.5 mb-1 px-0.5">
        <div className="w-full h-1 bg-slate-200/90 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-slate-500 rounded-full transition-all duration-75"
            style={{
              width: `${thumbWidthPercent}%`,
              marginLeft: `${scrollProgress * (100 - thumbWidthPercent)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

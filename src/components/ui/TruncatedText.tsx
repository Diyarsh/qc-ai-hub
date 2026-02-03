import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TruncatedTextProps {
  children: React.ReactNode;
  className?: string;
  tooltipContent?: string;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  children,
  className,
  tooltipContent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [text, setText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const checkTruncation = () => {
      if (containerRef.current) {
        // Find the actual text element (CardTitle or CardDescription)
        const textElement = containerRef.current.querySelector('h3, p') as HTMLElement;
        if (textElement) {
          // Check if text is truncated (either horizontally or vertically)
          const scrollWidth = textElement.scrollWidth;
          const clientWidth = textElement.clientWidth;
          const scrollHeight = textElement.scrollHeight;
          const clientHeight = textElement.clientHeight;
          const isTextTruncated = 
            scrollWidth > clientWidth + 2 || 
            scrollHeight > clientHeight + 2;
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/1ab568ca-a1b0-4bda-bd04-b9fc7e5c6344',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TruncatedText.tsx:checkTruncation',message:'Truncation check',data:{scrollWidth,clientWidth,scrollHeight,clientHeight,isTextTruncated,textContent:textElement.textContent?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          setIsTruncated(isTextTruncated);
          setText(textElement.textContent || "");
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/1ab568ca-a1b0-4bda-bd04-b9fc7e5c6344',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TruncatedText.tsx:checkTruncation',message:'Text element not found',data:{hasContainer:!!containerRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
        }
      }
    };

    // Check after a delay to ensure DOM is ready and styles are applied
    const timeoutId = setTimeout(checkTruncation, 300);
    // Also check when content changes
    const observer = new ResizeObserver(checkTruncation);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener("resize", checkTruncation);
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener("resize", checkTruncation);
    };
  }, [children]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/1ab568ca-a1b0-4bda-bd04-b9fc7e5c6344',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TruncatedText.tsx:handleMouseEnter',message:'Mouse enter event',data:{isTruncated,hasTooltipContent:!!tooltipContent,hasText:!!text},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    if (isTruncated && (tooltipContent || text)) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        top: rect.top - 10,
        left: rect.left + rect.width / 2
      };
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/1ab568ca-a1b0-4bda-bd04-b9fc7e5c6344',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TruncatedText.tsx:handleMouseEnter',message:'Setting tooltip position',data:{position,rect:{top:rect.top,left:rect.left,width:rect.width,height:rect.height}},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setTooltipPosition(position);
      setShowTooltip(true);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/1ab568ca-a1b0-4bda-bd04-b9fc7e5c6344',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TruncatedText.tsx:handleMouseEnter',message:'showTooltip set to true',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/1ab568ca-a1b0-4bda-bd04-b9fc7e5c6344',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TruncatedText.tsx:handleMouseEnter',message:'Condition not met',data:{isTruncated,hasTooltipContent:!!tooltipContent,hasText:!!text},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if mouse is moving to tooltip
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (tooltipRef.current && tooltipRef.current.contains(relatedTarget)) {
      return; // Don't hide if moving to tooltip
    }
    // Add small delay to allow moving to tooltip
    setTimeout(() => {
      if (tooltipRef.current && !tooltipRef.current.matches(':hover')) {
        setShowTooltip(false);
      }
    }, 100);
  };

  const displayText = tooltipContent || text;
  const shouldShowTooltip = displayText && isTruncated;
  
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/1ab568ca-a1b0-4bda-bd04-b9fc7e5c6344',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TruncatedText.tsx:render',message:'Render state',data:{shouldShowTooltip,showTooltip,isTruncated,hasDisplayText:!!displayText,displayTextLength:displayText?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  }, [shouldShowTooltip, showTooltip, isTruncated, displayText]);
  
  useEffect(() => {
    if (shouldShowTooltip && showTooltip) {
      fetch('http://127.0.0.1:7242/ingest/1ab568ca-a1b0-4bda-bd04-b9fc7e5c6344',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TruncatedText.tsx:tooltip-effect',message:'Tooltip should render',data:{position:tooltipPosition,displayTextLength:displayText?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    }
  }, [shouldShowTooltip, showTooltip, tooltipPosition, displayText]);
  // #endregion

  return (
    <>
      <div 
        ref={containerRef} 
        className={cn(className, "w-full")} 
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full" style={{ cursor: shouldShowTooltip ? 'help' : 'default' }}>
          {children}
        </div>
      </div>
      {shouldShowTooltip && showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border whitespace-normal z-[9999]"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '300px'
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {displayText}
        </div>
      )}
    </>
  );
};

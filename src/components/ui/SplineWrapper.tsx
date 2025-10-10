'use client'

import { useEffect, useRef, useState } from 'react'

interface SplineWrapperProps {
  scene: string
  className?: string
}

export function SplineWrapper({ scene, className }: SplineWrapperProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      setIsLoading(false)
      
      // Remove watermarks after iframe loads
      setTimeout(() => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
          if (iframeDoc) {
            // Remove watermark elements
            const watermarkSelectors = [
              '.spline-watermark',
              '[class*="watermark"]',
              '[class*="spline-brand"]',
              '[id*="watermark"]',
              '[id*="spline-brand"]',
              '[class*="built-with"]',
              '[id*="built-with"]',
              '[class*="powered-by"]',
              '[id*="powered-by"]',
              '[class*="spline-logo"]',
              '[id*="spline-logo"]'
            ]
            
            watermarkSelectors.forEach(selector => {
              const elements = iframeDoc.querySelectorAll(selector)
              elements.forEach(el => el.remove())
            })

            // Add CSS to hide any remaining watermarks
            const style = iframeDoc.createElement('style')
            style.textContent = `
              .spline-watermark,
              [class*="watermark"],
              [class*="spline-brand"],
              [id*="watermark"],
              [id*="spline-brand"],
              [class*="built-with"],
              [id*="built-with"],
              [class*="powered-by"],
              [id*="powered-by"],
              [class*="spline-logo"],
              [id*="spline-logo"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
              }
            `
            iframeDoc.head.appendChild(style)
          }
        } catch (error) {
          // Cross-origin restrictions might prevent access
          console.log('Cannot access iframe content due to CORS restrictions')
        }
      }, 1000)
    }

    iframe.addEventListener('load', handleLoad)
    return () => iframe.removeEventListener('load', handleLoad)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <span className="text-muted-foreground">Loading 3D Scene...</span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/spline/index.html"
        className="w-full h-full border-none"
        style={{ background: 'transparent' }}
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  )
}

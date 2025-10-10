'use client'

import { Suspense, lazy, useEffect, useRef } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Remove watermark elements after component mounts
    const removeWatermarks = () => {
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
        '[id*="spline-logo"]',
        '[class*="spline-credit"]',
        '[id*="spline-credit"]',
        // Additional selectors for Spline watermarks
        '[data-testid*="watermark"]',
        '[aria-label*="spline"]',
        '[title*="spline"]',
        'div[style*="position: fixed"]',
        'div[style*="bottom: 0"]',
        'div[style*="right: 0"]'
      ]
      
      watermarkSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => {
          // Check if element contains watermark text
          const text = el.textContent?.toLowerCase() || ''
          if (text.includes('built with') || text.includes('spline') || text.includes('powered by')) {
            if (el.parentNode) {
              el.parentNode.removeChild(el)
            }
          }
        })
      })
    }

    // Add global CSS to hide watermarks
    const style = document.createElement('style')
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
      [id*="spline-logo"],
      [class*="spline-credit"],
      [id*="spline-credit"],
      div[style*="position: fixed"][style*="bottom"],
      div[style*="position: fixed"][style*="right"],
      div[style*="position: absolute"][style*="bottom"],
      div[style*="position: absolute"][style*="right"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }
    `
    document.head.appendChild(style)

    // Remove watermarks immediately and on interval
    removeWatermarks()
    const interval = setInterval(removeWatermarks, 500)
    
    return () => {
      clearInterval(interval)
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative' }}>
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">Loading...</span>
          </div>
        }
      >
        <Spline
          scene={scene}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  )
}

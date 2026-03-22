'use client'

import React, { useRef } from "react"

import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { ReactNode, forwardRef } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'stagger'
  delay?: number
  duration?: number
}

const animations = {
  'fade-up': {
    initial: 'opacity-0 translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-in': {
    initial: 'opacity-0',
    visible: 'opacity-100',
  },
  'slide-left': {
    initial: 'opacity-0 translate-x-12',
    visible: 'opacity-100 translate-x-0',
  },
  'slide-right': {
    initial: 'opacity-0 -translate-x-12',
    visible: 'opacity-100 translate-x-0',
  },
  'scale-up': {
    initial: 'opacity-0 scale-95',
    visible: 'opacity-100 scale-100',
  },
  'stagger': {
    initial: 'opacity-0 translate-y-4',
    visible: 'opacity-100 translate-y-0',
  },
}

export const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  ({ children, className = '', animation = 'fade-up', delay = 0, duration = 700 }, forwardedRef) => {
    const divRef = useRef<HTMLDivElement>(null)
    const { isVisible, hasMounted } = useScrollAnimation({ threshold: 0.1 }, divRef as React.RefObject<HTMLElement | null>)

    const anim = animations[animation]
    
    // Before mount, render without animation classes to avoid hydration mismatch
    const animationClass = hasMounted ? (isVisible ? anim.visible : anim.initial) : anim.visible

    return (
      <div
        ref={(el) => {
          divRef.current = el
          if (typeof forwardedRef === 'function') {
            forwardedRef(el)
          } else if (forwardedRef) {
            forwardedRef.current = el
          }
        }}
        className={`
          transition-all ease-out
          ${animationClass}
          ${className}
        `}
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </div>
    )
  }
)

AnimatedSection.displayName = 'AnimatedSection'

interface AnimatedTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  staggerDelay?: number
}

export function AnimatedText({ 
  children, 
  className = '', 
  as: Component = 'p',
  staggerDelay = 30 
}: AnimatedTextProps) {
  const { ref, isVisible, hasMounted } = useScrollAnimation({ threshold: 0.2 })
  const words = children.split(' ')
  
  const wordClass = hasMounted 
    ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')
    : 'opacity-100 translate-y-0'

  return (
    <Component ref={ref as React.RefObject<HTMLParagraphElement>} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-500 ease-out ${wordClass}`}
          style={{ transitionDelay: hasMounted ? `${index * staggerDelay}ms` : '0ms' }}
        >
          {word}&nbsp;
        </span>
      ))}
    </Component>
  )
}

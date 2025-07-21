
"use client";

import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const springConfig = { damping: 30, stiffness: 500, mass: 0.2 };
  
  const mouse = {
    x: useSpring(0, springConfig),
    y: useSpring(0, springConfig),
  };
  
  const dot = {
    x: useSpring(0, { damping: 40, stiffness: 800, mass: 0.1 }),
    y: useSpring(0, { damping: 40, stiffness: 800, mass: 0.1 }),
  };

  useEffect(() => {
    if (isMobile) {
      document.body.classList.remove('cursor-none');
      return;
    }
    
    document.body.classList.add('cursor-none');
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x.set(e.clientX);
      mouse.y.set(e.clientY);
      dot.x.set(e.clientX);
      dot.y.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor-hover="true"]')) {
        gsap.to(ringRef.current, { scale: 1.5, opacity: 0.5, duration: 0.3 });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor-hover="true"]')) {
         gsap.to(ringRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isMobile, mouse.x, mouse.y, dot.x, dot.y]);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          translateX: mouse.x,
          translateY: mouse.y,
        }}
      />
      <motion.div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          translateX: dot.x,
          translateY: dot.y,
        }}
      />
    </>
  );
}

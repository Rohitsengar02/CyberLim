"use client";

import Link, { type LinkProps } from 'next/link';
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface MagneticLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export function MagneticLink({ children, className, ...props }: MagneticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const link = linkRef.current;
    const span = spanRef.current;
    if (!link || !span) return;

    // Use quickTo for a more performant and stable mouse-following animation
    const linkX = gsap.quickTo(link, 'x', { duration: 0.4, ease: 'power2.out' });
    const linkY = gsap.quickTo(link, 'y', { duration: 0.4, ease: 'power2.out' });
    const spanX = gsap.quickTo(span, 'x', { duration: 0.6, ease: 'power2.out' });
    const spanY = gsap.quickTo(span, 'y', { duration: 0.6, ease: 'power2.out' });

    // Timeline for the color change animation
    const tl = gsap.timeline({ paused: true });
    tl.to(link, {
      backgroundColor: '#ffffff',
      color: '#141414',
      duration: 0.2,
      ease: 'power2.inOut',
    });

    const handleMouseEnter = () => {
      tl.play();
    };

    const handleMouseLeave = () => {
      tl.reverse();
      // Animate the link and text back to their original positions with an elastic ease
      gsap.to(link, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      gsap.to(span, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = link.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      // Update positions using the quickTo functions
      linkX(x * 0.4);
      linkY(y * 0.4);
      spanX(x * 0.6);
      spanY(y * 0.7);
    };

    link.addEventListener('mouseenter', handleMouseEnter);
    link.addEventListener('mouseleave', handleMouseLeave);
    link.addEventListener('mousemove', handleMouseMove);

    return () => {
      link.removeEventListener('mouseenter', handleMouseEnter);
      link.removeEventListener('mouseleave', handleMouseLeave);
      link.removeEventListener('mousemove',handleMouseMove);
    };
  }, { scope: linkRef });

  return (
    <Link ref={linkRef} className={cn('relative rounded-md transition-none overflow-hidden', className)} {...props}>
      <span ref={spanRef} className="relative inline-block">{children}</span>
    </Link>
  );
}

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export const useFormAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Only animate if the ref is attached
    if (!containerRef.current) return;

    gsap.from('.anim-item', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: containerRef }); // Scope ensures we only animate items inside this container

  return containerRef;
};
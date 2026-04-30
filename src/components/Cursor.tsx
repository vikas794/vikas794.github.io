import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setIsFinePointer(isFine);
    if (!isFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .skill-card, .highlight-card, .cert-card, .exp-card, .contact-link')) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .skill-card, .highlight-card, .cert-card, .exp-card, .contact-link')) {
        setIsHovered(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    let animationFrameId: number;
    const animate = () => {
      // Smoothly update follower position
      followerPos.current = {
        x: followerPos.current.x + (mousePos.current.x - followerPos.current.x) * 0.12,
        y: followerPos.current.y + (mousePos.current.y - followerPos.current.y) * 0.12
      };

      // Direct DOM manipulation to bypass React render cycle
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isFinePointer) return null;

  return (
    <>
      <div 
        ref={cursorRef}
        className={`cursor ${isHovered ? "hovered" : ""}`} 
      ></div>
      <div 
        ref={followerRef}
        className={`cursor-follower ${isHovered ? "hovered" : ""}`} 
      ></div>
    </>
  );
}

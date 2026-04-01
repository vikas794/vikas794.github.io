import { useEffect, useState } from "react";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPos, setFollowerPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    setIsFinePointer(window.matchMedia("(pointer: fine)").matches);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
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

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;
    
    let animationFrameId: number;
    
    const animateFollower = () => {
      setFollowerPos(prev => ({
        x: prev.x + (position.x - prev.x) * 0.12,
        y: prev.y + (position.y - prev.y) * 0.12
      }));
      animationFrameId = requestAnimationFrame(animateFollower);
    };
    
    animationFrameId = requestAnimationFrame(animateFollower);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <>
      <div 
        className={`cursor ${isHovered ? "hovered" : ""}`} 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ></div>
      <div 
        className={`cursor-follower ${isHovered ? "hovered" : ""}`} 
        style={{ left: `${followerPos.x}px`, top: `${followerPos.y}px` }}
      ></div>
    </>
  );
}

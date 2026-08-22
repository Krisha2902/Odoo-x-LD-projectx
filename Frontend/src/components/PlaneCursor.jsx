import React, { useEffect, useState, useRef } from "react";

export default function PlaneCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [angle, setAngle] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const prevPos = useRef({ x: 0, y: 0 });
  const animFrameId = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setIsVisible(true);

      const dx = x - prevPos.current.x;
      const dy = y - prevPos.current.y;

      // Only update angle if there is noticeable movement
      if (Math.hypot(dx, dy) > 2) {
        // Math.atan2 gives angle in radians. Convert to degrees.
        // SVG plane points UP (0 deg), so add 90 deg offset.
        const newAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        setAngle(newAngle);
      }

      prevPos.current = { x, y };

      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      animFrameId.current = requestAnimationFrame(() => {
        setPosition({ x, y });
      });
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-100 ease-out"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${
          isClicked ? 0.8 : 1
        })`,
      }}
    >
      {/* Dynamic Glowing Jet Airplane - High Contrast across light & dark backgrounds */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Engine Aura Glow */}
        <div className="absolute w-8 h-8 rounded-full bg-cyan-400/40 blur-md animate-pulse pointer-events-none" />

        {/* High-visibility Jet SVG with crisp white stroke & vibrant cyan fill */}
        <svg
          className="w-8 h-8 drop-shadow-[0_0_12px_rgba(0,240,255,0.9)] text-cyan-400"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </div>
    </div>
  );
}

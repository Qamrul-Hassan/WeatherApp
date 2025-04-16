"use client"; // Ensure this is a Client Component
import { useEffect, useRef } from "react";

const SunnyAnimation = () => {
  const sunRef = useRef(null);

  useEffect(() => {
    const animateSun = () => {
      // Apply continuous rotation
      if (sunRef.current) {
        sunRef.current.style.animation = "spin 20s linear infinite";
      }
    };
    animateSun();
  }, []);

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      {/* Sun  color */}
      <div
        ref={sunRef}
        className="w-24 h-24 bg-yellow-200 rounded-full shadow-3xl"
        style={{
          boxShadow: "0 0 50px 20px rgba(255, 223, 0, 0.5)",
        }}
      >
        {/* Sun Rays with 3D Effect and Gradient */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-20 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-60px)`,
              background: `linear-gradient(45deg, rgba(255, 223, 0, 0.9), rgba(255, 165, 0, 0.9), rgba(255, 69, 0, 0.9))`,
              boxShadow: `0 0 40px rgba(255, 165, 0, 0.8), 0 0 50px rgba(255, 69, 0, 0.5)`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SunnyAnimation;

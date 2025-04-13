"use client"; // Ensure this is a Client Component
import { useEffect, useRef } from "react";

const SunnyAnimation = () => {
  const sunRef = useRef(null);

  useEffect(() => {
    const animateSun = () => {
      if (sunRef.current) {
        const time = Date.now() / 1000; // Slow animation
        sunRef.current.style.transform = `rotate(${time * 10}deg)`; // Rotate sun rays
        requestAnimationFrame(animateSun);
      }
    };
    animateSun();
  }, []);

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      {/* Sun */}
      <div
        ref={sunRef}
        className="w-24 h-24 bg-yellow-400 rounded-full shadow-2xl"
        style={{
          boxShadow: "0 0 50px 20px rgba(255, 223, 0, 0.5)",
        }}
      >
        {/* Sun Rays */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-12 bg-yellow-400 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-60px)`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SunnyAnimation;
"use client"; // Ensure this is a Client Component
import { useEffect, useRef } from "react";

const RainAnimation = () => {
  const rainContainerRef = useRef(null);

  useEffect(() => {
    const createRaindrop = () => {
      const raindrop = document.createElement("div");
      raindrop.className = "raindrop";
      raindrop.style.left = `${Math.random() * 100}%`;
      raindrop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`; // Random speed
      rainContainerRef.current.appendChild(raindrop);

      // Remove raindrop after animation ends
      raindrop.addEventListener("animationend", () => {
        raindrop.remove();
      });
    };

    const interval = setInterval(createRaindrop, 100); // Create raindrops every 100ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={rainContainerRef} className="absolute inset-0 overflow-hidden">
      {/* CSS for Raindrop Animation */}
      <style jsx>{`
        .raindrop {
          position: absolute;
          width: 2px;
          height: 10px;
          background: rgba(173, 216, 230, 0.8);
          animation: fall linear infinite;
        }
        @keyframes fall {
          0% {
            transform: translateY(-10%);
          }
          100% {
            transform: translateY(110%);
          }
        }
      `}</style>
    </div>
  );
};

export default RainAnimation;
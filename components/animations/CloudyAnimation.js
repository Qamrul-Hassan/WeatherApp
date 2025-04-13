"use client";
import { useEffect, useRef } from "react";

const CloudyAnimation = () => {
  const cloudRefs = useRef([]);

  useEffect(() => {
    let animationFrameId;

    const animateClouds = () => {
      const time = Date.now() / 1000;

      cloudRefs.current.forEach((cloud, index) => {
        if (cloud) {
          const speed = 20 + index * 10;
          const width = window.innerWidth + 400; // Buffer space for smooth transition
          const offset = (time * speed) % width;

          cloud.style.transform = `translateX(${offset - 200}px)`; // Start from -200 and loop around
        }
      });

      animationFrameId = requestAnimationFrame(animateClouds);
    };

    animateClouds();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const cloudBase =
    "absolute rounded-full opacity-100 shadow-[0_6px_20px_rgba(0,0,0,0.3)] pointer-events-none will-change-transform";

  return (
    <div className="relative w-full h-48 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
      {/* Cloud 1 - White */}
      <div
        ref={(el) => (cloudRefs.current[0] = el)}
        className={`${cloudBase} w-56 h-28 bg-white`} // Cloud size fixed for all devices
        style={{
          top: "10%",
          left: "-200px", // Start cloud off-screen to the left
        }}
        aria-hidden="true"
      >
        <div className="absolute w-24 h-24 bg-white rounded-full top-[-25px] left-6" />
        <div className="absolute w-28 h-28 bg-white rounded-full top-[-30px] right-4" />
      </div>

      {/* Cloud 2 - Light Gray */}
      <div
        ref={(el) => (cloudRefs.current[1] = el)}
        className={`${cloudBase} w-60 h-32 bg-gray-200`} // Cloud size fixed for all devices
        style={{
          top: "20%",
          left: "-300px", // Start cloud off-screen to the left
        }}
        aria-hidden="true"
      >
        <div className="absolute w-28 h-28 bg-gray-200 rounded-full top-[-20px] left-6" />
        <div className="absolute w-32 h-32 bg-gray-200 rounded-full top-[-30px] right-4" />
      </div>

      {/* Cloud 3 - Medium Gray */}
      <div
        ref={(el) => (cloudRefs.current[2] = el)}
        className={`${cloudBase} w-64 h-32 bg-gray-400`} // Cloud size fixed for all devices
        style={{
          top: "25%",
          left: "-400px", // Start cloud off-screen to the left
        }}
        aria-hidden="true"
      >
        <div className="absolute w-32 h-32 bg-gray-400 rounded-full top-[-25px] left-6" />
        <div className="absolute w-36 h-36 bg-gray-400 rounded-full top-[-35px] right-4" />
      </div>
    </div>
  );
};

export default CloudyAnimation;

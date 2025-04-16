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
          const width = window.innerWidth + 400;
          const offset = (time * speed) % width;

          cloud.style.transform = `translateX(${offset - 200}px)`;
        }
      });

      animationFrameId = requestAnimationFrame(animateClouds);
    };

    animateClouds();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const cloudBase =
    "absolute rounded-full opacity-100 pointer-events-none will-change-transform shadow-lg";

  return (
    <div className="relative w-full h-48 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
      {/* Stylized Cloud 1 */}
      <div
        ref={(el) => (cloudRefs.current[0] = el)}
        className={`${cloudBase} w-56 h-24 bg-gradient-to-b from-gray-300 to-gray-400`}
        style={{ top: "15%", left: "-200px" }}
        aria-hidden="true"
      >
        <div className="absolute w-20 h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full top-[-20px] left-4" />
        <div className="absolute w-24 h-24 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full top-[-25px] right-2" />
        <div className="absolute w-16 h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full top-0 left-1/2 transform -translate-x-1/2" />
      </div>

      {/* Stylized Cloud 2 */}
      <div
        ref={(el) => (cloudRefs.current[1] = el)}
        className={`${cloudBase} w-64 h-28 bg-gradient-to-b from-gray-400 to-gray-500`}
        style={{ top: "20%", left: "-300px" }}
        aria-hidden="true"
      >
        <div className="absolute w-24 h-24 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full top-[-25px] left-4" />
        <div className="absolute w-28 h-28 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full top-[-30px] right-2" />
        <div className="absolute w-20 h-20 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full top-0 left-1/2 transform -translate-x-1/2" />
      </div>

      {/* Stylized Cloud 3 */}
      <div
        ref={(el) => (cloudRefs.current[2] = el)}
        className={`${cloudBase} w-72 h-32 bg-gradient-to-b from-gray-500 to-gray-600`}
        style={{ top: "25%", left: "-400px" }}
        aria-hidden="true"
      >
        <div className="absolute w-28 h-28 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full top-[-30px] left-4" />
        <div className="absolute w-32 h-32 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full top-[-35px] right-2" />
        <div className="absolute w-24 h-24 bg-gradient-to-b from-gray-500 to-gray-600 rounded-full top-0 left-1/2 transform -translate-x-1/2" />
      </div>
    </div>
  );
};

export default CloudyAnimation;

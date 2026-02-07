"use client";

import { useMemo } from "react";

const RainAnimation = () => {
  const drops = useMemo(
    () =>
      Array.from({ length: 64 }).map((_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        delay: `${(index * 0.08).toFixed(2)}s`,
        duration: `${(0.9 + (index % 5) * 0.2).toFixed(2)}s`,
      })),
    []
  );

  return (
    <div className="scene scene-rain" aria-hidden="true">
      <div className="rain-cloud" />
      <div className="rain-field">
        {drops.map((drop) => (
          <span
            key={drop.id}
            className="raindrop"
            style={{ left: drop.left, animationDelay: drop.delay, animationDuration: drop.duration }}
          />
        ))}
      </div>
    </div>
  );
};

export default RainAnimation;

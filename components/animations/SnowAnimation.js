"use client";

import { useMemo } from "react";

const SnowAnimation = () => {
  const flakes = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, index) => ({
        id: index,
        left: `${(index * 23) % 100}%`,
        size: `${2 + (index % 4)}px`,
        delay: `${(index * 0.15).toFixed(2)}s`,
        duration: `${(3.4 + (index % 6) * 0.4).toFixed(2)}s`,
      })),
    []
  );

  return (
    <div className="scene scene-snow" aria-hidden="true">
      <div className="snow-field">
        {flakes.map((flake) => (
          <span
            key={flake.id}
            className="snowflake"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SnowAnimation;

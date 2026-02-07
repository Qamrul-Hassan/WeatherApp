"use client";

const SunnyAnimation = () => {
  return (
    <div className="scene scene-sunny" aria-hidden="true">
      <div className="sun-core" />
      <div className="sun-aura" />
      <div className="sun-rays">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="sun-ray"
            style={{ transform: `translate(-50%, -50%) rotate(${index * 30}deg) translateY(-68px)` }}
          />
        ))}
      </div>
    </div>
  );
};

export default SunnyAnimation;

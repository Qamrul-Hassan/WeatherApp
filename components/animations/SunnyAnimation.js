"use client";
const SunnyAnimation = () => {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <div
        className="w-24 h-24 bg-yellow-200 rounded-full shadow-3xl animate-spin"
        style={{
          animationDuration: "20s",
          boxShadow: "0 0 50px 20px rgba(255, 223, 0, 0.5)",
        }}
      >
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
          />
        ))}
      </div>
    </div>
  );
};

export default SunnyAnimation;

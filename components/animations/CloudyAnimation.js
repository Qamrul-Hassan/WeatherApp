"use client";

const CloudyAnimation = () => {
  return (
    <div className="scene scene-cloudy" aria-hidden="true">
      <div className="cloud-layer cloud-layer-back">
        <span className="cloud cloud-1" />
        <span className="cloud cloud-2" />
      </div>
      <div className="cloud-layer cloud-layer-front">
        <span className="cloud cloud-3" />
        <span className="cloud cloud-4" />
      </div>
    </div>
  );
};

export default CloudyAnimation;

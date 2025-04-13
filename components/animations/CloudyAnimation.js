import styled, { keyframes } from "styled-components";

// Randomized keyframe for cloud movement
const moveCloud = (duration) => keyframes`
  0% {
    transform: translateX(-100%) translateY(0) scale(1);
  }
  25% {
    transform: translateX(25%) translateY(-10px) scale(1.1);
  }
  50% {
    transform: translateX(50%) translateY(0) scale(1);
  }
  75% {
    transform: translateX(75%) translateY(10px) scale(1.1);
  }
  100% {
    transform: translateX(100%) translateY(0) scale(1);
  }
`;

// Base cloud styles
const CloudBase = styled.div`
  width: 120px;
  height: 70px;
  background: ${(props) => props.cloudColor || "#f0f0f0"};
  border-radius: 50%;
  position: relative;
  animation: ${(props) => moveCloud(props.duration)} ${(props) => props.duration}s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: ${(props) => props.cloudColor || "#f0f0f0"};
    border-radius: 50%;
  }

  &::before {
    width: 60px;
    height: 60px;
    top: -25px;
    left: 20px;
  }

  &::after {
    width: 80px;
    height: 80px;
    top: -40px;
    right: 15px;
  }
`;

// Dark cloud component with upside-down effect and floating from left to right
const DarkCloud = () => {
  const duration = Math.random() * 10 + 8; // Random duration between 8s and 18s
  const delay = Math.random() * 5; // Random delay between 0s and 5s
  return (
    <CloudBase
      cloudColor="#444444"
      duration={duration}
      delay={delay}
      style={{
        transform: "rotate(180deg)", // Upside down effect
        position: "absolute",
        top: "25%", // Position it vertically in the middle
        left: "50%", // Horizontally centered
        transformOrigin: "center", // Make sure it rotates from the center
      }}
    />
  );
};

// Cloud components with randomized animation duration and delay
const WhiteCloud = () => {
  const duration = Math.random() * 10 + 8; // Random duration between 8s and 18s
  const delay = Math.random() * 5; // Random delay between 0s and 5s
  return <CloudBase cloudColor="#ffffff" duration={duration} delay={delay} />;
};

const GrayCloud = () => {
  const duration = Math.random() * 10 + 8; // Random duration between 8s and 18s
  const delay = Math.random() * 5; // Random delay between 0s and 5s
  return <CloudBase cloudColor="#b0b0b0" duration={duration} delay={delay} />;
};

const CloudyAnimation = () => (
  <>
    <WhiteCloud />
    <GrayCloud />
    <DarkCloud /> {/* Dark cloud in the middle, upside-down */}
  </>
);

export default CloudyAnimation;

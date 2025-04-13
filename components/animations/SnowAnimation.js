const SnowAnimation = () => (
    <svg width="150" height="150" viewBox="0 0 150 150">
      {[...Array(20)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 150}
          cy={Math.random() * 150}
          r="2"
          fill="white"
          style={{
            animation: `fallSnow ${Math.random() * 2 + 1}s linear infinite`,
          }}
        />
      ))}
      <style>
        {`
          @keyframes fallSnow {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(150px);
            }
          }
        `}
      </style>
    </svg>
  );
  
  export default SnowAnimation;
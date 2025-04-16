import CloudyAnimation from "./CloudyAnimation";
import RainAnimation from "./RainAnimation";

export default function WeatherScene() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-200 to-sky-400 overflow-hidden">
      <CloudyAnimation />
      <RainAnimation />
    </div>
  );
}

import Weather from "../components/Weather";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200 px-4 sm:px-6 md:px-8 py-2">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-600 mb-8 text-center animate__animated animate__fadeIn">
        SkyCast Weather
      </h1>
      <div className="w-full max-w-4xl">
        <Weather />
      </div>
    </div>
  );
}

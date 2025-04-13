import Weather from "../components/Weather";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-4xl">
        <Weather />
      </div>
    </div>
  );
}

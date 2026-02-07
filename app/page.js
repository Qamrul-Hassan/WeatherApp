import Weather from "../components/Weather";

export default function Home() {
  return (
    <main className="app-shell">
      <div className="app-header">
        <p className="app-kicker">Real-Time Global Forecasting</p>
        <h1 className="app-title">SkyCast Weather</h1>
      </div>
      <div className="app-content">
        <Weather />
      </div>
    </main>
  );
}

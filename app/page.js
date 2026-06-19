import Weather from "../components/Weather";

export default function Home() {
  return (
    <main className="app-shell flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="app-header">
          <p className="app-kicker">Real-Time Global Forecasting</p>
          <h1 className="app-title">SkyCast Weather</h1>
        </div>
        <div className="app-content">
          <Weather />
        </div>
      </div>
      <footer className="mt-auto py-6 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500/80 border-t border-slate-200/20 dark:border-slate-800/30">
        <div className="mx-auto max-w-7xl px-4 flex flex-col gap-2 items-center justify-center sm:flex-row sm:justify-between">
          <p>© Copyright SkyCast Weather 2026. All rights reserved.</p>
          <p>Explore tools on <a href="https://costnest.site" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-500 transition-colors">CostNest</a></p>
        </div>
      </footer>
    </main>
  );
}

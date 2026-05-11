import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="relative min-h-screen">
      {/* Atmospheric Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest to-surface-container-high opacity-80"></div>
        <div className="absolute inset-0 topographic-bg"></div>
        {/* Soft glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
      </div>

      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-500 hover:backdrop-blur-2xl">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link to="/" className="font-display-lg text-headline-md font-bold text-primary">
              ETNO-IA Rural 2.0
            </Link>
          </div>

          {/* Indicators */}
          <div className="hidden md:flex items-center gap-6">
            {/* Ollama Status */}
            <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/30">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container"></span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant">Ollama Core: Online</span>
            </div>
            
            {/* Agents Status */}
            <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
              <span className="font-label-md text-label-md text-on-surface-variant">12 Agentes Activos</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-300">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>smart_toy</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-300">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 pt-[120px] pb-24">
        <Outlet />
      </div>
    </div>
  );
}
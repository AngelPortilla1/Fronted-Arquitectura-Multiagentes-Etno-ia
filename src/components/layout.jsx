import { Outlet, Link } from 'react-router-dom';
import { useApiStatus } from '../hooks/useAPistatus';
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { AgentStatusDropdown } from './agents/AgentStatusDropdown';
import Footer from './footer';

export default function Layout() {
  // Uso del sensor real para el principio Offline-first
  const { isOnline, loading } = useApiStatus();
  const { agents, isLoading } = useAgentsStatus();

  return (
    <div className="relative min-h-screen">
      
      {/* Atmospheric Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest to-surface-container-high opacity-80"></div>
        <div className="absolute inset-0 topographic-bg"></div>
        {/* Soft glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
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
            
            {/* StatusBar Dinámico (Sensor FastAPI/Ollama) */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-500 ${
              isOnline ? 'bg-surface-container-high border-outline-variant/30' : 'bg-error-container/20 border-error/30'
            }`}>
              <div className="relative flex h-2 w-2">
                {isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-on-tertiary-container' : 'bg-error'}`}></span>
              </div>
              <span className={`font-label-md text-label-md ${isOnline ? 'text-on-surface-variant' : 'text-error font-bold'}`}>
                Ollama Core: {loading ? 'Sincronizando...' : isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Agents Status - Observabilidad Cognitiva Multi-Agente */}
            <AgentStatusDropdown agents={agents} isLoading={isLoading} error={null} />

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
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 pt-[120px] pb-24">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
      
    </div>
  );
}
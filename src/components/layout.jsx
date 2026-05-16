import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/client';
import { useApiStatus } from '../hooks/useApiStatus';
import { useAgentSwarmStatus } from '../hooks/useAgentSwarmStatus';
import { AgentStatusDropdown } from './agents/AgentStatusDropdown';
import Footer from './footer';
import LogoEtnoia from '../assets/LogoEtnoia.png';

export default function Layout() {
  // Uso del sensor real para el principio Offline-first
  const { isOnline, loading, mode } = useApiStatus();
  const { agents, isLoading } = useAgentSwarmStatus();
  const [isColdStarting, setIsColdStarting] = useState(false);
  const [useStub, setUseStub] = useState(true);

  const handleColdStart = async () => {
    setIsColdStarting(true);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.COLD_START}?use_stub=${useStub}`, {
        method: 'POST'
      });
      if (response.ok) {
        alert('✅ Sistema Multiagente inicializado exitosamente en el Backend.');
        window.location.reload(); // Recarga para que todos los hooks hagan fetch de los nuevos datos
      } else {
        alert('⚠️ Error al intentar inicializar el Backend.');
      }
    } catch (err) {
      alert('❌ No se pudo conectar con el Backend (127.0.0.1:8000). Asegúrate de que FastAPI esté encendido.');
      console.error(err);
    } finally {
      setIsColdStarting(false);
    }
  };

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
          
          {/* Brand - Lado Izquierdo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 font-display-lg text-headline-md font-bold text-primary">
              <img src={LogoEtnoia} alt="Logo ETNO-IA Rural" className="h-10 w-auto object-contain" />
              <span className="hidden sm:block">ETNO-IA Rural 2.0</span>
            </Link>
          </div>

          {/* Indicators - Centro */}
          <div className="hidden lg:flex items-center justify-center gap-6 flex-1 px-4">
            
            {/* StatusBar Dinámico (Sensor FastAPI/Ollama) */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-500 flex-shrink-0 ${
              isOnline ? 'bg-surface-container-high border-outline-variant/30' : 'bg-error-container/20 border-error/30'
            }`}>
              <div className="relative flex h-2 w-2">
                {isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-on-tertiary-container' : 'bg-error'}`}></span>
              </div>
              <span className={`font-label-md text-label-md ${isOnline ? 'text-on-surface-variant' : 'text-error font-bold'}`}>
                IA Core: {loading ? 'Sincronizando...' : isOnline ? mode : 'Offline'}
              </span>
            </div>
            
            {/* Agents Status - Observabilidad Cognitiva Multi-Agente */}
            <div className="flex-shrink-0">
              <AgentStatusDropdown agents={agents} isLoading={isLoading} error={null} />
            </div>
          </div>

          {/* Actions - Lado Derecho */}
          <div className="flex items-center justify-end gap-3 flex-shrink-0">
            {/* Toggle Modo Rápido */}
            <div className="hidden xl:flex items-center gap-2 mr-1">
              <label htmlFor="stub-toggle" className="text-[10px] font-label-md text-on-surface-variant cursor-pointer text-right leading-tight">
                Modo Rápido<br/>(Stubs)
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="stub-toggle" 
                  checked={useStub}
                  onChange={(e) => setUseStub(e.target.checked)}
                  disabled={isColdStarting}
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-surface appearance-none cursor-pointer transition-transform duration-300 ease-in-out"
                  style={{ transform: useStub ? 'translateX(100%)' : 'translateX(0)', borderColor: useStub ? '#c8f17a' : '#c3c8c1' }}
                />
                <label 
                  htmlFor="stub-toggle" 
                  className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-container-highest cursor-pointer transition-colors duration-300 ease-in-out"
                  style={{ backgroundColor: useStub ? '#4d6453' : '#c3c8c1' }}
                ></label>
              </div>
            </div>

            {/* Botón de Cold Start */}
            <button 
              onClick={handleColdStart}
              disabled={isColdStarting}
              title="Inicializar Sistema Multiagente (Cold Start)"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 flex-shrink-0 ${
                isColdStarting 
                  ? 'bg-primary-container text-on-primary-container border-primary/30 cursor-not-allowed opacity-80 min-w-[200px] justify-center' 
                  : 'bg-surface hover:bg-primary/10 text-primary border-primary/30 hover:shadow-sm'
              }`}
            >
              {isColdStarting ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-[18px] shrink-0">sync</span>
                  <span className="text-xs font-label-md whitespace-nowrap">
                    {useStub ? "Cargando entorno simulado..." : "Iniciando IA (Puede tardar)..."}
                  </span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                  <span className="text-xs font-label-md hidden md:inline whitespace-nowrap">Cold Start</span>
                </>
              )}
            </button>

            <button className="text-on-surface-variant hover:text-primary transition-colors duration-300 flex-shrink-0 ml-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>smart_toy</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-300 flex-shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
            </button>
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
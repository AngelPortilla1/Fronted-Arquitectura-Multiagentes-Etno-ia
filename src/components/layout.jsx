import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/client';
import { useApiStatus } from '../hooks/useApiStatus';
import { useAgentSwarmStatus } from '../hooks/useAgentSwarmStatus';
import { AgentStatusDropdown } from './agents/AgentStatusDropdown';
import { useToast } from './ToastContext';
import Footer from './footer';
import LogoEtnoia from '../assets/LogoEtnoia.png';

export default function Layout() {
  // Uso del sensor real para el principio Offline-first
  const { isOnline, loading, mode, modelName } = useApiStatus();
  const { agents, isLoading } = useAgentSwarmStatus();
  const { showToast } = useToast();
  const [isColdStarting, setIsColdStarting] = useState(false);
  const [useStub, setUseStub] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleColdStart = async () => {
    setIsColdStarting(true);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.COLD_START}?use_stub=${useStub}`, {
        method: 'POST'
      });
      if (response.ok) {
        showToast('Sistema Multiagente inicializado exitosamente.', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast('Error al intentar inicializar el Backend.', 'error');
      }
    } catch (err) {
      showToast('No se pudo conectar con el Backend (127.0.0.1:8000).', 'error');
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
          
          {/* Brand & Menu - Lado Izquierdo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button 
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary-container hover:text-primary transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
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
                IA Core: {loading ? 'Sincronizando...' : isOnline ? `${mode} (${modelName})` : 'Offline'}
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
            <div className="hidden md:flex items-center gap-2 bg-surface-container-highest/50 px-3 py-1.5 rounded-full border border-outline-variant/30 transition-colors hover:bg-surface-container-highest">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                {useStub ? 'bolt' : 'psychology'}
              </span>
              <label htmlFor="stub-toggle" className="text-xs font-bold text-on-surface cursor-pointer select-none whitespace-nowrap">
                {useStub ? 'Stubs' : 'LLM Real'}
              </label>
              <div className="relative inline-block w-8 align-middle select-none ml-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  id="stub-toggle" 
                  checked={useStub}
                  onChange={(e) => setUseStub(e.target.checked)}
                  disabled={isColdStarting}
                  className="absolute block w-4 h-4 rounded-full bg-white appearance-none cursor-pointer transition-all duration-300 z-10 top-[2px] shadow-sm"
                  style={{ left: useStub ? '14px' : '2px' }}
                />
                <div 
                  className="block h-5 rounded-full transition-colors duration-300 w-full"
                  style={{ backgroundColor: useStub ? '#4d6453' : '#ba1a1a' }}
                ></div>
              </div>
            </div>

            {/* Botón de Cold Start */}
            <button 
              onClick={handleColdStart}
              disabled={isColdStarting}
              title="Inicializar Sistema Multiagente"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 border ${
                isColdStarting 
                  ? 'bg-surface-container text-on-surface-variant border-transparent cursor-wait' 
                  : 'bg-primary hover:bg-[#3b4d3f] text-on-primary border-primary hover:shadow-md'
              }`}
            >
              {isColdStarting ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-[18px]">sync</span>
                  <span className="text-xs font-bold hidden sm:inline whitespace-nowrap">Iniciando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>power_settings_new</span>
                  <span className="text-xs font-bold hidden sm:inline whitespace-nowrap">Arrancar IA</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navegación Global (Drawer) */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 ${menuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop (fondo oscuro interactivo) */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setMenuOpen(false)}
        ></div>
        
        {/* Panel lateral */}
        <nav className={`absolute top-0 left-0 bottom-0 w-80 bg-surface border-r border-white/20 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex items-center justify-between border-b border-outline-variant/30">
            <h2 className="font-display-lg text-xl font-bold text-primary">Menú Principal</h2>
            <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-error-container hover:text-error transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {[
              { to: '/', icon: 'home', label: 'Dashboard Principal' },
              { to: '/registrar-relato', icon: 'map', label: 'Registrar Relato' },
              { to: '/segmentos', icon: 'public', label: 'Segmentos Comunitarios' },
              { to: '/revisiones', icon: 'route', label: 'Cola de Revisiones (BDI)' },
              { to: '/aprobacion-curricular', icon: 'school', label: 'Aprobación Curricular' },
              { to: '/analisis-modelos', icon: 'functions', label: 'Análisis de Modelos Mentales' },
            ].map((link) => (
              <Link 
                key={link.to} 
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary-container/50 hover:text-primary transition-colors text-on-surface-variant font-bold font-label-md"
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-[100px] pb-24">
        
        {/* Breadcrumbs */}
        {(() => {
          const location = useLocation();
          if (location.pathname === '/') return null;

          const paths = location.pathname.split('/').filter(p => p);
          
          // Diccionario para humanizar las rutas
          const routeNames = {
            'registrar-relato': 'Registrar Relato',
            'modelo-mental': 'Modelo Mental BDI',
            'ruta-pedagogica': 'Ruta Curricular',
            'revisiones': 'Cola de Revisiones',
            'aprobacion-curricular': 'Aprobación Pedagógica',
            'segmentos': 'Segmentos Comunitarios',
            'auditoria': 'Auditoría de Datos',
            'analisis-modelos': 'Análisis Experimental'
          };

          return (
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-4">
              <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant overflow-x-auto pb-2 scrollbar-hide">
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[14px]">home</span>
                  Inicio
                </Link>
                {paths.map((segment, index) => {
                  const isLast = index === paths.length - 1;
                  const to = `/${paths.slice(0, index + 1).join('/')}`;
                  const label = routeNames[segment] || segment; // Si no está en el diccionario, es un ID dinámico
                  
                  return (
                    <div key={to} className="flex items-center gap-2 shrink-0">
                      <span className="material-symbols-outlined text-[14px] opacity-50">chevron_right</span>
                      {isLast ? (
                        <span className="text-primary">{label.replace(/_/g, ' ')}</span>
                      ) : (
                        <Link to={to} className="hover:text-primary transition-colors">{label.replace(/_/g, ' ')}</Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          );
        })()}

        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
      
    </div>
  );
}
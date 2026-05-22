import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="w-full px-margin-mobile md:px-margin-desktop pb-8 mt-auto">
    <div className="max-w-container-max mx-auto">
      {/* Contenedor Glassmorphic con borde sutil Neo-brutalista */}
      <div className="relative overflow-hidden rounded-[2rem] border-2 border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:border-white/20 hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Branding & Info de Tesis */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary-container bg-clip-text text-transparent tracking-tight">
              ETNO-IA 2.0
            </h4>
            <p className="text-xs text-on-surface-variant/60 mt-1 font-medium">
              © 2026 · ETNO-IA Rural 2.0 · Arquitectura Multiagentes<br />
              <br />
              <span className="italic">Alfabetización en IA para comunidades rurales</span>
            </p>
          </div>

          {/* Navegación Secundaria */}
          <nav className="flex gap-8">
            <Link
              to="/documentacion"
              className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 hover:text-primary transition-colors relative group"
            >
              Documentación
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link
              to="/analisis-modelos"
              className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 hover:text-primary transition-colors relative group"
            >
              Modelos Mentales
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/auditoria"
              className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 hover:text-primary transition-colors relative group flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              Transparencia Algorítmica (XAI)
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Indicador de "Sistema Operativo" (Coherencia con Header) */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-tertiary-container/10 border border-tertiary-container/20">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container"></span>
            </div>
            <span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-widest">
              NODO NORORIENTE COLOMBIANO ACTIVO
            </span>
          </div>
        </div>
        
        {/* Adorno visual: Orbe interno muy suave */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  </footer>
);

export default Footer;
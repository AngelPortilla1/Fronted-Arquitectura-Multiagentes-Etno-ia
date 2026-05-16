import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function P0_Home() {
  const [pidSearch, setPidSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (target) => {
    if (pidSearch.trim()) {
      navigate(`/${target}/${pidSearch.trim()}`);
    }
  };

  return (
    <main className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-120px)] py-12">
      
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-3xl">
        <h1 className="font-display-lg text-4xl md:text-[48px] font-bold text-on-surface mb-6 leading-tight">
          Plataforma de Inteligencia Territorial
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Seleccione su rol en el sistema. ETNO-IA Rural 2.0 adapta sus agentes de Inteligencia Artificial para acompañar la alfabetización digital, respetando los saberes y el contexto de las comunidades campesinas.
        </p>
      </div>

      {/* Quick Lookup Panel (NUEVO) */}
      <div className="w-full max-w-4xl bg-surface/80 backdrop-blur-lg border border-white/40 shadow-xl rounded-[40px] p-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-3 ml-2">Consultar Productor Existente</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person_search</span>
              <input 
                type="text" 
                placeholder="Ingresa el PID (ej: p1, don_aurelio...)" 
                value={pidSearch}
                onChange={(e) => setPidSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch('modelo-mental')}
                className="w-full bg-surface-container-highest border border-outline-variant rounded-2xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto mt-6 md:mt-0 flex-wrap md:flex-nowrap">
            <button 
              onClick={() => handleSearch('modelo-mental')}
              disabled={!pidSearch.trim()}
              className="flex-1 md:flex-none bg-primary text-on-primary px-6 py-4 rounded-2xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">account_tree</span>
              Modelo
            </button>
            <button 
              onClick={() => handleSearch('ruta-pedagogica')}
              disabled={!pidSearch.trim()}
              className="flex-1 md:flex-none bg-secondary text-on-secondary px-6 py-4 rounded-2xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">route</span>
              Ruta
            </button>
            <button 
              onClick={() => handleSearch('auditoria')}
              disabled={!pidSearch.trim()}
              className="flex-1 md:flex-none bg-surface-container-highest text-on-surface px-6 py-4 rounded-2xl font-bold border border-outline-variant hover:bg-surface-container-high transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">policy</span>
              Auditoría
            </button>
          </div>
        </div>
        <p className="text-[10px] text-on-surface-variant/60 mt-4 text-center md:text-left ml-2 uppercase tracking-tighter italic">
          * Para probar con datos de ejemplo del sistema, puedes usar el ID: <span className="font-bold text-primary">p1</span>
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-[1400px]">
        
        {/* Card 1: Facilitador Territorial */}
        <Link to="/registrar-relato" className="group relative flex flex-col items-start p-8 rounded-3xl bg-surface/60 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(27,48,34,0.1)] transition-all duration-500 hover:-translate-y-2 text-left overflow-hidden">
          <div className="absolute inset-0 bg-primary-container opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-5 rounded-bl-[100px] -mr-10 -mt-10"></div>
          
          <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center mb-8 shadow-inner">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
          </div>
          
          <h2 className="font-headline-md text-[24px] font-semibold text-on-surface mb-3">Facilitador Territorial</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 opacity-80 line-clamp-3">
            Gestión directa en campo. Monitoreo de cultivos, reporte de incidencias y enlace vital entre la comunidad agrícola y el ecosistema tecnológico.
          </p>
          
          <div className="mt-auto flex items-center gap-2 bg-primary-fixed/50 px-3 py-1.5 rounded-full border border-primary-fixed w-full">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
            <span className="font-label-md text-label-md text-on-primary-fixed-variant">2 Agentes Asignados</span>
          </div>
        </Link>

        {/* Card 2: Equipo Curricular */}
        <Link to="/revisiones" className="group relative flex flex-col items-start p-8 rounded-3xl bg-surface/60 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(128,85,51,0.1)] transition-all duration-500 hover:-translate-y-2 text-left overflow-hidden">
          <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-5 rounded-bl-[100px] -mr-10 -mt-10"></div>
          
          <div className="w-14 h-14 rounded-2xl bg-[#805533] text-on-secondary flex items-center justify-center mb-8 shadow-inner">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
          </div>
          
          <h2 className="font-headline-md text-[24px] font-semibold text-on-surface mb-3">Equipo Curricular</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 opacity-80 line-clamp-3">
            Diseño y adaptación de metodologías de aprendizaje. Traducción de saberes ancestrales a estructuras de conocimiento transferibles y escalables.
          </p>
          
          <div className="mt-auto flex items-center gap-2 bg-secondary-container/30 px-3 py-1.5 rounded-full border border-secondary-container w-full">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </div>
            <span className="font-label-md text-label-md text-on-secondary-container">Módulo Pedagógico Activo</span>
          </div>
        </Link>

        {/* Card 3: Auditor de Datos */}
        <Link to="/auditoria/p1" className="group relative flex flex-col items-start p-8 rounded-3xl bg-surface/60 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(27,48,34,0.15)] transition-all duration-500 hover:-translate-y-2 text-left overflow-hidden">
          <div className="absolute inset-0 bg-surface-tint opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-surface-tint opacity-5 rounded-bl-[100px] -mr-10 -mt-10"></div>
          
          <div className="w-14 h-14 rounded-2xl bg-surface-tint text-on-primary flex items-center justify-center mb-8 shadow-inner">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>
          
          <h2 className="font-headline-md text-[24px] font-semibold text-on-surface mb-3">Auditor de Datos</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 opacity-80 line-clamp-3">
            Verificación de integridad, trazabilidad y ética de los modelos. Supervisión de la seguridad blockchain y cumplimiento normativo del sistema.
          </p>
          
          <div className="mt-auto flex items-center gap-2 bg-primary-fixed/30 px-3 py-1.5 rounded-full border border-primary-fixed-dim w-full">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-surface opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-on-surface"></span>
            </div>
            <span className="font-label-md text-label-md text-on-primary-fixed-variant">Seguridad Activa</span>
          </div>
        </Link>

        {/* Card 4: Coordinador Territorial */}
        <Link to="/segmentos" className="group relative flex flex-col items-start p-8 rounded-3xl bg-surface/60 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(27,48,34,0.15)] transition-all duration-500 hover:-translate-y-2 text-left overflow-hidden">
          <div className="absolute inset-0 bg-tertiary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary opacity-5 rounded-bl-[100px] -mr-10 -mt-10"></div>
          
          <div className="w-14 h-14 rounded-2xl bg-tertiary text-on-primary flex items-center justify-center mb-8 shadow-inner">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
          </div>
          
          <h2 className="font-headline-md text-[24px] font-semibold text-on-surface mb-3">Coordinador Territorial</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 opacity-80 line-clamp-3">
            Análisis de inteligencia colectiva. Identificación de segmentos comunitarios, visualización de brechas digitales y toma de decisiones a nivel regional.
          </p>
          
          <div className="mt-auto flex items-center gap-2 bg-tertiary-container/30 px-3 py-1.5 rounded-full border border-tertiary-container w-full">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </div>
            <span className="font-label-md text-label-md text-on-tertiary-container">Análisis Macro</span>
          </div>
        </Link>

      </div>
    </main>
  );
}
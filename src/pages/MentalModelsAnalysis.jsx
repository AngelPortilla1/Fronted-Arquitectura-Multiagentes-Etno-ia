import { useNavigate } from 'react-router-dom';

const MentalModelsAnalysis = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tertiary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-12 relative z-10">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all mb-12 group"
        >
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="font-bold text-sm uppercase tracking-widest">Volver al Dashboard</span>
        </button>

        {/* Hero Section */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Arquitectura Multiagentes
          </div>
          <h1 className="text-headline-lg md:text-[3.5rem] font-display-lg leading-[1.1] text-on-surface mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Análisis de Modelos Mentales en <span className="text-primary italic">ETNO-IA 2.0</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Nuestra arquitectura procesa y analiza los modelos mentales a través de una cadena de apoyo decisional, garantizando que el sistema organice la información y el criterio humano tome la decisión final.
          </p>
        </header>

        {/* Technical Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          
          {/* Formalización Matemática */}
          <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined">functions</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-4">Formalización Matemática</h3>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              Cada modelo mental se representa mediante la estructura de tupla, consolidando evidencia directa e inferencias cognitivas.
            </p>
            <div className="bg-primary-container/10 border border-primary-container/20 rounded-2xl p-6 font-mono text-primary text-lg text-center">
              Mi = (Gi, vi, ℓi, qi)
            </div>
            <p className="mt-4 text-xs text-on-surface-variant/70 italic">
              * Incluye métricas de incertidumbre, revisiones y posibles contradicciones [cite: 59].
            </p>
          </div>

          {/* Procesamiento Local Asistido */}
          <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined">memory</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-4">Procesamiento Local Asistido</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Utilizando <span className="font-bold text-secondary">Ollama</span> encapsulado en <code>LLMClientProtocol</code>, las narrativas se transforman en grafos <code>Gi</code>, extrayendo valores (<code>vi</code>) y perfiles de alfabetización (<code>ℓi</code>).
            </p>
          </div>

          {/* Agrupamiento por Distancia Híbrida */}
          <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined">hub</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-4">Agrupamiento Híbrido</h3>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Identificamos patrones comunitarios evaluando la estructura topográfica y la similitud de valores.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-tertiary-fixed/10 border border-tertiary-fixed/20 text-tertiary font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">calculate</span>
              Distancia de Fisher-Rao
            </div>
          </div>

          {/* Control Human-in-the-Loop */}
          <div className="p-8 rounded-[2.5rem] bg-primary text-on-primary shadow-xl shadow-primary/20 transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">front_hand</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Control Human-in-the-Loop</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Toda representación funciona estrictamente como un borrador revisable. El equipo mantiene la autoridad indelegable para validar o corregir.
            </p>
            <div className="py-3 px-4 border border-white/20 rounded-xl bg-white/10 text-xs uppercase tracking-widest font-bold text-center">
              Soberanía Epistémica Garantizada
            </div>
          </div>

        </div>

        {/* Footer of the Page */}
        <footer className="pt-12 border-t border-on-surface/10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
          <p className="text-xs font-medium">Anexo de Auditoría Técnica · v2.0.4</p>
          <div className="flex gap-4">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default MentalModelsAnalysis;

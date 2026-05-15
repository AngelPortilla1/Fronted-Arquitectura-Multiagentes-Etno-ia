import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function P3_RutaPedagogica() {
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pid] = useState('productor_vereda_rosal_01'); // PID de prueba

  useEffect(() => {
    fetchRoute();
  }, [pid]);

  const fetchRoute = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/route?pid=${pid}`);
      if (response.ok) {
        const data = await response.json();
        setRoute(data);
      } else {
        throw new Error('Backend encendido pero respondió con error o sin datos (Ej. 404).');
      }
    } catch (err) {
      console.warn('Backend apagado o error de conexión. Usando mock de prueba BDI.', err);
      // Mock de datos según tu arquitectura para pruebas EXCLUSIVAMENTE como fallback
      setRoute({
        pid: pid,
        route_name: "Alfabetización en Soberanía de Datos",
        risk_level: "Alto (Desconfianza detectada)",
        steps: [
          {
            id: "MOD-01",
            title: "Tus datos son tu cosecha",
            desc: "Introducción a los derechos digitales comparándolos con la propiedad de la tierra.",
            quote: "Él cree que si pone sus datos... el gobierno le va a cobrar más impuestos.",
            agent: "M_curr"
          },
          {
            id: "MOD-02",
            title: "Seguridad y Candados Digitales",
            desc: "Cómo funciona la encriptación local sin necesidad de internet constante.",
            quote: "Le da mucho miedo usar el teléfono... le van a robar la información.",
            agent: "M_curr"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-primary font-bold">Generando ruta pedagógica...</div>;

  if (!route) return (
    <div className="p-20 text-center text-on-surface-variant">
      <span className="material-symbols-outlined text-5xl mb-4">route</span>
      <p className="font-headline-md text-xl">No hay ruta pedagógica generada para este productor.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/modelo-mental')} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-display-lg text-3xl font-bold text-on-surface">Propuesta Pedagógica</h1>
        </div>
        
        <div className="bg-primary-container/30 border border-primary-fixed p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-primary mb-1">{route.route_name}</h2>
            <p className="text-on-surface-variant">Ruta personalizada generada para <span className="font-bold">{route.pid}</span></p>
          </div>
          <div className="flex items-center gap-2 bg-error-container/20 px-4 py-2 rounded-full border border-error/20">
            <span className="material-symbols-outlined text-error text-sm">warning</span>
            <span className="text-sm font-bold text-error uppercase">{route.risk_level}</span>
          </div>
        </div>
      </header>

      {/* Timeline de la Ruta */}
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary before:to-primary/20">
        
        {route.steps.map((step, index) => (
          <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            
            {/* El punto de la línea de tiempo */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-on-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <span className="font-bold">{index + 1}</span>
            </div>

            {/* Contenido del Módulo */}
            <div className="w-[calc(100%-4rem)] md:w-[45%] bg-surface/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{step.id}</span>
                <span className="text-[10px] bg-surface-container-high px-2 py-1 rounded text-on-surface-variant font-mono">Agente: {step.agent}</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">{step.title}</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed italic">
                "{step.desc}"
              </p>

              {/* Tarea F4.1: EvidenceQuote (Trazabilidad Visual) */}
              <div className="bg-surface-container-lowest p-4 rounded-2xl border-l-4 border-secondary shadow-inner relative overflow-hidden">
                <span className="material-symbols-outlined absolute right-2 top-2 opacity-5 text-4xl">format_quote</span>
                <p className="text-xs font-bold text-secondary uppercase mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">visibility</span> Evidencia del Relato:
                </p>
                <p className="text-sm text-on-secondary-container leading-snug">
                  "...{step.quote}..."
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de Acción Final */}
      <div className="mt-16 text-center">
        <button 
          onClick={() => navigate('/revisiones')}
          className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
        >
          <span className="material-symbols-outlined">playlist_add_check</span>
          Enviar a Cola de Aprobación
        </button>
      </div>
    </div>
  );
}
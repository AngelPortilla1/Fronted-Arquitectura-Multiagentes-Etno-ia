import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function P5_Segmentos() {
  const navigate = useNavigate();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    // Datos de respaldo (Mock BDI para agrupamiento comunitario)
    const mockData = [
      {
        segment_id: "seg_rosal_01",
        name: "Vereda El Rosal - Tradicionales",
        population_size: 14,
        trust_level: "Bajo",
        predominant_belief: "La tecnología expone los datos de la finca al gobierno.",
        macro_route: "Soberanía de Datos e Introducción a la IA",
        status: "Requiere Intervención"
      },
      {
        segment_id: "seg_lejania_02",
        name: "Vereda La Lejanía - Jóvenes Relevo",
        population_size: 8,
        trust_level: "Medio-Alto",
        predominant_belief: "La IA puede optimizar tiempos pero requiere internet (que no hay).",
        macro_route: "IA Offline y Modelos Locales Predictivos",
        status: "Ruta Activa"
      }
    ];

    try {
      const response = await fetch('http://127.0.0.1:8000/segments');
      if (response.ok) {
        const data = await response.json();
        // Si el backend responde bien, usamos sus datos (asegurando que sea un array)
        setSegments(Array.isArray(data) && data.length > 0 ? data : mockData);
      } else {
        // Si el backend da error 404, usamos los de prueba
        setSegments(mockData); 
      }
    } catch (err) {
      // Si el servidor está apagado o hay error de red (CORS), usamos los de prueba
      console.warn('Usando datos simulados. No se detectó el backend en /segments');
      setSegments(mockData);
    } finally {
      // Obligamos a quitar la pantalla de carga pase lo que pase
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <span className="animate-spin material-symbols-outlined text-5xl text-primary">sync</span>
        <p className="font-headline-md text-xl text-primary animate-pulse">Agrupando modelos mentales...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/')} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          </button>
          <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface">
            Segmentos Comunitarios
          </h1>
        </div>
        <p className="font-body-md text-on-surface-variant ml-10">
          Agrupación de productores por similitud semántica en sus modelos mentales (Creencias y Desconfianza).
        </p>
      </header>

      {/* Grid de Segmentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {segments.map((seg) => (
          <article 
            key={seg.segment_id}
            className="bg-surface/80 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all group"
          >
            {/* Cabecera de la Tarjeta */}
            <div className="bg-surface-container-highest p-6 border-b border-outline-variant/30 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block">
                  ID: {seg.segment_id}
                </span>
                <h2 className="font-headline-md text-2xl text-on-surface">
                  {seg.name}
                </h2>
              </div>
              <div className="bg-primary-container text-on-primary-container w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
                {seg.population_size}
                <span className="material-symbols-outlined absolute -bottom-1 -right-1 text-sm bg-surface rounded-full">group</span>
              </div>
            </div>

            {/* Cuerpo de la Tarjeta */}
            <div className="p-6 space-y-6">
              
              {/* Creencia Predominante (BDI) */}
              <div>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  Creencia Colectiva Predominante
                </h3>
                <p className="font-body-lg text-on-surface bg-error-container/10 p-4 rounded-2xl border border-error/10 italic">
                  "{seg.predominant_belief}"
                </p>
              </div>

              {/* Métricas */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 bg-surface-container p-4 rounded-2xl border border-outline-variant/30">
                  <p className="text-xs text-on-surface-variant uppercase font-bold mb-1">Confianza en IA</p>
                  <p className={`font-bold text-lg flex items-center gap-2 ${seg.trust_level === 'Bajo' ? 'text-error' : 'text-primary'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {seg.trust_level === 'Bajo' ? 'trending_down' : 'trending_up'}
                    </span>
                    {seg.trust_level}
                  </p>
                </div>
                <div className="flex-1 bg-surface-container p-4 rounded-2xl border border-outline-variant/30">
                  <p className="text-xs text-on-surface-variant uppercase font-bold mb-1">Estado</p>
                  <p className="font-bold text-lg text-secondary">
                    {seg.status}
                  </p>
                </div>
              </div>

              {/* Acción / Ruta Sugerida */}
              <div className="pt-2 border-t border-outline-variant/30">
                <p className="text-xs text-on-surface-variant uppercase font-bold mb-2">Macro-Ruta Asignada (M_curr)</p>
                <button className="w-full text-left bg-secondary-container/20 hover:bg-secondary-container/40 border border-secondary-container text-on-secondary-container p-4 rounded-2xl transition-colors flex justify-between items-center group-hover:border-secondary">
                  <span className="font-label-md text-lg">{seg.macro_route}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
              
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
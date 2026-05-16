import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/client';

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
      const response = await fetch(API_ENDPOINTS.SEGMENTS);
      if (response.ok) {
        const data = await response.json();
        console.log("📦 Datos de segmentos recibidos del backend:", data); // <-- Para ver la estructura real en consola
        // Si el backend responde bien, usamos sus datos (asegurando que sea un array)
        setSegments(Array.isArray(data) ? data : []);
      } else {
        // Si el backend da error (ej. 404), lanzamos error para no mostrar mocks de forma errónea
        throw new Error('Backend encendido pero no retornó segmentos válidos.');
      }
    } catch (err) {
      // Si el servidor está apagado o hay error de red (CORS), usamos los de prueba como fallback EXCLUSIVO
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
      {segments.length === 0 ? (
        <div className="bg-surface/60 backdrop-blur-md border-2 border-dashed border-outline-variant p-16 text-center rounded-3xl shadow-sm flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-6xl text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>group_off</span>
          <p className="font-headline-md text-2xl text-on-surface-variant">
            No hay segmentos comunitarios identificados.
          </p>
        </div>
      ) : (
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
                  ID: {seg.segment_id || 'N/A'}
                </span>
                <h2 className="font-headline-md text-2xl text-on-surface capitalize">
                  {seg.label || `Segmento ${seg.segment_id}`}
                </h2>
              </div>
              <div className="bg-primary-container text-on-primary-container w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-inner shrink-0 relative" title="Cantidad de miembros">
                {seg.member_ids ? seg.member_ids.length : 0}
                <span className="material-symbols-outlined absolute -bottom-1 -right-1 text-sm bg-surface rounded-full">group</span>
              </div>
            </div>

            {/* Cuerpo de la Tarjeta */}
            <div className="p-6 space-y-6">
              
              {/* Resumen del Segmento */}
              <div>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  Análisis del Segmento
                </h3>
                <p className="font-body-md text-on-surface bg-error-container/10 p-4 rounded-2xl border border-error/10 italic leading-relaxed">
                  "{seg.summary || 'Sin resumen disponible.'}"
                </p>
              </div>

              {/* Métricas (Cobertura / Confianza) */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 bg-surface-container p-4 rounded-2xl border border-outline-variant/30">
                  <p className="text-xs text-on-surface-variant uppercase font-bold mb-1" title="Confianza Promedio (0 a 1)">Confianza Promedio</p>
                  <p className={`font-bold text-lg flex items-center gap-2 ${seg.coverage?.mean_confidence < 0.5 ? 'text-error' : 'text-primary'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {seg.coverage?.mean_confidence < 0.5 ? 'trending_down' : 'trending_up'}
                    </span>
                    {seg.coverage?.mean_confidence !== undefined ? (seg.coverage.mean_confidence * 100).toFixed(1) + '%' : 'N/A'}
                  </p>
                </div>
                <div className="flex-1 bg-surface-container p-4 rounded-2xl border border-outline-variant/30">
                  <p className="text-xs text-on-surface-variant uppercase font-bold mb-1" title="Estabilidad del Segmento">Score de Estabilidad</p>
                  <p className="font-bold text-lg text-secondary">
                    {seg.stability_score !== undefined ? seg.stability_score.toFixed(2) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Acción / Ruta Sugerida */}
              <div className="pt-2 border-t border-outline-variant/30">
                <p className="text-xs text-on-surface-variant uppercase font-bold mb-2">Centroid PID (Representante)</p>
                <button className="w-full text-left bg-secondary-container/20 hover:bg-secondary-container/40 border border-secondary-container text-on-secondary-container p-4 rounded-2xl transition-colors flex justify-between items-center group-hover:border-secondary">
                  <span className="font-label-md text-sm truncate">{seg.centroid_pid || 'No asignado'}</span>
                  <span className="material-symbols-outlined">person_search</span>
                </button>
              </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
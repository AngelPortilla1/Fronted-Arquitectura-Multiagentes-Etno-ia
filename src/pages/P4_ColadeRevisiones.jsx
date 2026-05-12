import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function P4_ColadeRevisiones() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/reviews?status=pending');
      
      if (!response.ok) {
        throw new Error('No se pudo conectar con el servidor local.');
      }
      
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError('Error al cargar los perfiles pendientes. Verifica que tu backend en Python (puerto 8000) esté encendido.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/reviews/${reviewId}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        setReviews(currentReviews => currentReviews.filter(r => r.review_id !== reviewId));
      } else {
        alert('Hubo un problema al aprobar la ruta en el servidor.');
      }
    } catch (err) {
      alert('Error de red. Revisa tu conexión con el backend.');
      console.error(err);
    }
  };

  // 1. Pantalla de carga
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <span className="animate-spin material-symbols-outlined text-5xl text-primary">sync</span>
        <p className="font-headline-md text-xl text-primary animate-pulse">
          Cargando perfiles en cuarentena...
        </p>
      </div>
    );
  }

  // 2. Pantalla de error
  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-error-container border-l-8 border-error rounded-2xl shadow-sm flex items-start gap-4">
        <span className="material-symbols-outlined text-on-error-container text-3xl">error</span>
        <div>
          <h2 className="font-headline-md text-xl text-on-error-container mb-1">Aviso de Conexión</h2>
          <p className="font-body-md text-on-error-container opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  // 3. Pantalla principal del Panel
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      
      {/* Encabezado del Panel */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/')} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          </button>
          <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface">
            Cola de Revisiones
          </h1>
        </div>
        <p className="font-body-md text-on-surface-variant ml-10">
          Revisión humana (Human-in-the-loop) de rutas de aprendizaje generadas por el agente BDI.
        </p>
      </header>

      {/* Condicional: Si no hay datos vs Si hay datos */}
      {reviews.length === 0 ? (
        <div className="bg-surface/60 backdrop-blur-md border-2 border-dashed border-outline-variant p-16 text-center rounded-3xl shadow-sm flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-6xl text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>inbox</span>
          <p className="font-headline-md text-2xl text-on-surface-variant">
            No hay perfiles pendientes de revisión.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <article 
              key={review.review_id} 
              className="bg-surface/80 backdrop-blur-md border border-white/40 shadow-sm p-6 md:p-8 rounded-3xl hover:shadow-md transition-shadow group"
            >
              {/* Identificación del Productor */}
              <div className="mb-8 border-b border-outline-variant/30 pb-6">
                <div className="inline-flex items-center gap-2 bg-primary-container/30 text-on-surface px-4 py-2 rounded-full text-sm font-label-md uppercase tracking-wide mb-4 border border-primary/20">
                  <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                  Productor: {review.pid.replace(/_/g, ' ')}
                </div>
                <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface flex items-center gap-3">
                  Ruta Sugerida: <span className="capitalize text-primary">{review.payload.route_type}</span>
                </h2>
              </div>

              {/* Justificación de la IA */}
              <div className="mb-8">
                <h3 className="font-label-md text-secondary mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <span className="material-symbols-outlined">psychology</span>
                  Justificación del Sistema BDI
                </h3>
                <p className="font-body-lg text-on-surface-variant leading-relaxed bg-surface-container-highest p-5 rounded-2xl border border-outline-variant/30 italic">
                  "{review.payload.explanation}"
                </p>
              </div>

              {/* Lista de Módulos */}
              <div className="mb-8">
                <h3 className="font-label-md text-secondary mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <span className="material-symbols-outlined">view_list</span>
                  Módulos a Asignar
                </h3>
                <ul className="space-y-4">
                  {review.payload.steps.map((step, index) => (
                    <li key={index} className="flex items-center gap-4 bg-surface-container p-4 rounded-2xl border border-outline-variant/30 transition-colors hover:border-primary/50">
                      <div className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-inner">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-body-lg font-bold text-on-surface">
                          {step.title}
                        </p>
                        <p className="text-sm text-on-surface-variant font-mono mt-1">
                          ID: {step.module_id}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón de Acción (Touch-Friendly) */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleApprove(review.review_id)}
                  className="w-full md:w-auto bg-primary text-on-primary px-8 py-4 rounded-2xl font-label-md text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3"
                  aria-label="Aprobar esta ruta de aprendizaje"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Aprobar Ruta Pedagógica
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
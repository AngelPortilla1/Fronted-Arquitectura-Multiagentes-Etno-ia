import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getReviewApproveUrl } from '../api/client';
import { useApiStatus } from '../hooks/useApiStatus';
import { useToast } from '../components/ToastContext';

export default function P4_ColadeRevisiones() {
  const navigate = useNavigate();
  const { mode } = useApiStatus();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determinar si estamos en modo real o stub
  const isStubMode = mode === 'Stubs';

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.REVIEWS}?status=pending`);
      
      if (!response.ok) {
        throw new Error('No se pudo conectar con el servidor local.');
      }
      
      const data = await response.json();
      const allReviews = Array.isArray(data) ? data : [data];
      
      // Mostrar revisiones de etapa M_CURR (rutas pedagógicas completas)
      // Las de ACODE (códigos semánticos) van a P_Códigos
      const pedagogicalRouteReviews = allReviews.filter(
        item => item.stage === 'M_CURR' && item.status === 'pending'
      );
      
      setReviews(pedagogicalRouteReviews);
    } catch (err) {
      setError('Error al cargar los perfiles pendientes. Verifica que tu backend en Python (puerto 8000) esté encendido.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const response = await fetch(getReviewApproveUrl(reviewId), {
        method: 'POST',
      });

      if (response.ok) {
        showToast('Ruta de aprendizaje aprobada correctamente.', 'success');
        setReviews(currentReviews => currentReviews.filter(r => r.review_id !== reviewId));
      } else {
        showToast('Hubo un problema al aprobar la ruta en el servidor.', 'error');
      }
    } catch (err) {
      showToast('Error de red. Revisa tu conexión con el backend.', 'error');
      console.error(err);
    }
  };

  const handleReject = (reviewId) => {
    showToast('Revisión rechazada. Se ha notificado al Agente BDI para reevaluación.', 'info');
    setReviews(currentReviews => currentReviews.filter(r => r.review_id !== reviewId));
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
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-outline-variant/30 shadow-sm">
                    <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                    Productor: {review.pid.replace(/_/g, ' ')}
                  </div>
                  <button 
                    onClick={() => navigate(`/modelo-mental/${review.pid}`)}
                    className="text-xs bg-primary text-on-primary px-4 py-2.5 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">account_tree</span> Ver Grafo BDI
                  </button>
                  <button 
                    onClick={() => navigate(`/auditoria/${review.pid}`)}
                    className="text-xs bg-surface-container-highest text-on-surface hover:bg-error-container/10 px-4 py-2.5 rounded-full transition-all flex items-center gap-2 border border-outline-variant/30 font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">policy</span> Auditoría
                  </button>
                </div>
                <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface flex items-center gap-3">
                  Ruta Sugerida: <span className="capitalize text-primary">{review.payload?.route_type || 'No especificada'}</span>
                </h2>
              </div>

              {/* Justificación de la IA */}
              <div className="mb-8 relative">
                <h3 className="font-label-md text-secondary mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <span className="material-symbols-outlined">
                    {!isStubMode ? "psychology" : "settings"}
                  </span>
                  Justificación de AEXPL
                  {!isStubMode && (
                    <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full ml-2 border border-tertiary/20 font-bold">
                      GENERADO POR LLM ({mode.toUpperCase()})
                    </span>
                  )}
                  {isStubMode && (
                    <span className="text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full ml-2 border border-outline-variant/30 font-medium">
                      HEURÍSTICA (STUB)
                    </span>
                  )}
                </h3>
                <p className={`font-body-lg text-on-surface-variant leading-relaxed p-5 rounded-2xl border italic shadow-sm transition-colors ${
                  !isStubMode
                    ? "bg-white border-tertiary/20 shadow-tertiary/5"
                    : "bg-surface-container-highest/50 border-outline-variant/30"
                }`}>
                  "{review.payload?.explanation || 'Sin justificación disponible'}"
                </p>
              </div>

              {/* Lista de Módulos */}
              <div className="mb-8">
                <h3 className="font-label-md text-secondary mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <span className="material-symbols-outlined">view_list</span>
                  Módulos a Asignar
                </h3>
                <ul className="space-y-4">
                  {review.payload?.steps && Array.isArray(review.payload.steps) ? (
                    review.payload.steps.map((step, index) => (
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
                    ))
                  ) : (
                    <li className="text-on-surface-variant italic">Sin módulos definidos</li>
                  )}
                </ul>
              </div>

              {/* Botones de Acción (Touch-Friendly) */}
              <div className="flex flex-col md:flex-row justify-end gap-3 pt-2">
                <button
                  onClick={() => handleReject(review.review_id)}
                  className="w-full md:w-auto bg-surface-container hover:bg-error-container hover:text-error text-on-surface px-8 py-4 rounded-2xl font-label-md text-lg transition-all duration-300 flex items-center justify-center gap-3"
                  aria-label="Rechazar esta ruta de aprendizaje"
                >
                  <span className="material-symbols-outlined">cancel</span>
                  Rechazar
                </button>
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
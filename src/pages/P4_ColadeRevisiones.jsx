import { useState, useEffect } from 'react';

export default function PanelAuditoria() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ejecuta la carga de datos al montar el componente
  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      // Conexión al backend local de FastAPI
      const response = await fetch('http://127.0.0.1:8000/reviews?status=pending');
      
      if (!response.ok) {
        throw new Error('No se pudo conectar con el servidor local.');
      }
      
      const data = await response.json();
      
      // Nos aseguramos de que el estado siempre sea un arreglo (array)
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
        // Si el backend aprueba, quitamos la tarjeta de la pantalla inmediatamente
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
      <div className="flex justify-center items-center h-64">
        <p className="text-2xl text-agro-green font-bold animate-pulse">
          Cargando perfiles en cuarentena...
        </p>
      </div>
    );
  }

  // 2. Pantalla de error (ej. backend apagado)
  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-red-50 border-l-8 border-red-700 rounded-md shadow-md">
        <h2 className="text-xl font-bold text-red-900 mb-2">Aviso de Conexión</h2>
        <p className="text-lg text-red-800">{error}</p>
      </div>
    );
  }

  // 3. Pantalla principal del Panel
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Encabezado del Panel */}
      <header className="mb-8 border-b-4 border-agro-green pb-4">
        <h1 className="text-3xl md:text-5xl font-bold text-agro-green mb-3">
          Panel de Auditoría
        </h1>
        <p className="text-xl text-agro-earth font-medium">
          Revisión humana de rutas de aprendizaje generadas por el agente BDI.
        </p>
      </header>

      {/* Condicional: Si no hay datos vs Si hay datos */}
      {reviews.length === 0 ? (
        <div className="bg-white border-4 border-dashed border-agro-green p-12 text-center rounded-2xl shadow-sm">
          <p className="text-2xl text-agro-green font-bold">
            No hay perfiles pendientes de revisión en este momento.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <article 
              key={review.review_id} 
              className="bg-white border-2 border-agro-green rounded-2xl shadow-solid p-6 md:p-8"
            >
              {/* Identificación del Productor */}
              <div className="mb-6">
                <span className="inline-block bg-agro-light text-agro-green px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide mb-3 border border-agro-green">
                  Productor: {review.pid.replace(/_/g, ' ')}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Ruta Sugerida: <span className="capitalize">{review.payload.route_type}</span>
                </h2>
              </div>

              {/* Justificación de la IA */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-agro-earth mb-2">
                  Justificación del Sistema BDI:
                </h3>
                <p className="text-xl text-gray-800 leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-200">
                  {review.payload.explanation}
                </p>
              </div>

              {/* Lista de Módulos */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-agro-earth mb-4">
                  Módulos a Asignar:
                </h3>
                <ul className="space-y-4">
                  {review.payload.steps.map((step, index) => (
                    <li key={index} className="flex items-center gap-4 bg-agro-light p-4 rounded-xl border border-agro-green/30">
                      <div className="bg-agro-green text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-agro-green">
                          {step.title}
                        </p>
                        <p className="text-md text-agro-earth mt-1 font-mono">
                          ID: {step.module_id}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón de Acción (Touch-Friendly para el campo) */}
              <div className="flex justify-end pt-6 border-t-2 border-gray-100">
                <button
                  onClick={() => handleApprove(review.review_id)}
                  className="w-full md:w-auto bg-agro-warm hover:bg-[#CC7A00] text-white font-bold text-xl md:text-2xl py-4 px-8 rounded-xl active:scale-95 transition-transform duration-150 flex items-center justify-center gap-3 shadow-md"
                  aria-label="Aprobar esta ruta de aprendizaje"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Aprobar Ruta
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
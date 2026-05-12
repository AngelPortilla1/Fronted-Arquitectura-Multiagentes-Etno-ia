import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function P6_AprobacionCurricular() {
  const navigate = useNavigate();
  const [curricula, setCurricula] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurriculumReviews();
  }, []);

  const fetchCurriculumReviews = async () => {
    // Mock Data robusto para el Equipo Curricular
    const mockData = [
      {
        review_id: "rev_curr_101",
        pid: "segmento_el_rosal",
        status: "pending",
        risk_level: "Alto",
        payload: {
          route_type: "Alfabetización Base - Módulo Confianza",
          explanation: "La comunidad presenta un nivel de desconfianza crítico respecto a la privacidad. M_curr sugiere priorizar la soberanía de datos antes de enseñar conceptos de IA generativa.",
          steps: [
            { module_id: "MOD-C2", title: "Tus datos son tu cosecha", type: "Teórico-Práctico" },
            { module_id: "MOD-C1", title: "¿Qué es un modelo de IA?", type: "Análogo (Sin pantalla)" }
          ],
          quotes: [
            "La tecnología expone los datos de la finca al gobierno.",
            "Nos da miedo que nos roben la información de las siembras."
          ]
        }
      },
      {
        review_id: "rev_curr_102",
        pid: "campesino_la_lejania_02",
        status: "pending",
        risk_level: "Medio",
        payload: {
          route_type: "IA Offline Predictiva",
          explanation: "El productor entiende el beneficio de la IA, pero su limitante es la conectividad. Se adapta la ruta para usar modelos pequeños (SLMs) en el dispositivo móvil.",
          steps: [
            { module_id: "MOD-A1", title: "Inteligencia sin Internet", type: "Taller Práctico" },
            { module_id: "MOD-A3", title: "Asistentes de bolsillo (Ollama)", type: "Demostración" }
          ],
          quotes: [
            "Allá arriba en la vereda la señal es muy mala.",
            "Me preocupa que esas tecnologías necesiten internet todo el tiempo."
          ]
        }
      }
    ];

    try {
      // Tarea F3.2: Combinamos la consulta (en un backend real aquí usarías Promise.all o un endpoint compuesto)
      const response = await fetch('http://127.0.0.1:8000/reviews?status=pending&type=curriculum');
      if (response.ok) {
        const data = await response.json();
        const validData = Array.isArray(data) && data.length > 0 ? data : mockData;
        setCurricula(validData);
        setSelectedItem(validData[0]); // Seleccionamos el primero por defecto
      } else {
        setCurricula(mockData);
        setSelectedItem(mockData[0]);
      }
    } catch (err) {
      console.warn("Backend no disponible. Cargando entorno de prueba curricular.");
      setCurricula(mockData);
      setSelectedItem(mockData[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      // Simulamos la aprobación
      await fetch(`http://127.0.0.1:8000/reviews/${id}/approve`, { method: 'POST' });
      
      const updatedList = curricula.filter(item => item.review_id !== id);
      setCurricula(updatedList);
      setSelectedItem(updatedList.length > 0 ? updatedList[0] : null);
      
      alert('Ruta Curricular Aprobada. Se ha notificado al Agente M_curr.');
    } catch (err) {
      console.error(err);
      alert('Error al comunicar con la base de datos.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <span className="animate-spin material-symbols-outlined text-5xl text-secondary">sync</span>
        <p className="font-headline-md text-xl text-secondary animate-pulse">Sincronizando Módulo Curricular...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 flex flex-col h-[calc(100vh-120px)]">
      
      {/* Header */}
      <header className="mb-8 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/')} className="text-on-surface-variant hover:text-secondary transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          </button>
          <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface">
            Aprobación Curricular
          </h1>
        </div>
        <p className="font-body-md text-on-surface-variant ml-10">
          Entorno de validación pedagógica. Revise las sugerencias del agente M_curr antes de su despliegue en campo.
        </p>
      </header>

      {curricula.length === 0 ? (
        <div className="flex-1 bg-surface/60 backdrop-blur-md border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center p-8">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>task_alt</span>
          <h2 className="font-headline-md text-2xl text-on-surface-variant">Todo al día</h2>
          <p className="text-on-surface-variant opacity-80">No hay rutas curriculares pendientes de aprobación.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* Columna Izquierda: Lista de Pendientes */}
          <div className="w-full lg:w-1/3 bg-surface/80 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-container-highest flex items-center justify-between">
              <h3 className="font-label-md font-bold text-on-surface uppercase tracking-wider">Cola de Revisión</h3>
              <span className="bg-secondary text-on-secondary px-2 py-0.5 rounded-full text-xs font-bold">{curricula.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {curricula.map(item => (
                <button
                  key={item.review_id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    selectedItem?.review_id === item.review_id 
                      ? 'bg-secondary-container/20 border-secondary shadow-sm' 
                      : 'bg-surface-container hover:bg-surface-container-high border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-on-surface-variant">{item.review_id.split('_')[2]}</span>
                    {/* Tarea F4.3: RiskBadge integrado */}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      item.risk_level === 'Alto' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'
                    }`}>
                      Riesgo {item.risk_level}
                    </span>
                  </div>
                  <h4 className="font-headline-md text-lg text-on-surface truncate">{item.payload.route_type}</h4>
                  <p className="text-sm text-on-surface-variant truncate mt-1">Dirigido a: {item.pid.replace(/_/g, ' ')}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Detalle de la Ruta */}
          {selectedItem && (
            <div className="w-full lg:w-2/3 bg-surface/80 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl overflow-y-auto p-6 md:p-8 flex flex-col relative">
              
              <div className="mb-8 border-b border-outline-variant/30 pb-6">
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <span className="material-symbols-outlined">school</span>
                  <span className="font-label-md uppercase tracking-widest font-bold">Propuesta M_curr</span>
                </div>
                <h2 className="font-display-lg text-3xl font-bold text-on-surface mb-2">
                  {selectedItem.payload.route_type}
                </h2>
                <p className="font-body-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  Comunidad / Segmento: <strong className="text-on-surface capitalize">{selectedItem.pid.replace(/_/g, ' ')}</strong>
                </p>
              </div>

              {/* Justificación de IA y Trazabilidad (Corregido para tu estructura JSON) */}
<div className="grid md:grid-cols-2 gap-6 mb-8">
  <div className="bg-surface-container-highest p-5 rounded-2xl border border-outline-variant/30">
    <h3 className="font-label-md font-bold text-on-surface mb-2 flex items-center gap-2">
      <span className="material-symbols-outlined text-secondary">psychology</span>
      Razonamiento Pedagógico
    </h3>
    <p className="font-body-md text-on-surface-variant leading-relaxed">
      {selectedItem.payload.explanation}
    </p>
  </div>

  <div className="bg-surface-container p-5 rounded-2xl border-l-4 border-secondary shadow-inner">
    <h3 className="font-label-md font-bold text-on-surface mb-2 flex items-center gap-2">
      <span className="material-symbols-outlined text-secondary">visibility</span>
      Evidencia: Necesidades Detectadas
    </h3>
    <ul className="space-y-3">
      {/* MAPEO CRÍTICO: 
        Tu backend envía 'needs'. Si no existe, buscamos 'quotes'. 
        Si ambos fallan, mostramos un aviso de trazabilidad.
      */}
      {(selectedItem.payload.needs || selectedItem.payload.quotes || []).length > 0 ? (
        (selectedItem.payload.needs || selectedItem.payload.quotes).map((evidencia, idx) => (
          <li key={idx} className="text-sm font-body-md text-on-surface-variant italic leading-relaxed flex gap-2">
            <span className="text-secondary opacity-50">"</span>
            {evidencia}
            <span className="text-secondary opacity-50">"</span>
          </li>
        ))
      ) : (
        <li className="text-sm text-on-surface-variant opacity-60 italic">
          No se adjuntaron citas textuales en este envío. Verifique el relato original del PID: {selectedItem.pid}
        </li>
      )}
    </ul>
  </div>
</div>

              {/* Módulos Curriculares */}
              <div className="mb-10 flex-1">
                <h3 className="font-headline-md text-xl text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">view_timeline</span>
                  Estructura del Módulo
                </h3>
                <div className="space-y-3">
                  {selectedItem?.payload?.steps && Array.isArray(selectedItem.payload.steps) ? (
                    selectedItem.payload.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-outline-variant/50 hover:border-secondary transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-secondary-container/30 text-secondary flex items-center justify-center font-bold font-mono text-sm border border-secondary/20">
                          {step.module_id.split('-')[1]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-on-surface">{step.title}</h4>
                          <p className="text-sm text-on-surface-variant">{step.type}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-on-surface-variant">Sin módulos disponibles</p>
                  )}
                </div>
              </div>

              {/* Footer de Acción */}
              <div className="pt-6 border-t border-outline-variant/30 flex justify-end gap-4 mt-auto">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-3 rounded-xl font-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Diferir
                </button>
                <button 
                  onClick={() => handleApprove(selectedItem.review_id)}
                  className="bg-secondary hover:bg-[#653d1e] text-on-secondary px-8 py-3 rounded-xl font-label-md text-lg transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Aprobar y Desplegar
                </button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
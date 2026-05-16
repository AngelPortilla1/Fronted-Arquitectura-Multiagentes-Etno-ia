import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/client';

export default function P7_Auditoria() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);
  
  // Usamos uno de los PIDs reales de tu base de datos
  const { pid: targetPid } = useParams(); // Obtenemos el PID a auditar desde la URL 

  useEffect(() => {
    fetchAuditLogs();
  }, [targetPid]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUDIT); // Ajusta la ruta si es necesario para filtrar por PID
      if (response.ok) {
        let data = await response.json();
        
        // Filtramos para mostrar solo los de este productor (opcional)
        data = data.filter(log => log.pid === targetPid);
        
        // Ordenamos por fecha más reciente primero (opcional, dependiendo de cómo quieras verlo)
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.warn("Backend de auditoría no disponible.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    const confirmacion = window.confirm(
      "⚠️ ATENCIÓN: Esta acción es irreversible.\n\n" +
      `¿Está seguro que el productor ${targetPid} ha solicitado la revocación de su consentimiento? ` +
      "Esto eliminará su relato, su modelo mental BDI y su ruta curricular del sistema."
    );

    if (!confirmacion) return;

    setRevokingId(targetPid);
    try {
      // Endpoint simulado/real de revocación
      await fetch(API_ENDPOINTS.REVOKE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pid: targetPid, reason: "Solicitud directa del usuario en campo" })
      });
      alert("✅ Datos revocados exitosamente. El perfil ha sido purgado de la arquitectura BDI.");
      navigate('/'); 
    } catch (err) {
      console.error(err);
      alert("Error de conexión al intentar revocar los datos.");
      setRevokingId(null);
    }
  };

  // Función traductora para convertir el Payload JSON complejo a texto legible para el Auditor
  const extractDeltaText = (log) => {
    try {
      const { action, payload } = log;
      switch(action) {
        case 'validate_consent':
          return `Consentimiento: ${payload.decision.toUpperCase()}. Permisos: ${payload.allowed_scopes.join(', ')}`;
        case 'normalize':
          return `Texto normalizado (${payload.channel}): "${payload.normalized_text.substring(0, 70)}..."`;
        case 'suggest_probe':
          return `Pregunta de profundización sugerida: "${payload.question}"`;
        case 'assign_codes':
          const codes = payload.codes.map(c => c.code).join(', ');
          return `Códigos semánticos asignados: ${codes}`;
        case 'update_mental_model':
          return `Grafo actualizado (Revisión ${payload.revision}). Nodos: ${payload.nodes.length} | Relaciones nuevas: ${payload.edges.length}`;
        case 'evaluate_fairness':
          return `Evaluación de sesgos: ${payload.decision}. Acción recomendada: ${payload.recommended_action}`;
        case 'propose_route':
          return `Ruta candidata generada (${payload.route_type}). Módulos propuestos: ${payload.steps.length}`;
        case 'explain_route':
          return `Razonamiento LLM: "${payload.explanation.substring(0, 80)}..."`;
        case 'open_review':
          return `Revisión Humana Requerida (Estado: ${payload.status}). Rol: ${payload.required_role}`;
        case 'persist_delta':
          return `Delta guardado en base de datos. Hash de integridad: ${payload.data_hash.substring(0, 16)}...`;
        default:
          return `Registro modificado en capa de memoria: ${log.memory_layer}`;
      }
    } catch (e) {
      return "Detalles técnicos cifrados en el payload original.";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <span className="animate-spin material-symbols-outlined text-5xl text-on-surface-variant">sync</span>
        <p className="font-headline-md text-xl text-on-surface-variant animate-pulse">Recuperando cadena de auditoría criptográfica...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col h-[calc(100vh-120px)]">
      
      {/* Header */}
      <header className="mb-8 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/')} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          </button>
          <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface">
            Auditoría de Datos
          </h1>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between ml-10 gap-4">
          <p className="font-body-md text-on-surface-variant">
            Trazabilidad de eventos, firmas criptográficas y gestión de revocación de consentimiento (Privacy by Design).
          </p>
          <div className="bg-surface-container-highest px-4 py-2 rounded-xl text-sm font-mono border border-outline-variant/50">
            PID Auditado: <span className="font-bold text-on-surface">{targetPid}</span>
          </div>
        </div>
      </header>

      {/* Panel de Revocación (Zona Peligrosa) */}
      <div className="mb-8 bg-error-container/10 border border-error/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
        <div>
          <h3 className="font-headline-md text-error flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined">warning</span>
            Derecho al Olvido (Revocación)
          </h3>
          <p className="text-sm text-on-surface-variant font-body-md">
            Si el productor {targetPid.replace(/_/g, ' ')} retira su consentimiento, utilice esta acción para purgar sus datos brutos y modelos derivados del sistema, asegurando el cumplimiento ético.
          </p>
        </div>
        <button 
          onClick={handleRevoke}
          disabled={revokingId === targetPid}
          className="bg-error hover:bg-[#93000a] text-on-error px-6 py-3 rounded-xl font-label-md transition-colors flex items-center gap-2 shrink-0 shadow-sm"
        >
          {revokingId === targetPid ? (
            <><span className="animate-spin material-symbols-outlined">sync</span> Purgando...</>
          ) : (
            <><span className="material-symbols-outlined">delete_forever</span> Revocar Consentimiento</>
          )}
        </button>
      </div>

      {/* Cadena de Auditoría (Línea de tiempo técnica real) */}
      <div className="flex-1 bg-surface/80 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl overflow-hidden flex flex-col min-h-0">
        <div className="bg-surface-container-highest p-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant">history</span>
            <h2 className="font-label-md font-bold uppercase tracking-wider text-on-surface">Registro de Eventos (Log Criptográfico)</h2>
          </div>
          <span className="text-xs font-mono text-on-surface-variant">{logs.length} eventos registrados</span>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          {logs.length === 0 ? (
            <p className="text-center text-on-surface-variant italic">No hay eventos de auditoría para este productor.</p>
          ) : (
            logs.map((log, index) => (
              <div key={log.record_hash} className="relative pl-6 pb-6 border-l-2 border-outline-variant/30 last:pb-0 last:border-transparent group">
                {/* Timeline dot */}
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-surface border-2 border-primary group-hover:bg-primary transition-colors"></div>
                
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/20 hover:border-outline-variant transition-colors">
                  {/* Meta info */}
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-surface-container-highest px-2 py-1 rounded text-on-surface-variant border border-outline-variant/30 font-bold" title="Record Hash">
                        {log.record_hash.substring(0, 12)}...
                      </span>
                      {/* Badge dinámico según la capa de memoria */}
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-widest ${
                        log.memory_layer === 'M_policy' ? 'bg-error-container text-on-error-container' :
                        log.memory_layer === 'M_sem' ? 'bg-secondary-container text-on-secondary-container' :
                        log.memory_layer === 'M_graph' ? 'bg-tertiary-container text-on-tertiary-container' :
                        'bg-primary-container text-on-primary-container'
                      }`}>
                        {log.memory_layer}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-on-surface-variant opacity-70">
                      {new Date(log.timestamp).toLocaleString('es-CO')}
                    </span>
                  </div>

                  {/* Acción y Actor (Mapeados desde el JSON real) */}
                  <h4 className="font-headline-md text-lg text-on-surface mb-1 uppercase tracking-wide">
                    {log.action.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-sm text-on-surface-variant mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    Agente Responsable: <strong className="font-mono text-primary">{log.agent}</strong>
                  </p>

                  {/* Delta / Payload Traducido */}
                  <div className="bg-surface-container-highest p-3 rounded-xl border border-outline-variant/30">
                    <p className="text-xs font-bold text-on-surface-variant uppercase mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">data_object</span> Trazabilidad del Payload:
                    </p>
                    <p className="font-mono text-sm text-on-surface leading-relaxed">
                      {extractDeltaText(log)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
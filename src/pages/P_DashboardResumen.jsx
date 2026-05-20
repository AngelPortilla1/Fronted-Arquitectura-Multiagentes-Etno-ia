import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../api/client';

export default function P_DashboardResumen() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.DASHBOARD_SUMMARY);
        if (!response.ok) throw new Error('Error al cargar el resumen');
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <main className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-[calc(100vh-120px)] py-12">

      {/* Header */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[24px]">query_stats</span>
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface">
            Estado del Sistema
          </h1>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          Resumen ejecutivo en tiempo real de la plataforma ETNO-IA Rural 2.0. Visualice el impacto territorial,
          estado de sincronización y métricas operativas del sistema multiagente.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
        </div>
      ) : error ? (
        <div className="bg-error-container text-on-error-container p-6 rounded-2xl border border-error/20 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[48px] mb-2 opacity-80">error</span>
          <p className="font-bold mb-1">No se pudo cargar el estado del sistema</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-1000">

          {/* Card: Participantes Activos */}
          <div className="relative group p-6 rounded-3xl bg-surface/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container opacity-10 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-container/50 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">group</span>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">Territorio</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface-variant mb-1">Participantes Activos</p>
              <h3 className="text-4xl font-bold text-on-surface">{summary.active_participants}</h3>
            </div>
            <div className="mt-4 text-xs text-on-surface-variant opacity-70">
              Con modelos mentales registrados
            </div>
          </div>

          {/* Card: Revisiones Pendientes */}
          <div className="relative group p-6 rounded-3xl bg-surface/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary opacity-10 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-[#805533] flex items-center justify-center">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <span className="text-xs font-bold text-[#805533] bg-secondary/10 px-2 py-1 rounded-full uppercase tracking-wider">Curricular</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface-variant mb-1">Revisiones Pendientes</p>
              <h3 className="text-4xl font-bold text-on-surface">{summary.pending_reviews}</h3>
            </div>
            <div className="mt-4 text-xs text-on-surface-variant opacity-70">
              Requieren aprobación humana
            </div>
          </div>

          {/* Card: Sincronización Offline */}
          <div className="relative group p-6 rounded-3xl bg-surface/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-surface-tint opacity-10 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${summary.pending_deltas === 0 ? 'bg-primary-container/50 text-primary' : 'bg-tertiary-container/50 text-tertiary'}`}>
                <span className="material-symbols-outlined">{summary.pending_deltas === 0 ? 'cloud_done' : 'cloud_sync'}</span>
              </div>
              <span className="text-xs font-bold text-surface-tint bg-surface-tint/10 px-2 py-1 rounded-full uppercase tracking-wider">Auditoría</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface-variant mb-1">Estado Sincronización</p>
              <h3 className="text-2xl font-bold text-on-surface mt-2">
                {summary.pending_deltas === 0 ? 'Sincronizado' : `${summary.pending_deltas} Pendientes`}
              </h3>
            </div>
            <div className="mt-4 text-xs text-on-surface-variant opacity-70">
              Nodos offline integrados
            </div>
          </div>

          {/* Card: Último Segmento */}
          <div className="relative group p-6 rounded-3xl bg-surface/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary opacity-10 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-tertiary/20 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined">data_object</span>
              </div>
              <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full uppercase tracking-wider">Análisis</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface-variant mb-1">Último Segmento</p>
              <h3 className="text-lg font-bold text-on-surface leading-tight mt-1 line-clamp-2" title={summary.latest_segment?.segment_id}>
                {summary.latest_segment ? summary.latest_segment.segment_id : 'No hay segmentos'}
              </h3>
            </div>
            <div className="mt-4 text-xs text-on-surface-variant opacity-70">
              Generado recientemente
            </div>
          </div>

        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12 flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <Link to="/" className="flex items-center gap-2 bg-surface-container-highest text-on-surface px-6 py-3 rounded-2xl text-sm font-bold border border-outline-variant hover:bg-surface-container-high transition-all hover:-translate-y-0.5">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al Inicio
        </Link>
        <Link to="/revisiones" className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-2xl text-sm font-bold hover:shadow-md hover:-translate-y-0.5 transition-all">
          <span className="material-symbols-outlined text-[18px]">route</span>
          Ver Revisiones Pendientes
        </Link>
      </div>

    </main>
  );
}

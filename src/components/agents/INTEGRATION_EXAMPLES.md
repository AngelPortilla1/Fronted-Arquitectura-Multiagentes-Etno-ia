# Ejemplos de Integración en Páginas Reales

## 📍 Dónde se Integra el Sistema

El sistema principal está en:
- **Layout**: Header con dropdown (YA INTEGRADO)
- **Pages**: Pueden usar datos adicionales
- **Hooks**: Disponibles en cualquier componente

---

## 1. Home Page (P0_Home.jsx)

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { AgentNetworkVisualization } from '../components/agents';
import { getAgentsStatistics, generateSwarmSummary } from '../components/agents';

export default function HomePage() {
  const { agents, isLoading } = useAgentsStatus();

  const stats = getAgentsStatistics(agents);
  const summary = generateSwarmSummary(agents);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-tertiary-fixed/10 border border-outline-variant/20">
        <h1 className="text-headline-lg font-bold text-primary mb-2">
          🌾 ETNO-IA Rural 2.0
        </h1>
        <p className="text-on-surface-variant">{summary}</p>
      </div>

      {/* Network Stats */}
      {!isLoading && agents.length > 0 && (
        <AgentNetworkVisualization agents={agents} isLoading={isLoading} />
      )}

      {/* Cards de estadísticas */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Total Agentes" value={stats.total} />
        <StatCard label="Procesando" value={stats.working} color="tertiary-fixed" />
        <StatCard label="Eventos" value={stats.total_events} />
        <StatCard label="Uptime Promedio" value={`${stats.avg_uptime}s`} />
      </div>
    </div>
  );
}

function StatCard({ label, value, color = 'primary' }) {
  return (
    <div className={`p-4 rounded-lg border border-outline-variant/20 bg-surface-container`}>
      <p className="text-xs text-on-surface-variant mb-2">{label}</p>
      <p className={`text-2xl font-bold text-${color}`}>{value}</p>
    </div>
  );
}
```

---

## 2. Relato Registration Page (P1_RegistrarRelato.jsx)

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { hasCriticalErrors } from '../components/agents';

export default function RegistrarRelatoPage() {
  const { agents } = useAgentsStatus();
  const hasErrors = hasCriticalErrors(agents);

  return (
    <div className="space-y-6">
      {/* Alert si hay errores */}
      {hasErrors && (
        <div className="p-4 bg-error/10 border border-error/30 rounded-lg">
          <p className="text-error font-semibold">
            ⚠️ El enjambre de agentes tiene problemas. Algunos procesos pueden estar limitados.
          </p>
        </div>
      )}

      {/* Formulario */}
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Título del relato"
          className="w-full p-3 rounded-lg border border-outline-variant/20 bg-surface-container"
        />
        {/* más campos... */}
      </form>
    </div>
  );
}
```

---

## 3. Modelo Mental (P2_ModeloMental.jsx)

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { sortAgents, getAgentsByStatus } from '../components/agents';

export default function ModeloMentalPage() {
  const { agents } = useAgentsStatus();

  // Obtener solo agentes procesando
  const workingAgents = getAgentsByStatus(agents, 'WORKING');
  // Ordenar por más activos primero
  const sorted = sortAgents(workingAgents, 'events');

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md font-bold">Modelo Mental Cognitivo</h1>

      {/* Cards de agentes procesando tareas cognitivas */}
      <div className="grid md:grid-cols-2 gap-4">
        {sorted.map((agent) => (
          <div
            key={agent.id}
            className="p-4 rounded-lg bg-surface-container border border-outline-variant/20"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-on-surface">{agent.name}</h3>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                {agent.processed_events} eventos
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">{agent.current_task}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. Ruta Pedagógica (P3_RutaPedagogica.jsx)

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { getMostActiveAgent, getLongestRunningAgent } from '../components/agents';

export default function RutaPedagogicaPage() {
  const { agents } = useAgentsStatus();

  const mostActive = getMostActiveAgent(agents);
  const mostReliable = getLongestRunningAgent(agents);

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md font-bold">Ruta Pedagógica Adaptativa</h1>

      {/* Sección: Agentes Líderes */}
      <div className="grid md:grid-cols-2 gap-4">
        {mostActive && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-tertiary-fixed/10 to-tertiary-fixed/5 border border-tertiary-fixed/30">
            <p className="text-xs text-tertiary-fixed-variant uppercase tracking-wider mb-2">
              Más Activo
            </p>
            <h3 className="text-lg font-bold text-on-surface">{mostActive.name}</h3>
            <p className="text-sm text-on-surface-variant mt-2">
              {mostActive.processed_events} eventos procesados
            </p>
          </div>
        )}

        {mostReliable && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
            <p className="text-xs text-primary uppercase tracking-wider mb-2">
              Más Confiable
            </p>
            <h3 className="text-lg font-bold text-on-surface">{mostReliable.name}</h3>
            <p className="text-sm text-on-surface-variant mt-2">
              {Math.floor(mostReliable.uptime_seconds / 3600)} horas en línea
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 5. Cola de Revisiones (P4_ColadeRevisiones.jsx)

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { getAgentsByStatus, formatLastSeen } from '../components/agents';

export default function ColaRevisionesPage() {
  const { agents } = useAgentsStatus();

  // Agentes esperando revisión
  const waitingReview = getAgentsByStatus(agents, 'WAITING_REVIEW');

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md font-bold">Cola de Revisiones Cognitivas</h1>

      {waitingReview.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <p>✅ Sin agentes esperando revisión</p>
        </div>
      ) : (
        <div className="space-y-2">
          {waitingReview.map((agent) => (
            <div
              key={agent.id}
              className="p-4 rounded-lg bg-inverse-primary/5 border border-inverse-primary/30 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-on-surface">{agent.name}</p>
                <p className="text-xs text-on-surface-variant">
                  Esperando desde: {formatLastSeen(agent.last_seen)}
                </p>
              </div>
              <span className="text-xs bg-inverse-primary/20 text-inverse-primary px-3 py-1 rounded">
                Pendiente
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 6. Segmentos (P5_Segmentos.jsx)

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { getStatusPercentage, getAgentsStatistics } from '../components/agents';

export default function SegmentosPage() {
  const { agents } = useAgentsStatus();
  const stats = getAgentsStatistics(agents);

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md font-bold">Segmentación Cognitiva</h1>

      {/* Gráfico de distribución */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { status: 'WORKING', label: 'En Procesamiento', color: 'tertiary-fixed' },
          { status: 'IDLE', label: 'En Espera', color: 'primary' },
          { status: 'ERROR', label: 'Con Errores', color: 'error' },
        ].map(({ status, label, color }) => {
          const percentage = getStatusPercentage(agents, status);
          return (
            <div key={status} className="p-4 rounded-lg bg-surface-container border border-outline-variant/20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-on-surface-variant">{label}</p>
                <p className={`font-bold text-${color}`}>{percentage}%</p>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                <div
                  className={`bg-${color} h-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 7. Aprobación Curricular (P6_AprobacionCurricular.jsx)

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { areAllAgentsHealthy } from '../components/agents';

export default function AprobacionCurricularPage() {
  const { agents } = useAgentsStatus();
  const isHealthy = areAllAgentsHealthy(agents);

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md font-bold">Aprobación Curricular</h1>

      {/* Health check antes de proceder */}
      {!isHealthy && (
        <div className="p-6 bg-error/10 border-2 border-error rounded-lg">
          <p className="text-error font-bold mb-2">⚠️ Enjambre no saludable</p>
          <p className="text-sm text-error/80">
            No se pueden procesar aprobaciones hasta que todos los agentes estén en estado saludable.
          </p>
        </div>
      )}

      {isHealthy && (
        <div className="p-6 bg-primary/10 border-2 border-primary rounded-lg">
          <p className="text-primary font-bold mb-2">✅ Enjambre saludable</p>
          <p className="text-sm text-primary/80">
            Procesar aprobaciones curriculares con confianza.
          </p>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-semibold">
            Proceder con Aprobación
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 8. Auditoría (P7_Auditoria.jsx)

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { exportAgentsData } from '../components/agents';

export default function AuditoriaPage() {
  const { agents } = useAgentsStatus();

  const handleExportAudit = () => {
    const data = exportAgentsData(agents);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria-agentes-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md font-bold">Auditoría de Enjambre BDI</h1>
        <button
          onClick={handleExportAudit}
          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-fixed transition"
        >
          📥 Exportar Reporte
        </button>
      </div>

      {/* Tabla de agentes */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-outline-variant/30">
            <tr className="text-on-surface-variant text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Eventos</th>
              <th className="p-3">Uptime</th>
              <th className="p-3">Último Visto</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-b border-outline-variant/10 hover:bg-surface-container">
                <td className="p-3 font-mono text-primary font-semibold">{agent.id}</td>
                <td className="p-3">{agent.name}</td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded bg-primary/20 text-primary">
                    {agent.status}
                  </span>
                </td>
                <td className="p-3">{agent.processed_events}</td>
                <td className="p-3 text-xs text-on-surface-variant">{agent.uptime_seconds}s</td>
                <td className="p-3 text-xs text-on-surface-variant">
                  {agent.last_seen?.split('T')[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 🎯 Patrón General

Todos los ejemplos siguen este patrón:

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { UTILITY_FUNCTIONS } from '../components/agents';

export default function MyPage() {
  // 1. Usar hook
  const { agents, isLoading } = useAgentsStatus();

  // 2. Aplicar utilidades
  const data = UTILITY_FUNCTIONS(agents);

  // 3. Renderizar condicional
  if (isLoading) return <LoadingState />;
  if (agents.length === 0) return <EmptyState />;

  // 4. Mostrar datos
  return <ContentState data={data} />;
}
```

---

**Última actualización**: 12 mayo 2026
**Versión**: 1.0.0

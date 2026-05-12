# Guía Avanzada - Sistema de Observabilidad Cognitiva

## 🚀 Ejemplos de Uso Avanzado

### 1. Usar Estadísticas Globales del Enjambre

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';
import { getAgentsStatistics, generateSwarmSummary } from '../components/agents';

function AdvancedDashboard() {
  const { agents } = useAgentsStatus();

  const stats = getAgentsStatistics(agents);
  const summary = generateSwarmSummary(agents);

  return (
    <div>
      <h1>{summary}</h1>
      <p>Total de eventos: {stats.total_events}</p>
      <p>Uptime promedio: {stats.avg_uptime}s</p>
      <p>Agentes procesando: {stats.working}</p>
    </div>
  );
}
```

### 2. Filtrar Agentes por Estado

```jsx
import { getAgentsByStatus } from '../components/agents';

function WorkingAgentsOnly({ agents }) {
  const workingAgents = getAgentsByStatus(agents, 'WORKING');

  return (
    <div>
      {workingAgents.map(agent => (
        <div key={agent.id}>{agent.current_task}</div>
      ))}
    </div>
  );
}
```

### 3. Detectar Problemas Críticos

```jsx
import { hasCriticalErrors, areAllAgentsHealthy } from '../components/agents';

function SwarmHealthCheck({ agents }) {
  const hasProblem = hasCriticalErrors(agents);
  const isHealthy = areAllAgentsHealthy(agents);

  return (
    <div>
      {hasProblem && <Alert severity="error">Hay agentes con error</Alert>}
      {!isHealthy && <Alert severity="warning">Salud comprometida</Alert>}
      {isHealthy && <Alert severity="success">Enjambre saludable</Alert>}
    </div>
  );
}
```

### 4. Ordenar y Agrupar Agentes

```jsx
import { sortAgents } from '../components/agents';

function SortedAgentsList({ agents }) {
  const sorted = sortAgents(agents, 'events'); // Más activos primero

  return (
    <ul>
      {sorted.map(agent => (
        <li key={agent.id}>
          {agent.name}: {agent.processed_events} eventos
        </li>
      ))}
    </ul>
  );
}
```

### 5. Exportar Datos para Análisis

```jsx
import { exportAgentsData } from '../components/agents';

function ExportButton({ agents }) {
  const handleExport = () => {
    const data = exportAgentsData(agents);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agents-${Date.now()}.json`;
    a.click();
  };

  return <button onClick={handleExport}>Exportar JSON</button>;
}
```

### 6. Encontrar Agente Más Activo

```jsx
import { getMostActiveAgent, getLongestRunningAgent } from '../components/agents';

function TopAgents({ agents }) {
  const mostActive = getMostActiveAgent(agents);
  const longestRunning = getLongestRunningAgent(agents);

  return (
    <div>
      <p>Más activo: {mostActive?.name} ({mostActive?.processed_events} eventos)</p>
      <p>Más tiempo: {longestRunning?.name} ({longestRunning?.uptime_seconds}s)</p>
    </div>
  );
}
```

### 7. Monitorear Actividad Reciente

```jsx
import { hasRecentActivity } from '../components/agents';

function ActivityMonitor({ agents }) {
  const hasActivity = hasRecentActivity(agents, 30); // Últimos 30 segundos

  return (
    <div>
      {hasActivity ? (
        <span>🔴 Actividad reciente</span>
      ) : (
        <span>🟢 Sin actividad reciente</span>
      )}
    </div>
  );
}
```

### 8. Estadísticas de Estado

```jsx
import { getStatusPercentage } from '../components/agents';

function StatusDistribution({ agents }) {
  return (
    <div>
      <p>Procesando: {getStatusPercentage(agents, 'WORKING')}%</p>
      <p>En espera: {getStatusPercentage(agents, 'IDLE')}%</p>
      <p>Con error: {getStatusPercentage(agents, 'ERROR')}%</p>
    </div>
  );
}
```

### 9. Agregar Visualización de Red

```jsx
import { AgentNetworkVisualization } from '../components/agents';
import { useAgentsStatus } from '../hooks/useAgentsStatus';

function AdvancedUI() {
  const { agents, isLoading } = useAgentsStatus();

  return (
    <div>
      <AgentStatusDropdown agents={agents} isLoading={isLoading} />
      <AgentNetworkVisualization agents={agents} isLoading={isLoading} />
    </div>
  );
}
```

### 10. Validar Estructura de Agente

```jsx
import { isValidAgent } from '../components/agents';

function SafeAgentRenderer({ agent }) {
  if (!isValidAgent(agent)) {
    return <div>Agente inválido</div>;
  }

  return <AgentStatusItem agent={agent} />;
}
```

---

## 🔄 Migración de Polling a WebSockets

Para escalar a tiempo real con WebSockets:

```javascript
// Antes (Polling con HTTP)
export function useAgentsStatus() {
  const [agents, setAgents] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/agents/status');
      setAgents(res.json().agents);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return { agents };
}

// Después (WebSocket)
export function useAgentsStatus() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/agents/stream');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAgents(normalizeAgents(data.agents));
    };

    return () => socket.close();
  }, []);

  return { agents };
}
```

---

## 📊 Crear Componentes Derivados

### AgentActivityLog

```jsx
export function AgentActivityLog({ agent }) {
  return (
    <div>
      <h3>{agent.name}</h3>
      <p>Última actividad: {formatLastSeen(agent.last_seen)}</p>
      <p>Uptime: {formatUptime(agent.uptime_seconds)}</p>
      <p>Eventos procesados: {agent.processed_events}</p>
      {agent.current_task && <p>Tarea: {agent.current_task}</p>}
    </div>
  );
}
```

### AgentErrorBoundary

```jsx
export function AgentErrorBoundary({ agent, children }) {
  if (agent.status === 'ERROR') {
    return (
      <div className="p-4 bg-error/10 border border-error rounded">
        <p className="font-bold text-error">Error en {agent.name}</p>
        {agent.error && <p className="text-sm">{agent.error}</p>}
      </div>
    );
  }

  return children;
}
```

### AgentPerformanceChart

```jsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

export function AgentPerformanceChart({ agents }) {
  const data = agents.map(a => ({
    name: a.id,
    events: a.processed_events,
    uptime: a.uptime_seconds,
  }));

  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Line type="monotone" dataKey="events" stroke="#c8f17a" />
    </LineChart>
  );
}
```

---

## 🎯 Patrones de Arquitectura

### Patrón: Custom Hook + Context

```jsx
// AgentContext.js
const AgentContext = createContext();

export function AgentProvider({ children }) {
  const { agents, isLoading, error } = useAgentsStatus();

  return (
    <AgentContext.Provider value={{ agents, isLoading, error }}>
      {children}
    </AgentContext.Provider>
  );
}

export const useAgents = () => useContext(AgentContext);

// En componentes
function MyComponent() {
  const { agents } = useAgents();
  // ...
}
```

### Patrón: Redux/Zustand Integration

```javascript
// agentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const agentSlice = createSlice({
  name: 'agents',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    setAgents: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export default agentSlice.reducer;
```

---

## 🧪 Testing

```javascript
// __tests__/useAgentsStatus.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useAgentsStatus } from '../hooks/useAgentsStatus';

describe('useAgentsStatus', () => {
  it('fetches agents on mount', async () => {
    const { result } = renderHook(() => useAgentsStatus());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.agents)).toBe(true);
  });
});
```

---

## 🔌 Integración con Monitor Externo

```javascript
// Ejemplo: Prometheus metrics
export function exposeMetrics(agents) {
  const stats = getAgentsStatistics(agents);
  
  return {
    'agents_total': stats.total,
    'agents_working': stats.working,
    'agents_error': stats.error,
    'total_events': stats.total_events,
  };
}
```

---

## 📱 Componentes Responsivos

```jsx
// Mobile + Desktop
export function ResponsiveAgentStatus({ agents, isLoading }) {
  return (
    <div className="block md:hidden lg:hidden">
      {/* Mobile: Simple view */}
      <AgentStatusDropdown agents={agents} isLoading={isLoading} />
    </div>

    <div className="hidden md:block lg:block">
      {/* Desktop: Full view */}
      <div className="grid grid-cols-2 gap-4">
        <AgentStatusDropdown agents={agents} isLoading={isLoading} />
        <AgentNetworkVisualization agents={agents} isLoading={isLoading} />
      </div>
    </div>
  );
}
```

---

## 🚨 Error Handling Avanzado

```javascript
export function useAgentsStatusWithRetry(maxRetries = 3) {
  const [agents, setAgents] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchWithRetry = async () => {
      try {
        const res = await fetch('/agents/status');
        setAgents(res.json().agents);
      } catch (err) {
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          setTimeout(fetchWithRetry, 2000 * retryCount); // Backoff exponencial
        }
      }
    };

    fetchWithRetry();
  }, [retryCount, maxRetries]);

  return { agents };
}
```

---

## 🎨 Temas Personalizados

```javascript
// theming.js
export const THEMES = {
  light: {
    primary: '#061b0e',
    working: '#c8f17a',
    error: '#ba1a1a',
  },
  dark: {
    primary: '#b4cdb8',
    working: '#203000',
    error: '#f9dedc',
  },
};

// Usar en componentes
const theme = THEMES.dark;
```

---

**Última actualización**: 12 mayo 2026
**Versión**: 1.0.0

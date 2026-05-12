# Especificación Técnica - Sistema de Observabilidad Cognitiva

## 📋 Resumen Ejecutivo

Implementación de capa de observabilidad institucional para visualizar estado REAL del enjambre BDI en ETNO-IA Rural 2.0.

**Stack**: React 18+ | Tailwind CSS 3+ | FastAPI backend | Material Symbols

---

## 🏗️ Arquitectura de Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                   LAYOUT (Header)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   AgentStatusDropdown (Componente Principal)        │   │
│  │   ┌─ Button: Estado Actual                          │   │
│  │   ├─ Dropdown Panel: Lista de Agentes              │   │
│  │   └─ Stats Footer: Resumen de Métricas             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ▲
         │ (polling c/5s)
         │
┌─────────────────────────────────────────────────────────────┐
│                 useAgentsStatus Hook                        │
│  ┌─ Fetch from GET /agents/status                         │
│  ├─ Normalize & Validate                                  │
│  ├─ Error Handling                                        │
│  └─ Return { agents, isLoading, error, refetch }         │
└─────────────────────────────────────────────────────────────┘
         ▲
         │
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend                               │
│  GET http://127.0.0.1:8000/agents/status                  │
│  Response: { agents: [...] }                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estructura de Directorios Final

```
src/
├── components/
│   ├── agents/                          # Sistema de observabilidad
│   │   ├── AgentStatusDropdown.jsx      # Componente principal
│   │   ├── AgentStatusItem.jsx          # Card de agente
│   │   ├── AgentNetworkVisualization.jsx # Visualización stats
│   │   ├── statusStyles.js              # Configuración estilos
│   │   ├── agentsUtils.js               # Funciones utilitarias
│   │   ├── index.js                     # Exportaciones
│   │   ├── README.md                    # Documentación general
│   │   ├── ADVANCED.md                  # Casos avanzados
│   │   └── INTEGRATION_EXAMPLES.md      # Ejemplos de uso
│   └── layout.jsx                       # YA INTEGRADO
├── hooks/
│   └── useAgentsStatus.js               # Hook mejorado
├── pages/
│   ├── P0_Home.jsx
│   ├── P1_RegistrarRelato.jsx
│   ├── P2_ModeloMental.jsx
│   ├── P3_RutaPedagogica.jsx
│   ├── P4_ColadeRevisiones.jsx
│   ├── P5_Segmentos.jsx
│   ├── P6_AprobacionCurricular.jsx
│   └── P7_Auditoria.jsx
└── api/
    └── client.js
```

---

## 🔌 API Specification

### Endpoint

```
GET http://127.0.0.1:8000/agents/status
```

### Request Headers

```
Accept: application/json
```

### Response Schema

```typescript
{
  "agents": [
    {
      "id": string,                    // Identificador único
      "name": string,                  // Nombre legible
      "status": "WORKING" | "IDLE" | "WAITING_REVIEW" | "ERROR" | "OFFLINE",
      "current_task": string | null,   // Tarea en progreso
      "processed_events": number,      // Total de eventos
      "last_seen": string,            // ISO 8601 timestamp
      "uptime_seconds": number,        // Segundos activo
      "error"?: string,               // Opcional: mensaje de error
      "metadata"?: object             // Opcional: datos extras
    }
  ]
}
```

### Example Response

```json
{
  "agents": [
    {
      "id": "AETHNO",
      "name": "Agente Etnográfico",
      "status": "WORKING",
      "current_task": "Generando hipótesis netnográficas",
      "processed_events": 24,
      "last_seen": "2026-05-12T20:12:00Z",
      "uptime_seconds": 1420
    },
    {
      "id": "AGEO",
      "name": "Agente Geoespacial",
      "status": "IDLE",
      "current_task": null,
      "processed_events": 156,
      "last_seen": "2026-05-12T20:15:30Z",
      "uptime_seconds": 3600
    },
    {
      "id": "ACULT",
      "name": "Agente Cultural",
      "status": "ERROR",
      "current_task": null,
      "processed_events": 42,
      "last_seen": "2026-05-12T20:10:00Z",
      "uptime_seconds": 900,
      "error": "Conexión con base de datos perdida"
    }
  ]
}
```

---

## 🎨 Especificación de Estilos Cognitivos

### Estado: WORKING (Amarillo)

| Propiedad | Valor |
|-----------|-------|
| Label | "Procesando" |
| Color primario | `tertiary-fixed-dim` (#c8f17a) |
| Background | `bg-tertiary-fixed/10` |
| Border | `border-tertiary-fixed-dim/50` |
| Dot animado | Sí (pulse) |
| Icon | `engineering` |
| Glow | `shadow-lg shadow-tertiary-fixed/20` |

### Estado: IDLE (Verde)

| Propiedad | Valor |
|-----------|-------|
| Label | "En Espera" |
| Color primario | `primary` (#061b0e) |
| Background | `bg-primary/10` |
| Border | `border-primary/30` |
| Dot animado | No |
| Icon | `check_circle` |
| Glow | `shadow-lg shadow-primary/15` |

### Estado: WAITING_REVIEW (Azul)

| Propiedad | Valor |
|-----------|-------|
| Label | "Revisión Pendiente" |
| Color primario | `inverse-primary` (#b4cdb8) |
| Background | `bg-inverse-primary/10` |
| Border | `border-inverse-primary/30` |
| Dot animado | Sí (pulse) |
| Icon | `pending_actions` |
| Glow | `shadow-lg shadow-inverse-primary/15` |

### Estado: ERROR (Rojo)

| Propiedad | Valor |
|-----------|-------|
| Label | "Error" |
| Color primario | `error` (#ba1a1a) |
| Background | `bg-error/10` |
| Border | `border-error/30` |
| Dot animado | Sí (pulse) |
| Icon | `error` |
| Glow | `shadow-lg shadow-error/20` |

### Estado: OFFLINE (Gris)

| Propiedad | Valor |
|-----------|-------|
| Label | "Inactivo" |
| Color primario | `outline-variant` (#737973) |
| Background | `bg-outline-variant/10` |
| Border | `border-outline-variant/30` |
| Dot animado | No |
| Icon | `offline_pin` |
| Glow | Ninguno |

---

## 🎯 Comportamiento del Hook

### useAgentsStatus Lifecycle

```
┌─────────────────────────────┐
│   Component Mount           │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│   First Fetch (Immediate)   │
│   isLoading = true          │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│   Success: Normalize Data   │
│   isLoading = false         │
│   Start Interval (5s)       │
└────────────┬────────────────┘
             │
    ┌────────▼────────┐
    │ Every 5 seconds │
    └────────┬────────┘
             │
             ▼
┌─────────────────────────────┐
│   Repeat Fetch              │
│   Validate & Normalize      │
│   Update State              │
└─────────────────────────────┘
```

### Manejo de Errores

```javascript
try {
  // Fetch con AbortController
  const response = await fetch(url, { signal });
  
  if (!response.ok) {
    throw new Error(`Status ${response.status}`);
  }
  
  // Normalizar datos
  const normalized = normalizeAgents(data);
  setAgents(normalized);
  setError(null);
  
} catch (err) {
  if (err.name !== 'AbortError') {
    // Registrar error pero mantener datos previos
    setError(err.message);
    // agents mantiene valor anterior (fallback)
  }
} finally {
  setIsLoading(false);
}
```

---

## 🎭 Componente: AgentStatusDropdown

### Props

```typescript
interface AgentStatusDropdownProps {
  agents: Array<{
    id: string;
    name: string;
    status: string;
    current_task?: string;
    processed_events?: number;
    last_seen?: string;
    uptime_seconds?: number;
  }>;
  isLoading: boolean;
  error?: string | null;
}
```

### Estados Renderizables

1. **Error State**
   - Botón rojo con icono error
   - Tooltip con mensaje de error

2. **Loading State**
   - Spinner animado
   - "Sincronizando estado del enjambre..."

3. **Empty State**
   - Cloud off icon
   - "No hay agentes disponibles"

4. **Normal State**
   - Lista de AgentStatusItem
   - Footer con estadísticas
   - Cards interactivos con hover

### Interacciones

- Click botón: Toggle dropdown
- Hover agente: Scale 105% + glow
- Scroll: Smooth overscroll
- Click Close: Cierra dropdown
- Click outside: No cierra (necesita close button)

---

## 🎭 Componente: AgentStatusItem

### Props

```typescript
interface AgentStatusItemProps {
  agent: {
    id: string;
    name: string;
    status: string;
    current_task?: string;
    processed_events?: number;
    last_seen?: string;
    uptime_seconds?: number;
  };
}
```

### Estructura Visual

```
┌─────────────────────────────────┐
│ Header: ID Badge + Name + Dot   │
├─────────────────────────────────┤
│ Body: Current Task Container    │
├─────────────────────────────────┤
│ Footer: Métricas + Status Label │
└─────────────────────────────────┘
```

---

## 🧠 Utilidades (agentsUtils.js)

### Funciones Disponibles

```javascript
// Estadísticas
getAgentsStatistics(agents)        // Retorna objeto con stats agregadas
getStatusPercentage(agents, status) // % de agentes en estado

// Búsqueda y filtrado
getAgentsByStatus(agents, status)   // Array filtrado
getMostActiveAgent(agents)          // Agente con más eventos
getLongestRunningAgent(agents)      // Agente con mayor uptime

// Análisis de salud
hasCriticalErrors(agents)           // Boolean: hay errores
areAllAgentsHealthy(agents)         // Boolean: todos bien
hasRecentActivity(agents, seconds)  // Boolean: actividad reciente

// Transformación
sortAgents(agents, sortBy)          // Ordena por criterio
generateSwarmSummary(agents)        // String descriptivo

// Exportación
exportAgentsData(agents)            // JSON para debugging

// Validación
isValidAgent(agent)                 // Boolean: estructura válida
```

---

## 📊 Especificación de Polling

### Configuración

```javascript
{
  interval: 5000,              // 5 segundos
  strategy: 'interval',        // Usar setInterval
  preparedFor: 'WebSocket',    // Migración futura simple
  errorHandling: 'fallback',   // Mantiene datos previos
  cleanup: 'automatic'         // useEffect cleanup
}
```

### Beneficios del Polling (5s)

- ✅ Suficientemente rápido para observabilidad
- ✅ No sobrecarga servidor
- ✅ Compatible con cualquier backend
- ✅ Fácil de debuggear
- ✅ Preparado para migración WebSocket

---

## 🔐 Seguridad y Performance

### Medidas de Seguridad

- ✅ AbortController: Cancela requests en progreso
- ✅ Validación de datos: normalizeAgents()
- ✅ Error boundary: Fallbacks elegantes
- ✅ Memory leak prevention: useEffect cleanup
- ✅ No eval/dangerousHTML

### Optimizaciones

- ✅ Memoization-ready (preparado para React.memo)
- ✅ Lazy loading de dropdown
- ✅ CSS animations (GPU-accelerated)
- ✅ Efficient re-renders
- ✅ No infinite loops

---

## 🚀 Preparación para WebSockets

### Cambios Necesarios (Futura Migración)

```javascript
// Cambiar useAgentsStatus.js
// De: setInterval(fetch, 5000)
// A: socket.onmessage = () => setAgents(data)

// La interfaz se mantiene igual:
// return { agents, isLoading, error, refetch }

// Los componentes NO cambian
```

---

## 📱 Responsiveness

### Breakpoints

- **Mobile**: Dropdown completo, scroll
- **Tablet**: Panel optimizado
- **Desktop**: Full featured + visualizaciones

### CSS Media Queries

```css
/* Desktop only */
@screen lg {
  .lg:block { display: block; }
  .hidden { display: none; }
}

/* Mobile first */
.block { display: block; }
.md:hidden { @screen md { display: none; } }
```

---

## 🎯 Testing Checklist

- [ ] Fetch inicial funciona
- [ ] Polling cada 5s
- [ ] Normalización de datos
- [ ] Error handling (sin crashes)
- [ ] Cleanup en unmount
- [ ] Dropdown abre/cierra
- [ ] Hover effects funcionan
- [ ] Responsiveness OK
- [ ] No memory leaks
- [ ] Console limpia

---

## 📈 Métricas Cognitivas Futuras

Preparado para:
- 📊 Gráficos de actividad temporal
- 🔗 Topología de agentes
- 📜 Timeline de eventos
- 🧠 Métricas cognitivas (confidencia, etc.)
- 🕵️ Trazas del orquestador BDI

---

## 🔗 Referencias de Inspiración

- **LangGraph Studio**: Control de flujos multi-agente
- **OpenTelemetry**: Observabilidad distribuida
- **AI Control Rooms**: UX para sistemas inteligentes
- **Material Design 3**: Paleta de colores y tipografía
- **BDI Architectures**: Conceptos de agentes cognitivos

---

## 📝 Versionamiento

```
v1.0.0 - Release Inicial
├─ Hook mejorado
├─ Componentes principales
├─ Estilos cognitivos
├─ Documentación completa
└─ Preparado para extensiones

v1.1.0 (Futuro)
├─ WebSocket support
├─ Real-time metrics
└─ Timeline visualization

v2.0.0 (Futuro)
├─ Topología gráfica
├─ Métricas avanzadas
└─ Dashboard personalizable
```

---

**Especificación Versión**: 1.0.0
**Última Actualización**: 12 mayo 2026
**Estado**: ✅ Production Ready

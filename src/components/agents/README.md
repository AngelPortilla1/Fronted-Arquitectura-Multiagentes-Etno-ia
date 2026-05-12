# Sistema de Observabilidad Cognitiva Multi-Agente ETNO-IA Rural 2.0

## 📋 Descripción General

Implementación profesional de una capa de observabilidad institucional para visualizar el estado REAL del enjambre BDI en el frontend de ETNO-IA Rural 2.0.

Sistema diseñado como una **sala de control cognitiva** moderna, no como un dashboard tradicional.

---

## 🏗️ Estructura de Archivos

```
src/
├── components/
│   ├── agents/
│   │   ├── AgentStatusDropdown.jsx      # Componente principal dropdown
│   │   ├── AgentStatusItem.jsx          # Componente individual de agente
│   │   ├── statusStyles.js              # Configuración centralizada de estilos
│   │   └── index.js                     # Exportaciones
│   └── layout.jsx                       # Integrado en el header
├── hooks/
│   └── useAgentsStatus.js               # Hook profesional de polling
└── ...
```

---

## 🧠 Estados Cognitivos

| Estado | Color | Significado | Animación |
|--------|-------|-------------|-----------|
| **WORKING** | Amarillo (tertiary-fixed) | Ejecutando tarea activamente | ✅ Animado |
| **IDLE** | Verde (primary) | Esperando eventos | ❌ Estático |
| **WAITING_REVIEW** | Azul (inverse-primary) | Esperando validación humana | ✅ Animado |
| **ERROR** | Rojo (error) | Fallo en ejecución | ✅ Animado |
| **OFFLINE** | Gris (outline-variant) | Inactivo o desconectado | ❌ Estático |

---

## 🔌 Integración del Backend

### Endpoint Esperado

```
GET http://127.0.0.1:8000/agents/status
```

### Formato de Respuesta

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
    }
  ]
}
```

---

## 🎯 Uso del Hook `useAgentsStatus`

### Ejemplo Básico

```jsx
import { useAgentsStatus } from '../hooks/useAgentsStatus';

function MyComponent() {
  const { agents, isLoading, error } = useAgentsStatus();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {agents.map(agent => (
        <div key={agent.id}>
          {agent.name}: {agent.status}
        </div>
      ))}
    </div>
  );
}
```

### Propiedades Retornadas

```typescript
{
  agents: Array<Agent>,              // Lista normalizada de agentes
  isLoading: boolean,                 // Sincronización en progreso
  error: string | null,               // Mensaje de error si hay
  refetch: () => Promise<void>        // Función para actualizar manualmente
}
```

### Estructura de un Agente

```typescript
interface Agent {
  id: string;                         // ID único del agente
  name: string;                       // Nombre legible
  status: string;                     // Estado (WORKING, IDLE, etc.)
  current_task: string | null;        // Tarea actual
  processed_events: number;           // Total de eventos procesados
  last_seen: string | null;           // ISO timestamp
  uptime_seconds: number;             // Segundos activo
  error?: string;                     // Error si existe
  metadata?: Record<string, any>;     // Datos adicionales
}
```

---

## 🎨 Uso del Componente `AgentStatusDropdown`

### Instalación en Layout

```jsx
import { AgentStatusDropdown } from './agents/AgentStatusDropdown';
import { useAgentsStatus } from '../hooks/useAgentsStatus';

export default function Layout() {
  const { agents, isLoading, error } = useAgentsStatus();

  return (
    <div>
      {/* En el header */}
      <AgentStatusDropdown 
        agents={agents} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}
```

### Props

```typescript
interface AgentStatusDropdownProps {
  agents: Agent[];                    // Lista de agentes
  isLoading: boolean;                 // Estado de carga
  error: string | null;               // Mensaje de error
}
```

---

## 🎭 Comportamiento Cognitivo

### Botón Principal

- Muestra icono 🧠 (neurology)
- Indica cantidad de agentes procesando
- Display dinámico:
  - Si hay procesamiento: "🧠 3 Procesando"
  - Si está sincronizando: "⟳ Sincronizando..."
  - Si inactivo: "5 Agentes"

### Estados Visuales

#### Loading
- Spinner animado
- "Sincronizando estado del enjambre..."

#### Empty
- Icono cloud_off
- "No hay agentes disponibles"
- Sugerencia de conectar backend

#### Error
- Botón rojo con icono error
- Mensaje de error hover
- Fallback visual sin crash

#### Normal
- Lista de agentes con cards
- Glow effect en hover
- Footer con estadísticas

---

## 📊 Configuración de Estilos

### Módulo `statusStyles.js`

Contiene la configuración centralizada de estilos según estado:

```javascript
import { getStateConfig, formatUptime, formatLastSeen } from './statusStyles';

const config = getStateConfig('WORKING');
// {
//   label: 'Procesando',
//   color: 'tertiary-fixed-dim',
//   bgColor: 'bg-tertiary-fixed/10',
//   borderColor: 'border-tertiary-fixed-dim/50',
//   dotColor: 'bg-tertiary-fixed',
//   glowColor: 'shadow-lg shadow-tertiary-fixed/20',
//   textColor: 'text-tertiary-fixed',
//   icon: 'engineering',
//   animated: true
// }
```

### Funciones Útiles

```javascript
// Verificar si está procesando
import { isProcessing } from './statusStyles';
if (isProcessing(agent.status)) { /* */ }

// Formatear tiempo
import { formatUptime } from './statusStyles';
const uptime = formatUptime(3661); // "1h 1m"

// Último visto legible
import { formatLastSeen } from './statusStyles';
const seen = formatLastSeen("2026-05-12T20:12:00Z"); // "Hace 3m"
```

---

## ⚙️ Características del Hook

### Polling Automático
- Cada 5 segundos
- Cancelable para clean-up
- No genera memory leaks

### Manejo de Errores
- Try-catch envolvente
- Fallback elegante
- Mantiene datos anteriores si falla

### Normalización de Datos
- Validación de tipos
- Fallbacks seguros
- Filtrado de datos inválidos

### Preparado para WebSockets
```javascript
// Migración futura simple:
// Reemplazar fetch() con:
// - WebSocket.onmessage()
// - setAgents(message.data)
// - Mantener misma interfaz
```

---

## 🎯 Comportamiento UX

### Interacciones

✅ **Click en botón**: Abre/cierra dropdown
✅ **Hover en agente**: Scale 105% + glow
✅ **Scroll**: Suave, overscroll-contain
✅ **Transiciones**: 300ms de duración
✅ **Animaciones**: Pulse para estados dinámicos

### Estados Responsivos

- Mobile: Expandible
- Tablet: Layout óptimo
- Desktop: Full featured

---

## 🚀 Extensibilidad Futura

### WebSockets
```javascript
// Reemplazar polling con WebSocket
const socket = new WebSocket('ws://localhost:8000/agents/stream');
socket.onmessage = (event) => {
  setAgents(normalizeAgents(event.data.agents));
};
```

### Timeline de Actividad
```jsx
<AgentActivityTimeline agent={agent} />
```

### Topología Visual
```jsx
<AgentNetworkTopology agents={agents} />
```

### Métricas Cognitivas Avanzadas
```jsx
<CognitiveMetrics agent={agent} />
```

### Trazas del Orquestador
```jsx
<OrchestratorTraces agent={agent} />
```

---

## 🎨 Paleta de Colores Utilizada

| Variable | Uso |
|----------|-----|
| `primary` | IDLE, badges, general |
| `tertiary-fixed-dim` | WORKING (amarillo) |
| `inverse-primary` | WAITING_REVIEW (azul) |
| `error` | ERROR (rojo) |
| `outline-variant` | OFFLINE (gris) |
| `surface` | Fondos glassmorphism |
| `surface-container` | Cards, contenedores |

---

## 📝 Buenas Prácticas

✅ **Separación de responsabilidades**: Hook, componentes, estilos
✅ **Reutilizable**: Componentes sin dependencias externas
✅ **Performante**: Polling eficiente, cleanup automático
✅ **Resiliente**: Manejo de errores sin crashes
✅ **Escalable**: Preparado para WebSockets y expansión
✅ **Accesible**: Semántica ARIA ready
✅ **Observable**: Console logging para debugging

---

## 🐛 Debugging

### Logs en Consola
```javascript
// El hook registra:
// - Errores de conexión
// - Estado de normalizacion
// - Cambios en la lista de agentes

// En el dropdown:
// - Clicks en botón
// - Cambios de estado
```

### Estado en Redux DevTools (futuro)
```javascript
// Preparado para integración con Redux/Zustand
dispatch(setAgents(agents));
dispatch(setLoading(isLoading));
```

---

## 📋 Checklist de Implementación

- ✅ Hook `useAgentsStatus.js` actualizado
- ✅ Componente `AgentStatusDropdown.jsx` creado
- ✅ Componente `AgentStatusItem.jsx` creado
- ✅ Módulo `statusStyles.js` implementado
- ✅ Integración en `Layout.jsx`
- ✅ Índice de exportaciones
- ✅ Documentación completa

---

## 🔗 Referencias

- **Inspiración Visual**: LangGraph Studio, OpenTelemetry, AI Control Rooms
- **Estética**: Cyber-agro-tech minimalista, glassmorphism, Material Design 3
- **Tecnología**: React 18+, Tailwind CSS, Fetch API, AbortController

---

**Versión**: 1.0.0
**Última actualización**: 12 mayo 2026
**Estado**: Production Ready 🚀

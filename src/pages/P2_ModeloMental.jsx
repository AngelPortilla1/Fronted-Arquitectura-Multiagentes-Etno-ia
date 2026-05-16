import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import { getMentalModelUrl } from '../api/client';

export default function P2_ModeloMental() {
  const navigate = useNavigate();
  const graphRef = useRef();

  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const { pid } = useParams(); // Obtenemos el PID desde la URL dinámicamente

  useEffect(() => {
    fetchMentalModel();
  }, [pid]);

  const fetchMentalModel = async () => {
    setLoading(true);
    try {
      // Intentamos consumir el endpoint de tu arquitectura (Tarea F2.2)
      const response = await fetch(getMentalModelUrl(pid));

      if (response.ok) {
        const data = await response.json();
        const getColorForKind = (kind) => {
          switch (kind?.toLowerCase()) {
            case 'actor': return '#1b3022';
            case 'concept': return '#4d6453';
            case 'belief': return '#ba1a1a';
            case 'fear': return '#805533';
            case 'intention': return '#7a9e32';
            default: return '#1b3022';
          }
        };

        setGraphData({
          nodes: Array.isArray(data.nodes) ? data.nodes.map(n => ({
            ...n,
            group: n.kind || n.group || 'concept',
            desc: n.label || n.desc || '',
            color: n.color || getColorForKind(n.kind || n.group)
          })) : [],
          links: Array.isArray(data.edges) ? data.edges.map(e => ({
            ...e,
            label: e.relation || e.label
          })) : (Array.isArray(data.links) ? data.links : [])
        });
      } else {
        // Fallback de demostración BDI si el backend aún no retorna el formato D3
        // Esto ilustra cómo M_per conecta el relato de la desconfianza digital
        setGraphData({
          nodes: [
            { id: 'Productor', group: 'actor', val: 25, color: '#1b3022', desc: 'Campesino (Vereda Rosal)' },
            { id: 'Teléfono', group: 'concept', val: 15, color: '#4d6453', desc: 'Dispositivo móvil' },
            { id: 'Desconfianza', group: 'belief', val: 20, color: '#ba1a1a', desc: 'Creencia: Uso de app implica riesgo' },
            { id: 'Impuestos', group: 'fear', val: 15, color: '#805533', desc: 'Miedo: Cobros del gobierno' },
            { id: 'Robo de Datos', group: 'fear', val: 15, color: '#805533', desc: 'Miedo: Pérdida de soberanía sobre su finca' },
            { id: 'Cuaderno', group: 'intention', val: 15, color: '#7a9e32', desc: 'Intención: Mantener registro físico' }
          ],
          links: [
            { source: 'Productor', target: 'Teléfono', label: 'tiene_acceso_a' },
            { source: 'Teléfono', target: 'Desconfianza', label: 'genera' },
            { source: 'Desconfianza', target: 'Impuestos', label: 'asociado_a' },
            { source: 'Desconfianza', target: 'Robo de Datos', label: 'asociado_a' },
            { source: 'Productor', target: 'Cuaderno', label: 'prefiere' },
            { source: 'Cuaderno', target: 'Desconfianza', label: 'mitiga' }
          ]
        });
      }
    } catch (err) {
      console.warn('No se pudo conectar con el agente. Mostrando red simulada.', err);
      // Fallback en caso de error de red (CORS o server caído)
      setGraphData({
        nodes: [
          { id: 'Productor', group: 'actor', val: 25, color: '#1b3022', desc: 'Campesino (Vereda Rosal)' },
          { id: 'Teléfono', group: 'concept', val: 15, color: '#4d6453', desc: 'Dispositivo móvil' },
          { id: 'Desconfianza', group: 'belief', val: 20, color: '#ba1a1a', desc: 'Creencia: Uso de app implica riesgo' },
          { id: 'Impuestos', group: 'fear', val: 15, color: '#805533', desc: 'Miedo: Cobros del gobierno' },
          { id: 'Robo de Datos', group: 'fear', val: 15, color: '#805533', desc: 'Miedo: Pérdida de soberanía sobre su finca' },
          { id: 'Cuaderno', group: 'intention', val: 15, color: '#7a9e32', desc: 'Intención: Mantener registro físico' }
        ],
        links: [
          { source: 'Productor', target: 'Teléfono', label: 'tiene_acceso_a' },
          { source: 'Teléfono', target: 'Desconfianza', label: 'genera' },
          { source: 'Desconfianza', target: 'Impuestos', label: 'asociado_a' },
          { source: 'Desconfianza', target: 'Robo de Datos', label: 'asociado_a' },
          { source: 'Productor', target: 'Cuaderno', label: 'prefiere' },
          { source: 'Cuaderno', target: 'Desconfianza', label: 'mitiga' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Ajustar la cámara del grafo una vez que cargue
  useEffect(() => {
    if (!loading && graphRef.current) {
      graphRef.current.d3Force('charge').strength(-400); // Mayor repulsión para separar los nodos
      setTimeout(() => {
        graphRef.current.zoomToFit(400, 50);
      }, 500);
    }
  }, [loading, graphData]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    // Centrar la cámara en el nodo clickeado
    graphRef.current.centerAt(node.x, node.y, 1000);
    graphRef.current.zoom(2, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col h-[calc(100vh-120px)]">

      {/* Header */}
      <header className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/')} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
          </button>
          <h1 className="font-display-lg text-3xl font-bold text-on-surface">Modelo Mental (Grafo BDI)</h1>
        </div>
        <div className="flex justify-between items-center ml-10">
          <p className="font-body-md text-on-surface-variant">
            Visualización interactiva de creencias, deseos e intenciones extraídas por el agente M_per.
          </p>
          <div className="bg-surface-container-high px-4 py-2 rounded-xl text-sm font-label-md text-on-surface flex items-center gap-2 border border-outline-variant/30">
            PID Activo: <span className="text-primary font-bold">{pid}</span>
          </div>
        </div>
      </header>

      {/* Main Content: Grafo + Panel Lateral */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">

        {/* Contenedor del Grafo */}
        <div className="flex-1 bg-surface/80 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl overflow-hidden relative group">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="animate-spin material-symbols-outlined text-4xl text-primary">sync</span>
            </div>
          ) : (
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel="id"
                nodeColor={node => node.color || '#1b3022'}
                nodeRelSize={8}
                linkColor={() => '#c3c8c1'}
                linkWidth={2}
                linkDirectionalArrowLength={6}
                linkDirectionalArrowRelPos={1}
                onNodeClick={handleNodeClick}
                width={800} // Ajuste estático inicial, se puede hacer dinámico con un hook de ResizeObserver
              />
            </div>
          )}

          {/* Leyenda flotante */}
          <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur px-4 py-3 rounded-2xl border border-outline-variant/30 shadow-sm pointer-events-none">
            <h4 className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">Leyenda BDI</h4>
            <div className="space-y-1 text-sm font-label-md">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1b3022]"></span> Actor/Concepto</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span> Creencia de Riesgo</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#805533]"></span> Miedo/Temor</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7a9e32]"></span> Intención Actual</div>
            </div>
          </div>
        </div>

        {/* Panel Lateral (Explicabilidad / XAI) */}
        <div className="w-full md:w-80 bg-surface-container border border-outline-variant/50 rounded-3xl p-6 flex flex-col overflow-y-auto shadow-sm">
          <h3 className="font-headline-md text-xl mb-6 text-on-surface flex items-center gap-2 border-b border-outline-variant/30 pb-4">
            <span className="material-symbols-outlined text-secondary">analytics</span>
            Detalle del Nodo
          </h3>

          {selectedNode ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">Concepto Base</p>
                <p className="font-display-lg text-2xl text-on-surface bg-surface p-3 rounded-xl border border-outline-variant/30">
                  {selectedNode.id}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">Clasificación BDI</p>
                <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-sm font-bold capitalize">
                  {selectedNode.group}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">Traducción Semántica</p>
                <p className="text-on-surface-variant bg-surface-container-highest p-4 rounded-xl leading-relaxed">
                  {selectedNode.desc || 'Sin descripción disponible para este nodo.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <span className="material-symbols-outlined text-5xl mb-4">touch_app</span>
              <p className="font-body-md">Haz clic en cualquier nodo del grafo para examinar la creencia extraída.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
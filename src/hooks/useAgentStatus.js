import { useState, useEffect } from 'react';

export function useAgentsStatus() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Endpoint que definimos en tu FastAPI para el enjambre BDI
        const response = await fetch('http://127.0.0.1:8000/agents/status');
        if (response.ok) {
          const data = await response.json();
          setAgents(data.agents || []);
        }
      } catch (error) {
        console.error("Error monitoreando agentes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
    // Opcional: Actualizar cada 30 segundos
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  return { agents, isLoading };
}
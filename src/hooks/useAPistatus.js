import { useState, useEffect } from 'react';

export function useApiStatus() {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('Offline'); // 'Offline', 'Ollama', 'Stubs'

  useEffect(() => {
    // Función para verificar la salud del backend
    const checkStatus = async () => {
      try {
        // Tarea F4.2: Consulta al endpoint /health
        const response = await fetch('http://127.0.0.1:8000/health', {
          method: 'GET',
          // Tiempo de espera corto para no bloquear la UI
          signal: AbortController.timeout(3000).signal 
        });
        
        if (response.ok) {
          setIsOnline(true);
          try {
            const data = await response.json();
            // Asumimos que el backend podría enviar un campo 'mode', 'llm', 'backend_mode', o similar.
            // Ajustar según el JSON real que devuelva /health.
            const backendMode = data.mode || data.llm_mode || data.status || 'Online';
            if (backendMode.toLowerCase().includes('stub')) {
              setMode('Stubs');
            } else {
              setMode('Ollama'); // Por defecto si está encendido y no dice stub
            }
          } catch (e) {
            setMode('Online');
          }
        } else {
          setIsOnline(false);
          setMode('Offline');
        }
      } catch (err) {
        setIsOnline(false);
        setMode('Offline');
      } finally {
        setLoading(false);
      }
    };

    // Ejecutar inmediatamente al cargar
    checkStatus();

    // Configurar el Polling (Consulta cada 30 segundos)
    const interval = setInterval(checkStatus, 30000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return { isOnline, loading, mode };
}
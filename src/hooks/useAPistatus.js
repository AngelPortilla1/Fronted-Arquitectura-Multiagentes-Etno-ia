import { useState, useEffect } from 'react';

export function useApiStatus() {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

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
        } else {
          setIsOnline(false);
        }
      } catch (err) {
        setIsOnline(false);
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

  return { isOnline, loading };
}
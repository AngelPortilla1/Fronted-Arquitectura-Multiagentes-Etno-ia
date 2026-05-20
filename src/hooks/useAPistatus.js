import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../api/client';

const HEALTH_URL = API_ENDPOINTS.HEALTH;
const POLL_INTERVAL_MS = 30_000; // 30 segundos
const TIMEOUT_MS = 3_000;        // 3 segundos de timeout

/**
 * Hook que monitorea el estado del backend ETNO-IA.
 * Devuelve:
 *   - isOnline  : boolean  → true si /health responde con 2xx
 *   - loading   : boolean  → true durante la primera petición
 *   - mode      : string   → 'Ollama' | 'Stubs' | 'Offline'
 */
export function useApiStatus() {
  const [isOnline, setIsOnline]   = useState(false);
  const [loading,  setLoading]    = useState(true);
  const [mode,     setMode]       = useState('Offline');
  const [modelName, setModelName] = useState('stub');

  // Ref para poder abortar el fetch en el cleanup
  const abortRef = useRef(null);

  useEffect(() => {
    let cancelled = false; // flag de cleanup

    const checkStatus = async () => {
      // --- Crear AbortController con timeout manual ---
      const controller  = new AbortController();
      abortRef.current  = controller;
      const timerId     = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const response = await fetch(HEALTH_URL, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timerId);

        if (cancelled) return;

        if (response.ok) {
          // Leer JSON para saber el proveedor LLM activo
          let backendMode = 'Ollama'; 
          let backendModel = 'stub';

          try {
            const data = await response.json();
            // El backend devuelve: { status: "ok", llm_provider: "ollama", llm_model: "qwen..." }
            const raw = (data.llm_provider || '').toLowerCase();
            const modelLower = (data.llm_model || '').toLowerCase();
            backendModel = data.llm_model || 'stub';

            if (raw.includes('stub') || modelLower === 'stub') {
              backendMode = 'Stubs';
            } else if (modelLower.includes('gemini')) {
              backendMode = 'Gemini';
            } else if (modelLower.includes('claude')) {
              backendMode = 'Anthropic';
            } else if (modelLower.includes('gpt-') || modelLower.includes('o1-')) {
              backendMode = 'OpenAI';
            } else if (raw.includes('ollama') || raw.includes('langchain')) {
              backendMode = 'Ollama';
            } else if (raw === 'openai') {
              // Si el cliente es OpenAI pero el modelo no es GPT, asume el nombre del modelo o un proveedor compatible
              backendMode = 'LLM Remoto';
            } else if (raw) {
              backendMode = raw.charAt(0).toUpperCase() + raw.slice(1);
            }
          } catch {
            // Error en JSON
          }

          setIsOnline(true);
          setMode(backendMode);
          setModelName(backendModel);
          console.log('[useApiStatus] ✅ Backend online. Modo:', backendMode, 'Modelo:', backendModel);
        } else {
          setIsOnline(false);
          setMode('Offline');
        }
      } catch (err) {
        clearTimeout(timerId);
        if (cancelled) return;

        setIsOnline(false);
        setMode('Offline');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Ejecución inmediata
    checkStatus();

    // Polling cada 30 s
    const intervalId = setInterval(checkStatus, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return { isOnline, loading, mode, modelName };
}


import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

// Tipos para os dados da FIPE
type FipeData = { nome: string; codigo: string };
// A resposta da API para modelos tem um formato específico
type FipeModelsResponse = { modelos: FipeData[] };

/**
 * Hook genérico para buscar dados da API FIPE.
 */
function useFipe<T>(url: string | null): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Falha ao buscar dados da FIPE: ${response.statusText}`);
        }
        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        console.error("FIPE API Error:", err);
        if (isMounted) {
          setError(err.message || 'Ocorreu um erro ao buscar na API FIPE.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}

/**
 * Hook para buscar as MARCAS de um tipo de veículo.
 * Garante que a saída seja sempre um array.
 */
export function useFipeBrands(vehicleType?: string) {
  const url = vehicleType ? `${API_BASE_URL}/${vehicleType}/marcas` : null;
  const { data, loading, error } = useFipe<FipeData[]>(url);
  return { data: Array.isArray(data) ? data : [], loading, error };
}

/**
 * Hook para buscar os MODELOS de uma marca.
 * Ele sabe que a resposta da API é um objeto e extrai o array `modelos`.
 */
export function useFipeModels(vehicleType?: string, brandCode?: string) {
    const url = vehicleType && brandCode ? `${API_BASE_URL}/${vehicleType}/marcas/${brandCode}/modelos` : null;
    const { data, loading, error } = useFipe<FipeModelsResponse>(url);
    // A API de modelos retorna { modelos: [], anos: [] }, então pegamos apenas modelos.
    return { data: data?.modelos && Array.isArray(data.modelos) ? data.modelos : [], loading, error };
}

/**
 * Hook para buscar os ANOS de um modelo.
 * Garante que a saída seja sempre um array.
 */
export function useFipeYears(vehicleType?: string, brandCode?: string, modelCode?: string) {
  const url = vehicleType && brandCode && modelCode ? `${API_BASE_URL}/${vehicleType}/marcas/${brandCode}/modelos/${modelCode}/anos` : null;
  const { data, loading, error } = useFipe<FipeData[]>(url);
  return { data: Array.isArray(data) ? data : [], loading, error };
}

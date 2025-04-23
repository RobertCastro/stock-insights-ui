import type { Stock, StocksResponse, StockFilters } from '@/types/stock'

// Base URL de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Log para depuración (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('API_BASE_URL:', API_BASE_URL)
}

/**
 * Opciones por defecto para las peticiones fetch
 */
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
}

/**
 * Maneja los errores de las peticiones HTTP
 * @param response Respuesta de fetch
 * @returns La respuesta JSON o lanza un error
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const errorData = await response.json()
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    } catch (e) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
  }

  return response.json() as Promise<T>
}

/**
 * Construye la URL con los parámetros de consulta
 * @param endpoint Endpoint base
 * @param params Parámetros de consulta
 * @returns URL completa con los parámetros
 */
function buildUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * Servicio para comunicación con la API de stocks
 */
export const stocksApi = {
  /**
   * Obtiene una lista paginada de stocks con opciones de filtrado
   * @param filters Opciones de filtrado y paginación
   * @returns Promesa con los datos paginados de stocks
   */
  async getStocks(filters?: StockFilters): Promise<StocksResponse> {
    const url = buildUrl('/stocks', filters)

    const response = await fetch(url, {
      ...defaultOptions,
      method: 'GET',
    })

    return handleResponse<StocksResponse>(response)
  },

  /**
   * Obtiene los detalles de un stock específico
   * @param ticker Ticker del stock a consultar
   * @returns Promesa con los datos del stock
   */
  async getStockByTicker(ticker: string): Promise<Stock> {
    const url = buildUrl(`/stocks/${ticker}`)

    const response = await fetch(url, {
      ...defaultOptions,
      method: 'GET',
    })

    return handleResponse<Stock>(response)
  },
}

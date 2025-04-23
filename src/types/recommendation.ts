import type { Stock } from './stock'

/**
 * Representa una recomendación de inversión
 */
export interface Recommendation {
  stock: Stock
  score: number
  rationale: string
  potential_return: string
}

/**
 * Respuesta de la API de recomendaciones
 */
export interface RecommendationsResponse {
  recommendations: Recommendation[]
  generated_at: string
  count: number
  message: string
}

/**
 * Tipo de potencial de retorno
 */
export enum PotentialReturn {
  HIGH = 'Alto (>20%)',
  MEDIUM = 'Medio (10-20%)',
  LOW = 'Bajo (<10%)'
}

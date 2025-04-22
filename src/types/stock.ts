/**
 * Representa un stock con sus datos completos
 */
export interface Stock {
  ticker: string
  company: string
  target_from: string
  target_to: string
  action: string
  brokerage: string
  rating_from: string
  rating_to: string
  time: string
}

/**
 * Respuesta paginada de la API de stocks
 */
export interface StocksResponse {
  stocks: Stock[]
  total_stocks: number
  total_pages: number
  current_page: number
  items_per_page: number
}

/**
 * Acciones posibles de casas de bolsa sobre stocks
 */
export enum StockAction {
  UPGRADED = 'upgraded by',
  DOWNGRADED = 'downgraded by',
  REITERATED = 'reiterated by',
  INITIATED = 'initiated by',
  MAINTAINED = 'maintained by',
}

/**
 * Parámetros para filtrar y ordenar stocks
 */
export interface StockFilters {
  page?: number
  page_size?: number
  ticker?: string
  brokerage?: string
  rating?: string
  action?: string
  order_by?: string
  sort?: 'ASC' | 'DESC'
}

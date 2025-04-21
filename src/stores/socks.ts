import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Stock, StocksResponse, StockFilters } from '@/types/stock'
import { stocksApi } from '@/services/api'

export const useStocksStore = defineStore('stocks', () => {
  // Estado
  const stocks = ref<Stock[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalStocks = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Filtros actuales
  const filters = ref<StockFilters>({
    page: 1,
    page_size: 10,
  })

  // Getters
  const hasStocks = computed(() => stocks.value.length > 0)
  const isEmpty = computed(() => !isLoading.value && stocks.value.length === 0)
  const hasError = computed(() => error.value !== null)

  // Acciones

  /**
   * Carga los stocks con los filtros actuales
   */
  async function fetchStocks() {
    isLoading.value = true
    error.value = null

    try {
      const response = await stocksApi.getStocks(filters.value)

      stocks.value = response.stocks
      totalStocks.value = response.total_stocks
      totalPages.value = response.total_pages
      currentPage.value = response.current_page
      itemsPerPage.value = response.items_per_page
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar los stocks'
      stocks.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Actualiza los filtros y recarga los stocks
   * @param newFilters Nuevos filtros a aplicar
   */
  async function updateFilters(newFilters: Partial<StockFilters>) {
    filters.value = {
      ...filters.value,
      ...newFilters,
    }

    await fetchStocks()
  }

  return {
    // Estado
    stocks,
    isLoading,
    error,
    totalStocks,
    totalPages,
    currentPage,
    itemsPerPage,
    filters,

    // Getters
    hasStocks,
    isEmpty,
    hasError,

    // Acciones
    fetchStocks,
    updateFilters,
  }
})

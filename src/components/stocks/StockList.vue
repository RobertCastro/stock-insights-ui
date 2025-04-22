<template>
  <div class="stock-list-container p-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Stock Recommendations</h2>
        <p class="text-sm text-gray-500 mt-1">
          Latest ratings and price targets from top brokerages
        </p>
      </div>

      <!-- Filtro rápido -->
      <div class="mt-4 md:mt-0 w-full md:w-auto">
        <div class="relative">
          <input
            type="text"
            placeholder="Buscar por ticker..."
            v-model="searchQuery"
            @input="handleSearch"
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros avanzados -->
    <StockFiltersPanel
      :initial-filters="stocksStore.filters"
      @update:filters="handleFiltersUpdate"
    />

    <!-- Filtros activos -->
    <ActiveFilters :filters="stocksStore.filters" @update:filters="handleFiltersUpdate" />

    <!-- Estado de carga -->
    <div v-if="stocksStore.isLoading" class="bg-white rounded-lg shadow p-6">
      <div class="animate-pulse space-y-4">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div
      v-else-if="stocksStore.hasError"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong class="font-bold">Error: </strong>
      <span class="block sm:inline">{{ stocksStore.error }}</span>
      <button
        @click="stocksStore.fetchStocks()"
        class="mt-2 inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
      >
        Retry
      </button>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="stocksStore.isEmpty" class="text-center py-12 bg-white rounded-lg shadow">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No results found</h3>
      <p class="mt-1 text-sm text-gray-500">Try different search criteria.</p>
    </div>

    <!-- Lista de stocks -->
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ticker
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Company
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Brokerage
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              From
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              To
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Price Target
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="stock in stocksStore.stocks" :key="stock.ticker" class="hover:bg-gray-50">
            <td class="py-3 px-4 font-medium text-gray-900">
              <router-link :to="`/stocks/${stock.ticker}`" class="hover:text-blue-600">
                {{ stock.ticker }}
              </router-link>
            </td>
            <td class="py-3 px-4 text-gray-600">{{ stock.company }}</td>
            <td class="py-3 px-4 text-gray-600">{{ stock.brokerage }}</td>
            <td class="py-3 px-4 text-gray-600">
              <span class="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100">
                {{ formatAction(stock.action) }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span :class="getRatingClassTailwind(stock.rating_from, stock.rating_to)">
                {{ stock.rating_from }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span :class="getRatingClassTailwind(stock.rating_from, stock.rating_to)">
                {{ stock.rating_to }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span :class="getPriceClassTailwind(stock.target_from, stock.target_to)">
                {{ stock.target_from }} → {{ stock.target_to }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación mejorada -->
    <div v-if="stocksStore.hasStocks" class="flex justify-between items-center mt-6 text-sm">
      <div class="text-gray-600">
        Showing {{ (stocksStore.currentPage - 1) * stocksStore.itemsPerPage + 1 }} -
        {{ Math.min(stocksStore.currentPage * stocksStore.itemsPerPage, stocksStore.totalStocks) }}
        de {{ stocksStore.totalStocks }} results
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="stocksStore.updateFilters({ page: stocksStore.currentPage - 1 })"
          :disabled="stocksStore.currentPage <= 1"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="px-3 py-2 bg-gray-100 rounded-md">
          Page {{ stocksStore.currentPage }} de {{ stocksStore.totalPages }}
        </span>
        <button
          @click="stocksStore.updateFilters({ page: stocksStore.currentPage + 1 })"
          :disabled="stocksStore.currentPage >= stocksStore.totalPages"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import type { StockFilters } from '@/types/stock'
import StockFiltersPanel from './StockFilters.vue'
import ActiveFilters from './ActiveFilters.vue'

const stocksStore = useStocksStore()

// Variable campo de búsqueda
const searchQuery = ref('')

let searchTimeout: number | null = null

// Cargar los stocks
onMounted(() => {
  stocksStore.fetchStocks()

  if (stocksStore.filters.ticker) {
    searchQuery.value = stocksStore.filters.ticker
  }
})

watch(
  () => stocksStore.filters.ticker,
  (newTicker) => {
    // Solo actualizar si es diferente para evitar bucles
    if (newTicker !== searchQuery.value) {
      searchQuery.value = newTicker || ''
    }
  },
)

function handleSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    stocksStore.updateFilters({
      ticker: searchQuery.value,
      page: 1,
    })
  }, 300) as unknown as number
}

function handleFiltersUpdate(newFilters: Partial<StockFilters>) {
  stocksStore.updateFilters(newFilters)
}

function formatAction(action: string): string {
  switch (action) {
    case 'upgraded by':
      return 'Upgraded'
    case 'downgraded by':
      return 'Downgraded'
    case 'reiterated by':
      return 'Reiterated'
    case 'initiated by':
      return 'Initiated'
    case 'maintained by':
      return 'Maintained'
    default:
      return action
  }
}

function getRatingClassTailwind(from: string, to: string): string {
  const fromLower = from.toLowerCase()
  const toLower = to.toLowerCase()

  // Patrones para determinar si es upgrade o downgrade
  const positiveRatings = ['buy', 'outperform', 'overweight']
  const negativeRatings = ['sell', 'underperform', 'underweight']

  // Determinar dirección del cambio
  if (fromLower === toLower) {
    return 'text-gray-600'
  } else if (
    (negativeRatings.some((r) => fromLower.includes(r)) &&
      !negativeRatings.some((r) => toLower.includes(r))) ||
    (!positiveRatings.some((r) => fromLower.includes(r)) &&
      positiveRatings.some((r) => toLower.includes(r)))
  ) {
    return 'text-green-600 font-medium'
  } else {
    return 'text-red-600 font-medium'
  }
}

function getPriceClassTailwind(from: string, to: string): string {
  const fromValue = parseFloat(from.replace('$', ''))
  const toValue = parseFloat(to.replace('$', ''))

  if (toValue > fromValue) {
    return 'text-green-600 font-medium'
  } else if (toValue < fromValue) {
    return 'text-red-600 font-medium'
  } else {
    return 'text-gray-600'
  }
}
</script>

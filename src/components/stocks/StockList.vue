<script setup lang="ts">
import { onMounted } from 'vue'
import { useStocksStore } from '@/stores/stocks'

const stocksStore = useStocksStore()

onMounted(() => {
  stocksStore.fetchStocks()
})
</script>

<template>
  <div class="stock-list-container p-4">
    <h2 class="text-2xl font-bold mb-4">Stock Insights</h2>

    <!-- Estado de carga -->
    <div v-if="stocksStore.isLoading" class="flex justify-center py-8">
      <div class="animate-pulse flex space-x-4">
        <div class="flex-1 space-y-6 py-1">
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="stocksStore.hasError" class="bg-downgrade-light text-downgrade p-4 rounded">
      <p>{{ stocksStore.error }}</p>
      <button
        @click="stocksStore.fetchStocks()"
        class="mt-2 bg-downgrade text-white px-4 py-2 rounded hover:bg-downgrade-dark"
      >
        Reintentar
      </button>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="stocksStore.isEmpty" class="text-center py-8 text-gray-500">
      <p>No se encontraron stocks con los filtros actuales.</p>
    </div>

    <!-- Lista de stocks -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left">Ticker</th>
            <th class="py-3 px-4 text-left">Company</th>
            <th class="py-3 px-4 text-left">Brokerage</th>
            <th class="py-3 px-4 text-left">Action</th>
            <th class="py-3 px-4 text-left">From</th>
            <th class="py-3 px-4 text-left">To</th>
            <th class="py-3 px-4 text-left">Price Target</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stock in stocksStore.stocks"
            :key="stock.ticker"
            class="border-t hover:bg-gray-50"
          >
            <td class="py-3 px-4 font-medium">{{ stock.ticker }}</td>
            <td class="py-3 px-4">{{ stock.company }}</td>
            <td class="py-3 px-4">{{ stock.brokerage }}</td>
            <td class="py-3 px-4">{{ stock.action }}</td>
            <td class="py-3 px-4">
              <span :class="getRatingClass(stock.rating_from, stock.rating_to)">
                {{ stock.rating_from }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span :class="getRatingClass(stock.rating_from, stock.rating_to)">
                {{ stock.rating_to }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span :class="getPriceClass(stock.target_from, stock.target_to)">
                {{ stock.target_from }} → {{ stock.target_to }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="stocksStore.hasStocks" class="flex justify-between items-center mt-4">
      <div>
        Mostrando {{ stocksStore.stocks.length }} de {{ stocksStore.totalStocks }} resultados
      </div>
      <div class="flex space-x-2">
        <button
          @click="stocksStore.updateFilters({ page: stocksStore.currentPage - 1 })"
          :disabled="stocksStore.currentPage <= 1"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span class="px-4 py-2">
          Página {{ stocksStore.currentPage }} de {{ stocksStore.totalPages }}
        </span>
        <button
          @click="stocksStore.updateFilters({ page: stocksStore.currentPage + 1 })"
          :disabled="stocksStore.currentPage >= stocksStore.totalPages"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Funciones auxiliares para clases CSS basadas en cambios
function getRatingClass(from: string, to: string): string {
  const fromLower = from.toLowerCase()
  const toLower = to.toLowerCase()

  // Patrones comunes para determinar si es upgrade o downgrade
  const positiveRatings = ['buy', 'outperform', 'overweight']
  const negativeRatings = ['sell', 'underperform', 'underweight']

  // Determinar dirección del cambio
  if (fromLower === toLower) {
    return 'text-neutral'
  } else if (
    (negativeRatings.some((r) => fromLower.includes(r)) &&
      !negativeRatings.some((r) => toLower.includes(r))) ||
    (!positiveRatings.some((r) => fromLower.includes(r)) &&
      positiveRatings.some((r) => toLower.includes(r)))
  ) {
    return 'text-upgrade font-medium'
  } else {
    return 'text-downgrade font-medium'
  }
}

function getPriceClass(from: string, to: string): string {
  // Eliminar símbolo $ y convertir a números
  const fromValue = parseFloat(from.replace('$', ''))
  const toValue = parseFloat(to.replace('$', ''))

  if (toValue > fromValue) {
    return 'text-upgrade font-medium'
  } else if (toValue < fromValue) {
    return 'text-downgrade font-medium'
  } else {
    return 'text-neutral'
  }
}
</script>

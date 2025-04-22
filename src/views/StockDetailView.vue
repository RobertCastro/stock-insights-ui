<template>
  <div class="container max-w-full px-6 py-8">
    <!-- Barra de navegación de migas de pan -->
    <div class="py-4">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link
              to="/"
              class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <svg
                class="w-3 h-3 mr-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
                />
              </svg>
              Home
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <svg
                class="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <router-link
                to="/stocks"
                class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >Stocks</router-link
              >
            </div>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <svg
                class="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">{{ ticker }}</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="bg-white rounded-lg shadow p-6">
      <div class="animate-pulse space-y-4">
        <div class="h-6 bg-gray-200 rounded w-1/4"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div class="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      role="alert"
    >
      <strong class="font-bold">Error: </strong>
      <span class="block sm:inline">{{ error }}</span>
      <button
        @click="loadStockData"
        class="mt-2 inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
      >
        Retry
      </button>
    </div>

    <!-- Detalles del stock -->
    <div v-else-if="stock" class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="px-6 py-8 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ stock.ticker }}</h1>
            <p class="text-lg text-gray-600">{{ stock.company }}</p>
          </div>
          <div class="bg-gray-100 px-4 py-2 rounded-lg">
            <div class="text-sm text-gray-500">Price Target</div>
            <div
              :class="getPriceClass(stock.target_from, stock.target_to)"
              class="text-xl font-bold"
            >
              {{ stock.target_from }} → {{ stock.target_to }}
            </div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">Latest Recommendation</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Brokerage</h3>
            <p class="text-lg">{{ stock.brokerage }}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Action</h3>
            <p class="text-lg">{{ formatAction(stock.action) }}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Rating Change</h3>
            <p class="text-lg">
              <span :class="getRatingClass(stock.rating_from, stock.rating_to)">
                {{ stock.rating_from }} → {{ stock.rating_to }}
              </span>
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Date</h3>
            <p class="text-lg">{{ formatDate(stock.time) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No existe el stock -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
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
      <h3 class="mt-2 text-sm font-medium text-gray-900">Stock not found</h3>
      <p class="mt-1 text-sm text-gray-500">No information found for the ticker {{ ticker }}.</p>
      <div class="mt-6">
        <router-link
          to="/stocks"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          See all stocks
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import type { Stock } from '@/types/stock'

// Props
const props = defineProps<{
  ticker: string
}>()

// Estado
const stock = ref<Stock | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const stocksStore = useStocksStore()

onMounted(() => {
  loadStockData()
})

async function loadStockData() {
  isLoading.value = true
  error.value = null

  try {
    const stockData = await stocksStore.getStockByTicker(props.ticker)
    stock.value = stockData
  } catch (err) {
    error.value = err instanceof Error ? err.message : `Error al cargar el stock ${props.ticker}`
  } finally {
    isLoading.value = false
  }
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function getRatingClass(from: string, to: string): string {
  const fromLower = from.toLowerCase()
  const toLower = to.toLowerCase()

  const positiveRatings = ['buy', 'outperform', 'overweight']
  const negativeRatings = ['sell', 'underperform', 'underweight']

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

function getPriceClass(from: string, to: string): string {
  const fromValue = parseFloat(from.replace('$', ''))
  const toValue = parseFloat(to.replace('$', ''))

  if (toValue > fromValue) {
    return 'text-green-600'
  } else if (toValue < fromValue) {
    return 'text-red-600'
  } else {
    return 'text-gray-600'
  }
}
</script>

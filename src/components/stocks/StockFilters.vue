<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">Advanced filters</h3>
      <button
        @click="toggleFilters"
        class="text-sm flex items-center text-gray-500 hover:text-gray-700"
      >
        <span v-if="isExpanded">Hide filters</span>
        <span v-else>Show filters</span>
        <svg
          class="ml-1 h-5 w-5"
          :class="{ 'transform rotate-180': isExpanded }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <div v-if="isExpanded" class="space-y-4 mt-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Filtro por Brokerage -->
        <div>
          <label for="brokerage" class="block text-sm font-medium text-gray-700 mb-1">
            Brokerage
          </label>
          <select
            id="brokerage"
            v-model="filters.brokerage"
            @change="applyFilters"
            class="border border-input mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todos</option>
            <option v-for="brokerage in brokerages" :key="brokerage" :value="brokerage">
              {{ brokerage }}
            </option>
          </select>
        </div>

        <!-- Filtro por Rating -->
        <div>
          <label for="rating" class="block text-sm font-medium text-gray-700 mb-1"> Rating </label>
          <select
            id="rating"
            v-model="filters.rating"
            @change="applyFilters"
            class="border border-input mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todos</option>
            <option v-for="rating in ratings" :key="rating" :value="rating">
              {{ rating }}
            </option>
          </select>
        </div>

        <!-- Filtro por Acción -->
        <div>
          <label for="action" class="block text-sm font-medium text-gray-700 mb-1"> Acción </label>
          <select
            id="action"
            v-model="filters.action"
            @change="applyFilters"
            class="border border-input mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todas</option>
            <option value="upgraded by">Upgraded</option>
            <option value="downgraded by">Downgraded</option>
            <option value="reiterated by">Reiterated</option>
            <option value="initiated by">Initiated</option>
            <option value="maintained by">Maintained</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Ordenamiento -->
        <div>
          <label for="order_by" class="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            id="order_by"
            v-model="filters.order_by"
            @change="applyFilters"
            class="border border-input mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Unsorted</option>
            <option value="ticker">Ticker</option>
            <option value="company">Company</option>
            <option value="brokerage">Brokerage</option>
            <option value="time">Date</option>
          </select>
        </div>

        <!-- Dirección del ordenamiento -->
        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-1"> Direction </label>
          <select
            id="sort"
            v-model="filters.sort"
            @change="applyFilters"
            class="border border-input mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="ASC">Ascendant</option>
            <option value="DESC">Descending</option>
          </select>
        </div>

        <!-- Resultados por página -->
        <div>
          <label for="page_size" class="block text-sm font-medium text-gray-700 mb-1">
            Results per page
          </label>
          <select
            id="page_size"
            v-model="filters.page_size"
            @change="applyFilters"
            class="border border-input mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end pt-4 space-x-3">
        <button
          @click="clearFilters"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clean filters
        </button>
        <button
          @click="applyFilters"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import type { StockFilters } from '@/types/stock'

const props = defineProps<{
  initialFilters?: Partial<StockFilters>
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: Partial<StockFilters>): void
}>()

const isExpanded = ref(false)
const brokerages = ref<string[]>([])
const ratings = ref<string[]>([])
const stocksStore = useStocksStore()

// Inicializar filtros con valores por defecto
const filters = reactive<StockFilters>({
  page: 1,
  page_size: 10,
  ticker: '',
  brokerage: '',
  rating: '',
  action: '',
  order_by: '',
  sort: 'ASC',
  ...props.initialFilters,
})

// Cargar datos para los selectores al montar el componente
onMounted(async () => {
  await loadBrokerages()
  await loadRatings()
})

// Función para cargar la lista de brokerages
async function loadBrokerages() {
  try {
    // TODO: obtener esta lista desde la API
    brokerages.value = [
      'The Goldman Sachs Group',
      'Morgan Stanley',
      'JP Morgan',
      'Wedbush',
      'Barclays',
      'Bank of America',
      'Credit Suisse',
      'Deutsche Bank',
      'UBS',
      'Citigroup',
    ]
  } catch (error) {
    console.error('Error al cargar brokerages:', error)
  }
}

// Cargar la lista de ratings
async function loadRatings() {
  try {
    // TODO: obtener esta lista desde la API
    ratings.value = [
      'Buy',
      'Outperform',
      'Neutral',
      'Equal-Weight',
      'Sell',
      'Underperform',
      'Overweight',
      'Underweight',
    ]
  } catch (error) {
    console.error('Error al cargar ratings:', error)
  }
}

function toggleFilters() {
  isExpanded.value = !isExpanded.value
}

function applyFilters() {
  emit('update:filters', { ...filters, page: 1 })
  stocksStore.updateFilters({ ...filters, page: 1 })
}

function clearFilters() {
  Object.assign(filters, {
    page: 1,
    page_size: 10,
    ticker: '',
    brokerage: '',
    rating: '',
    action: '',
    order_by: '',
    sort: 'ASC',
  })
  applyFilters()
}
</script>

<template>
  <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-4">
    <div class="text-sm text-gray-600 py-1">Active filters:</div>

    <!-- Ticker filter chip -->
    <div
      v-if="filters.ticker"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
    >
      Ticker: {{ filters.ticker }}
      <button
        @click="removeFilter('ticker')"
        class="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
      >
        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Brokerage filter chip -->
    <div
      v-if="filters.brokerage"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
    >
      Brokerage: {{ filters.brokerage }}
      <button
        @click="removeFilter('brokerage')"
        class="ml-1 text-green-500 hover:text-green-700 focus:outline-none"
      >
        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Rating filter chip -->
    <div
      v-if="filters.rating"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
    >
      Rating: {{ filters.rating }}
      <button
        @click="removeFilter('rating')"
        class="ml-1 text-purple-500 hover:text-purple-700 focus:outline-none"
      >
        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Action filter chip -->
    <div
      v-if="filters.action"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
    >
      Acción: {{ formatAction(filters.action) }}
      <button
        @click="removeFilter('action')"
        class="ml-1 text-yellow-500 hover:text-yellow-700 focus:outline-none"
      >
        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Order by filter chip -->
    <div
      v-if="filters.order_by"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
    >
      Ordenar por: {{ formatOrderBy(filters.order_by) }} ({{
        filters.sort === 'ASC' ? 'Asc' : 'Desc'
      }})
      <button
        @click="removeFilter('order_by')"
        class="ml-1 text-red-500 hover:text-red-700 focus:outline-none"
      >
        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Clear all filters button -->
    <button
      @click="clearAllFilters"
      class="text-sm text-gray-500 hover:text-gray-700 ml-auto underline focus:outline-none"
    >
      Clean all
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import type { StockFilters } from '@/types/stock'

const stocksStore = useStocksStore()

const props = defineProps<{
  filters: StockFilters
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: Partial<StockFilters>): void
}>()

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  const { ticker, brokerage, rating, action, order_by } = props.filters
  return !!(ticker || brokerage || rating || action || order_by)
})

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

function formatOrderBy(field: string): string {
  switch (field) {
    case 'ticker':
      return 'Ticker'
    case 'company':
      return 'Compañía'
    case 'brokerage':
      return 'Brokerage'
    case 'time':
      return 'Fecha'
    default:
      return field
  }
}

// Eliminar un filtro específico
function removeFilter(filterKey: keyof StockFilters) {
  const updatedFilters = { ...props.filters, [filterKey]: '', page: 1 }

  if (filterKey === 'order_by') {
    updatedFilters.sort = 'ASC'
  }

  emit('update:filters', updatedFilters)
  stocksStore.updateFilters(updatedFilters)
}

function clearAllFilters() {
  const clearedFilters = {
    ...props.filters,
    ticker: '',
    brokerage: '',
    rating: '',
    action: '',
    order_by: '',
    sort: 'ASC',
    page: 1,
  }

  // Emitir evento con los filtros actualizados
  emit('update:filters', clearedFilters)

  //  Actualizar el store directamente
  stocksStore.updateFilters(clearedFilters)
}
</script>

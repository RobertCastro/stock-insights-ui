<template>
  <div class="recommendations-container">
    <!-- Encabezado con información general -->
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Top recommendations</h2>
          <p class="text-sm text-gray-500 mt-1" v-if="recommendations.generated_at">
            Generated: {{ formatGeneratedAt(recommendations.generated_at) }}
          </p>
        </div>

        <div class="mt-4 md:mt-0 bg-blue-50 px-4 py-2 rounded-lg">
          <span class="text-blue-700 font-medium">{{ recommendations.count }}</span>
          <span class="text-blue-600"> available recommendations</span>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
        <div class="flex justify-between mb-4">
          <div>
            <div class="h-5 bg-gray-200 rounded w-20"></div>
            <div class="h-4 bg-gray-200 rounded w-32 mt-2"></div>
          </div>
          <div class="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
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
        @click="loadRecommendations"
        class="mt-2 inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
      >
        Retry
      </button>
    </div>

    <!-- Sin recomendaciones -->
    <div
      v-else-if="!hasRecommendations"
      class="text-center py-12 bg-white rounded-lg shadow border"
    >
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
      <h3 class="mt-2 text-sm font-medium text-gray-900">No recommendations available</h3>
      <p class="mt-1 text-sm text-gray-500">Please try again later.</p>
    </div>

    <!-- Lista de recomendaciones -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <RecommendationCard
        v-for="recommendation in recommendations.recommendations"
        :key="recommendation.stock.ticker"
        :recommendation="recommendation"
      />
    </div>

    <!-- Ver más / Ver todas -->
    <!-- <div v-if="hasRecommendations && recommendations.count > limit" class="mt-6 text-center">
      <router-link
        to="/recommendations"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        See all recommendations
      </router-link>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { stocksApi } from '@/services/api'
import type { RecommendationsResponse } from '@/types/recommendation'
import RecommendationCard from './RecommendationCard.vue'

// Props
const props = defineProps({
  limit: {
    type: Number,
    default: 3,
  },
})

// Estado
const recommendations = ref<RecommendationsResponse>({
  recommendations: [],
  generated_at: '',
  count: 0,
  message: '',
})
const isLoading = ref(true)
const error = ref<string | null>(null)

// Computados
const hasRecommendations = computed(
  () =>
    recommendations.value &&
    recommendations.value.recommendations &&
    recommendations.value.recommendations.length > 0,
)

// Cargar las recomendaciones al montar el componente
onMounted(() => {
  loadRecommendations()
})

// Función para cargar recomendaciones
async function loadRecommendations() {
  isLoading.value = true
  error.value = null

  try {
    const response = await stocksApi.getRecommendations(props.limit)
    recommendations.value = response
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar las recomendaciones'
  } finally {
    isLoading.value = false
  }
}

// Función para cargar todas las recomendaciones
// function loadMoreRecommendations() {
//   // Puedes implementar aquí la navegación a una página de todas las recomendaciones
//   // O cargar más recomendaciones en esta misma vista
//   console.log('Cargar más recomendaciones')
// }

// Formatea la fecha de generación
function formatGeneratedAt(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>

<template>
  <div class="recommendations-ticker w-full overflow-hidden">
    <!-- Estado de carga -->
    <div v-if="isLoading" class="flex space-x-4 animate-pulse overflow-x-auto py-2 px-4">
      <div
        v-for="n in 10"
        :key="n"
        class="flex-shrink-0 bg-white rounded-md shadow-sm border w-36 h-8"
      ></div>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="bg-red-50 px-4 py-2 text-red-700 text-sm rounded-md">
      Error: {{ error }}
    </div>

    <!-- Sin recomendaciones -->
    <div v-else-if="!hasRecommendations" class="text-center py-2 px-4 text-gray-500 text-sm">
      No recommendations available
    </div>

    <!-- Carrusel de tickers -->
    <div v-else ref="tickerContainer" class="ticker-container w-full overflow-hidden">
      <div
        class="ticker-wrapper flex space-x-6 py-2 px-4 animate-ticker"
        :style="{ animation: `ticker ${animationDuration}s linear infinite` }"
      >
        <div
          v-for="recommendation in allTickers"
          :key="`${recommendation.stock.ticker}-${Math.random()}`"
          class="ticker-item flex-shrink-0"
        >
          <div
            class="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            @click="navigateToStock(recommendation.stock.ticker)"
          >
            <span
              class="font-bold text-sm"
              :class="getTickerColorClass(recommendation.stock.action)"
            >
              {{ recommendation.stock.ticker }}
            </span>

            <span
              class="text-sm font-medium"
              :class="
                getPriceClass(recommendation.stock.target_from, recommendation.stock.target_to)
              "
            >
              {{
                calculatePriceChange(
                  recommendation.stock.target_from,
                  recommendation.stock.target_to,
                )
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { stocksApi } from '@/services/api'
import type { RecommendationsResponse } from '@/types/recommendation'

const router = useRouter()

// Estado
const recommendations = ref<RecommendationsResponse>({
  recommendations: [],
  generated_at: '',
  count: 0,
  message: '',
})
const isLoading = ref(true)
const error = ref<string | null>(null)
const tickerContainer = ref<HTMLElement | null>(null)

// Computados
const hasRecommendations = computed(
  () =>
    recommendations.value &&
    recommendations.value.recommendations &&
    recommendations.value.recommendations.length > 0,
)

// Duplicamos los tickers para crear efecto infinito
const allTickers = computed(() => {
  if (!hasRecommendations.value) return []
  return [...recommendations.value.recommendations, ...recommendations.value.recommendations]
})

// Calcular duración de la animación basada en el número de elementos
const animationDuration = computed(() => {
  if (!hasRecommendations.value) return 30
  return recommendations.value.recommendations.length * 3
})

// Cargar las recomendaciones al montar el componente
onMounted(() => {
  loadRecommendations()
})

// Función para cargar recomendaciones
async function loadRecommendations() {
  isLoading.value = true
  error.value = null

  try {
    const response = await stocksApi.getRecommendations(20)
    recommendations.value = response
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar recomendaciones'
  } finally {
    isLoading.value = false
  }
}

// Función para navegar al detalle del stock
function navigateToStock(ticker: string) {
  router.push(`/stocks/${ticker}`)
}

// Obtiene clase CSS para el color del ticker según la acción
function getTickerColorClass(action: string): string {
  switch (action) {
    case 'upgraded by':
    case 'target raised by':
      return 'text-green-600'
    case 'downgraded by':
    case 'target lowered by':
      return 'text-red-600'
    case 'reiterated by':
    case 'maintained by':
      return 'text-blue-600'
    case 'initiated by':
      return 'text-yellow-700'
    default:
      return 'text-gray-800'
  }
}

// Calcula el cambio porcentual entre dos precios
function calculatePriceChange(from: string, to: string): string {
  const fromValue = parseFloat(from.replace('$', ''))
  const toValue = parseFloat(to.replace('$', ''))

  if (fromValue === 0) return 'N/A'

  const change = ((toValue - fromValue) / fromValue) * 100
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
}

// Obtiene clase CSS para el cambio de precio objetivo
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

<style>
@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-ticker {
  animation: ticker 30s linear infinite;
  will-change: transform;
  display: inline-flex;
}

.ticker-container {
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
}
</style>

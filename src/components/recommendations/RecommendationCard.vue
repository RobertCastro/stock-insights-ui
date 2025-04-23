<template>
  <div
    class="recommendation-card bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
  >
    <!-- Encabezado con ticker y nombre de empresa -->
    <div class="p-4 border-b">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ recommendation.stock.ticker }}</h3>
          <p class="text-sm text-gray-600 truncate" :title="recommendation.stock.company">
            {{ recommendation.stock.company }}
          </p>
        </div>

        <!-- Puntuación de la recomendación -->
        <div
          class="bg-blue-50 rounded-full h-14 w-14 flex flex-col items-center justify-center border-2 border-blue-200"
        >
          <span class="font-bold text-blue-700">{{ Math.round(recommendation.score) }}</span>
          <span class="text-xs text-blue-600">score</span>
        </div>
      </div>
    </div>

    <!-- Cuerpo de la tarjeta -->
    <div class="p-4 space-y-3">
      <!-- Acción (upgrade, downgrade, etc.) -->
      <div class="flex items-center space-x-2">
        <span
          class="px-2 py-1 text-xs font-semibold rounded"
          :class="getActionClass(recommendation.stock.action)"
        >
          {{ formatAction(recommendation.stock.action) }}
        </span>

        <span
          class="text-sm font-medium"
          :class="getRatingClass(recommendation.stock.rating_from, recommendation.stock.rating_to)"
        >
          {{ recommendation.stock.rating_from }} → {{ recommendation.stock.rating_to }}
        </span>
      </div>

      <!-- Precio objetivo -->
      <div class="text-sm">
        <span class="text-gray-600">Target price: </span>
        <span
          class="font-medium"
          :class="getPriceClass(recommendation.stock.target_from, recommendation.stock.target_to)"
        >
          {{ recommendation.stock.target_from }} → {{ recommendation.stock.target_to }} ({{
            calculatePriceChange(recommendation.stock.target_from, recommendation.stock.target_to)
          }})
        </span>
      </div>

      <!-- Potencial de retorno -->
      <div class="mt-2">
        <span
          class="px-2 py-1 text-xs font-semibold rounded"
          :class="getPotentialClass(recommendation.potential_return)"
        >
          Potential: {{ recommendation.potential_return }}
        </span>
      </div>

      <!-- Rationale -->
      <p class="text-sm text-gray-600 mt-3">
        {{ recommendation.rationale }}
      </p>
    </div>

    <!-- Footer con brokerage y fecha -->
    <div class="px-4 py-3 bg-gray-50 border-t">
      <div class="flex justify-between items-center text-xs text-gray-500">
        <span>{{ recommendation.stock.brokerage }}</span>
        <span>{{ formatDate(recommendation.stock.time) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recommendation } from '@/types/recommendation'

defineProps<{
  recommendation: Recommendation
}>()

// Formatea la acción para mostrarla de forma más legible
function formatAction(action: string): string {
  switch (action) {
    case 'upgraded by':
      return 'UPGRADED'
    case 'downgraded by':
      return 'DOWNGRADED'
    case 'reiterated by':
      return 'REITERATED'
    case 'target raised by':
      return 'TARGET UP'
    case 'target lowered by':
      return 'TARGET DOWN'
    case 'initiated by':
      return 'INITIATED'
    case 'maintained by':
      return 'MAINTAINED'
    default:
      return action.toUpperCase()
  }
}

// Obtiene la clase CSS para la acción
function getActionClass(action: string): string {
  switch (action) {
    case 'upgraded by':
      return 'bg-green-100 text-green-800'
    case 'downgraded by':
      return 'bg-red-100 text-red-800'
    case 'target raised by':
      return 'bg-green-100 text-green-800'
    case 'target lowered by':
      return 'bg-red-100 text-red-800'
    case 'reiterated by':
    case 'maintained by':
      return 'bg-blue-100 text-blue-800'
    case 'initiated by':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
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

// Obtiene clase CSS para el cambio de rating
function getRatingClass(from: string, to: string): string {
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
    return 'text-green-600'
  } else {
    return 'text-red-600'
  }
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

// Obtiene clase CSS para el potencial de retorno
function getPotentialClass(potential: string): string {
  if (potential.includes('Alto')) {
    return 'bg-green-100 text-green-800'
  } else if (potential.includes('Medio')) {
    return 'bg-yellow-100 text-yellow-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}

// Formatea la fecha
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>

<script setup lang="ts">
import StockList from '@/components/stocks/StockList.vue'
import RecommendationsTicker from '@/components/recommendations/RecommendationsTicker.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <!-- Hero section -->
    <div>
      <div class="container max-w-full px-6 py-8">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Stock insights</h1>
        <p class="mt-3 max-w-2xl text-xl">
          Track stock recommendations, ratings, and price targets from top brokerages
        </p>
      </div>
    </div>

    <!-- Ticker de recomendaciones -->
    <div class="bg-gray-50 border-t border-b border-gray-200 w-full overflow-hidden">
      <div class="container max-w-full px-6">
        <div class="flex items-center h-10">
          <div
            class="bg-gray-100 h-full flex items-center px-4 border-r border-gray-200 flex-shrink-0"
          >
            <span class="text-xs font-bold text-gray-700 whitespace-nowrap">TOP RECOS</span>
          </div>
          <div class="flex-grow overflow-hidden">
            <RecommendationsTicker />
          </div>
          <div class="flex items-center h-full px-4 border-l border-gray-200 flex-shrink-0">
            <RouterLink
              to="/recommendations"
              class="text-xs font-bold text-blue-600 hover:text-blue-800 whitespace-nowrap"
            >
              See all →
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Stocks -->
    <div class="container max-w-full px-6 py-8">
      <div class="rounded-lg shadow">
        <StockList />
      </div>
    </div>
  </main>
</template>

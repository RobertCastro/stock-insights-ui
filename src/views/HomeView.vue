<script setup lang="ts">
import StockList from '@/components/stocks/StockList.vue'
</script>

<template>
  <main>
    <!-- Hero section -->
    <div class="bg-gray-100 border-b">
      <div class="container max-w-full px-6 py-8">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Stock Insights</h1>
        <p class="mt-3 max-w-2xl text-xl text-gray-500">
          Track stock recommendations, ratings, and price targets from top brokerages
        </p>
      </div>
    </div>

    <!-- Main content -->
    <div class="container max-w-full px-6 py-8">
      <div class="bg-white rounded-lg shadow">
        <StockList />
      </div>
    </div>
  </main>
</template>

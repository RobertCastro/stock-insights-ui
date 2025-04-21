<script setup lang="ts">
import StockList from '@/components/stocks/StockList.vue'
</script>

<template>
  <main class="container mx-auto">
    <div class="my-8">
      <h1 class="text-3xl font-bold">Stock Insights</h1>
      <p class="text-gray-600 mt-2">
        Track stock recommendations, ratings, and price targets from top brokerages
      </p>
    </div>

    <StockList />
  </main>
</template>

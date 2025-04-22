<template>
  <main>
    <!-- Hero section -->
    <div>
      <div class="container max-w-full px-6 py-8">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Stocks</h1>
        <p class="mt-3 max-w-2xl text-xl">
          Explore and filter stock recommendations from top brokerages
        </p>
      </div>
    </div>

    <!-- Main content -->
    <div class="container max-w-full px-6 py-8">
      <div class="rounded-lg shadow">
        <StockList />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import StockList from '@/components/stocks/StockList.vue'
</script>

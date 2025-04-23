<template>
  <main>
    <!-- Hero section -->
    <div>
      <div class="container max-w-full px-6 py-8">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Investment recommendations
        </h1>
        <p class="mt-3 max-w-2xl text-xl">
          The best investment opportunities selected by our algorithm
        </p>
      </div>
    </div>

    <!-- Recomendaciones -->
    <div class="container max-w-full px-6 py-8">
      <RecommendationsList />
    </div>
  </main>
</template>

<script setup lang="ts">
import RecommendationsList from '@/components/recommendations/RecommendationsList.vue'
</script>

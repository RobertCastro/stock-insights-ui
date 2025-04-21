<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Barra de navegación -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <RouterLink to="/" class="text-xl font-bold text-primary"> Stock Insights </RouterLink>
        </div>

        <nav class="flex space-x-6">
          <RouterLink to="/" class="text-gray-700 hover:text-primary"> Dashboard </RouterLink>
          <RouterLink to="/stocks" class="text-gray-700 hover:text-primary"> Stocks </RouterLink>
          <RouterLink to="/about" class="text-gray-700 hover:text-primary"> About </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <RouterView />
  </div>
</template>
